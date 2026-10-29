import { betterAuth } from 'better-auth'
import { D1Dialect } from 'kysely-d1'

export type UserEnv = {
  CONTENT_DB?: D1Database
  MAMMAL_PHOTOS: R2Bucket
  BETTER_AUTH_SECRET?: string
  AUTH_EMAIL_FROM?: string
  EMAIL?: { send(message:{to:string;from:{email:string;name:string};subject:string;text:string;html:string}):Promise<unknown> }
}

export function userAuth(env:UserEnv,origin:string) {
  if(!env.CONTENT_DB || !env.BETTER_AUTH_SECRET)throw new Error('User accounts are not configured.')
  const send=async(to:string,url:string,subject:string)=>{
    if(!env.EMAIL || !env.AUTH_EMAIL_FROM)throw new Error('Transactional email is not configured.')
    const safe=url.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')
    await env.EMAIL.send({to,from:{email:env.AUTH_EMAIL_FROM,name:'Animavidi'},subject,text:`${subject}\n\n${url}\n\nIf you did not request this, you can ignore this message.`,html:`<h1>Animavidi</h1><p>${subject}</p><p><a href="${safe}">Continue securely</a></p><p>If you did not request this, ignore this message.</p>`})
  }
  return betterAuth({
    appName:'Animavidi',baseURL:origin,basePath:'/api/auth',secret:env.BETTER_AUTH_SECRET,
    database:{dialect:new D1Dialect({database:env.CONTENT_DB}),type:'sqlite',transaction:false},
    trustedOrigins:[origin],
    advanced:{cookiePrefix:'animavidi_user',useSecureCookies:origin.startsWith('https:'),ipAddress:{ipAddressHeaders:['cf-connecting-ip']},defaultCookieAttributes:{sameSite:'lax',httpOnly:true}},
    user:{modelName:'av_user',deleteUser:{enabled:true,beforeDelete:async(user)=>{
      const rows=await env.CONTENT_DB!.prepare('SELECT id FROM bird_proposals WHERE submitter_user_id=?').bind(user.id).all<{id:string}>()
      await env.CONTENT_DB!.prepare('INSERT INTO av_deletion_queue(user_id,ready,contributions) VALUES (?,0,?) ON CONFLICT(user_id) DO UPDATE SET contributions=excluded.contributions WHERE ready=0').bind(user.id,JSON.stringify(rows.results.map(row=>row.id))).run()
    },afterDelete:async(user)=>{
      await env.CONTENT_DB!.prepare('UPDATE av_deletion_queue SET ready=1 WHERE user_id=?').bind(user.id).run()
      await cleanDeletedUsers(env)
    }}},
    session:{modelName:'av_session',expiresIn:60*60*24*30,updateAge:60*60*24,freshAge:60*10,cookieCache:{enabled:false}},
    account:{modelName:'av_account'},verification:{modelName:'av_verification'},
    emailAndPassword:{enabled:true,requireEmailVerification:true,minPasswordLength:12,maxPasswordLength:128,revokeSessionsOnPasswordReset:true,sendResetPassword:async({user,url})=>send(user.email,url,'Reset your Animavidi password')},
    emailVerification:{sendOnSignUp:true,sendOnSignIn:true,expiresIn:3600,autoSignInAfterVerification:false,sendVerificationEmail:async({user,url})=>send(user.email,url,'Verify your Animavidi email address')},
    rateLimit:{enabled:true,storage:'database',modelName:'av_auth_rate',window:60,max:60,customRules:{'/sign-in/email':{window:300,max:10},'/sign-up/email':{window:3600,max:5},'/request-password-reset':{window:3600,max:5},'/send-verification-email':{window:3600,max:5}}},
  })
}

export async function cleanDeletedUsers(env:UserEnv):Promise<void> {
  if(!env.CONTENT_DB)return
  const rows=await env.CONTENT_DB.prepare('SELECT user_id,contributions FROM av_deletion_queue WHERE ready=1 LIMIT 20').all<{user_id:string;contributions:string}>()
  for(const row of rows.results){
    if(await env.CONTENT_DB.prepare('SELECT id FROM av_user WHERE id=?').bind(row.user_id).first())continue
    // Prefix contains only a server-generated Better Auth ID, never a request ID.
    let cursor:string|undefined
    do{const page=await env.MAMMAL_PHOTOS.list({prefix:`private/${row.user_id}/`,cursor});if(page.objects.length)await env.MAMMAL_PHOTOS.delete(page.objects.map((object)=>object.key));cursor=page.truncated?page.cursor:undefined}while(cursor)
    const ids:unknown=JSON.parse(row.contributions)
    if(Array.isArray(ids))for(const id of ids){
      if(typeof id!=='string'||!/^[a-f0-9-]{36}$/.test(id))continue
      const proposal=await env.CONTENT_DB.prepare('SELECT body,status,published_id FROM bird_proposals WHERE id=?').bind(id).first<{body:string;status:string;published_id:string}>()
      await env.MAMMAL_PHOTOS.delete(`contributions/${id}/photo`)
      if(!proposal)continue
      if(proposal.status==='approved'){
        const body=JSON.parse(proposal.body) as Record<string,unknown>;body.author='Deleted contributor';delete body.photoType;delete body.photoRights
        await env.CONTENT_DB.prepare('UPDATE bird_proposals SET body=? WHERE id=?').bind(JSON.stringify(body),id).run()
        await env.CONTENT_DB.prepare("UPDATE approved_birds SET body=json_set(body,'$.author','Deleted contributor') WHERE id=?").bind(proposal.published_id).run()
        await env.CONTENT_DB.prepare("UPDATE bird_proposal_history SET body=json_set(body,'$.author','Deleted contributor') WHERE proposal_id=?").bind(id).run()
      }else{await env.CONTENT_DB.prepare('DELETE FROM bird_proposal_history WHERE proposal_id=?').bind(id).run();await env.CONTENT_DB.prepare('DELETE FROM bird_proposals WHERE id=?').bind(id).run()}
    }
    await env.CONTENT_DB.prepare('DELETE FROM av_deletion_queue WHERE user_id=? AND ready=1').bind(row.user_id).run()
  }
}

export async function verifiedUser(request:Request,env:UserEnv) {
  const session=await userAuth(env,new URL(request.url).origin).api.getSession({headers:request.headers})
  return session?.user.emailVerified ? session.user : undefined
}
