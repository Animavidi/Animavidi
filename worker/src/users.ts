import { userAuth,verifiedUser,type UserEnv } from './userAuth.ts'
import { validSighting,personalKeys } from '../../src/features/accounts/model/cloud.ts'
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})
const uuid=(value:string)=>/^[a-f0-9-]{36}$/.test(value)
async function bounded(request:Request,max:number):Promise<Uint8Array>{const reader=request.body?.getReader();if(!reader)throw new Error('Missing request body.');const chunks:Uint8Array[]=[];let size=0;while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>max){await reader.cancel();throw new Error('BODY_TOO_LARGE')}chunks.push(part.value)}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}return bytes}

export async function handleUsers(request:Request,env:UserEnv):Promise<Response>{
  const url=new URL(request.url),origin=request.headers.get('Origin')
  if(request.method!=='GET' && origin!==url.origin)return json({error:'Origin not allowed.'},403)
  if(!env.CONTENT_DB || !env.BETTER_AUTH_SECRET)return json({error:'User accounts are not configured.'},503)
  try{
    if(url.pathname.startsWith('/api/auth/')){
      if(['sign-up/email','request-password-reset','send-verification-email'].some(path=>url.pathname.endsWith('/'+path)) && (!env.EMAIL || !env.AUTH_EMAIL_FROM))return json({error:'Account email delivery is not configured yet. Please retry when the administrator has enabled it.'},503)
      if(request.method==='POST'){const bytes=await bounded(request,16384);request=new Request(request,{body:bytes})}
      return await userAuth(env,url.origin).handler(request)
    }
    const user=await verifiedUser(request,env);if(!user)return json({error:'Sign in with a verified account to continue.'},401)
    const db=env.CONTENT_DB
    if(url.pathname==='/api/me/changes' && request.method==='GET'){
      const after=Number(url.searchParams.get('after') ?? 0);if(!Number.isSafeInteger(after)||after<0)return json({error:'Invalid cursor.'},400)
      const rows=await db.prepare("SELECT c.sequence,c.kind,c.entity_id AS id,COALESCE(s.body,p.body) AS body,COALESCE(s.revision,p.revision) AS revision,COALESCE(s.deleted,p.deleted) AS deleted,COALESCE(s.updated_at,p.updated_at) AS updatedAt FROM av_changes c LEFT JOIN av_sightings s ON c.kind='sighting' AND s.user_id=c.user_id AND s.id=c.entity_id LEFT JOIN av_preferences p ON c.kind='preference' AND p.user_id=c.user_id AND p.id=c.entity_id WHERE c.user_id=? AND c.sequence>? ORDER BY c.sequence LIMIT 101").bind(user.id,after).all<{sequence:number;kind:string;id:string;body:string;revision:number;deleted:number;updatedAt:string}>()
      const items=rows.results.slice(0,100);return json({changes:items.map(row=>({...row,body:JSON.parse(row.body) as unknown})),cursor:items.at(-1)?.sequence ?? after,more:rows.results.length>100})
    }
    if(url.pathname==='/api/me/contributions' && request.method==='GET'){
      const rows=await db.prepare('SELECT id,body,status,created_at FROM bird_proposals WHERE submitter_user_id=? ORDER BY proposal_no').bind(user.id).all<{id:string;body:string;status:string;created_at:string}>()
      return json({items:rows.results.map(row=>({id:row.id,draft:JSON.parse(row.body) as unknown,status:row.status,createdAt:row.created_at}))})
    }
    const photo=url.pathname.match(/^\/api\/me\/photos\/([a-f0-9-]{36})\/([a-f0-9]{64})$/)
    if(photo){
      const key=`private/${user.id}/${photo[1]}/${photo[2]}`
      if(request.method==='PUT'){
        const type=request.headers.get('Content-Type') ?? ''
        if(!/^image\/[a-zA-Z0-9.+-]+$/.test(type))return json({error:'An image is required.'},415)
        const bytes=await bounded(request,10*1024*1024);if(!bytes.length)return json({error:'Empty image.'},400)
        const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(byte=>byte.toString(16).padStart(2,'0')).join('')
        if(digest!==photo[2])return json({error:'Photo checksum mismatch.'},400)
        const existing=await env.MAMMAL_PHOTOS.head(key)
        if(!existing){const stored=await env.MAMMAL_PHOTOS.put(key,bytes,{httpMetadata:{contentType:type,cacheControl:'private, no-store'}});if(!stored)return json({error:'Photo could not be stored.'},503)}
        return json({id:photo[1],sha256:digest,size:bytes.length})
      }
      if(request.method==='GET'){
        const object=await env.MAMMAL_PHOTOS.get(key);if(!object)return json({error:'Photo not found.'},404)
        return new Response(object.body,{headers:{'Content-Type':object.httpMetadata?.contentType ?? 'application/octet-stream','Cache-Control':'private, no-store','Content-Security-Policy':"sandbox; default-src 'none'",'X-Content-Type-Options':'nosniff'}})
      }
    }
    const match=url.pathname.match(/^\/api\/me\/(sightings|preferences)\/(.+)$/)
    if(match && request.method==='PUT'){
      if(!request.headers.get('Content-Type')?.includes('application/json'))return json({error:'JSON required.'},415)
      const id=decodeURIComponent(match[2]),kind=match[1]==='sightings'?'sighting':'preference',table=kind==='sighting'?'av_sightings':'av_preferences'
      if(kind==='sighting'?!uuid(id):!personalKeys.includes(id as typeof personalKeys[number]))return json({error:'Invalid record ID.'},400)
      const raw:unknown=JSON.parse(new TextDecoder().decode(await bounded(request,64000)))
      if(!raw || typeof raw!=='object')return json({error:'Invalid mutation.'},400)
      const input=raw as Record<string,unknown>
      if(typeof input.mutationId!=='string'||!uuid(input.mutationId)||!Number.isSafeInteger(input.baseRevision)||Number(input.baseRevision)<0||typeof input.deleted!=='boolean'||(kind==='sighting'?!validSighting(input.body,id):typeof input.body!=='string'||input.body.length>30000))return json({error:'Invalid record fields.'},400)
      const receipt=await db.prepare('SELECT kind,entity_id,result FROM av_mutations WHERE user_id=? AND mutation_id=?').bind(user.id,input.mutationId).first<{kind:string;entity_id:string;result:string}>()
      if(receipt)return receipt.kind===kind&&receipt.entity_id===id?json(JSON.parse(receipt.result)):json({error:'Mutation ID already used.'},409)
      if(kind==='sighting'&&!input.deleted && validSighting(input.body,id))for(const p of input.body.photos){const object=await env.MAMMAL_PHOTOS.head(`private/${user.id}/${p.id}/${p.sha256}`);if(!object || object.size!==p.size)return json({error:'Upload and verify every photograph before saving this revision.'},409)}
      const row=await db.prepare(`INSERT INTO ${table}(user_id,id,body,revision,deleted,mutation_id,updated_at) SELECT ?,?,?,1,?,?,? WHERE ?=0 ON CONFLICT(user_id,id) DO UPDATE SET body=excluded.body,revision=revision+1,deleted=excluded.deleted,mutation_id=excluded.mutation_id,updated_at=excluded.updated_at WHERE revision=? RETURNING id,body,revision,deleted,updated_at AS updatedAt`).bind(user.id,id,JSON.stringify(input.body),input.deleted?1:0,input.mutationId,new Date().toISOString(),input.baseRevision,input.baseRevision).first<{id:string;body:string;revision:number;deleted:number;updatedAt:string}>()
      // Existing records need an UPDATE even when baseRevision > 0 (INSERT SELECT is empty).
      const saved=row ?? (Number(input.baseRevision)>0 ? await db.prepare(`UPDATE ${table} SET body=?,revision=revision+1,deleted=?,mutation_id=?,updated_at=? WHERE user_id=? AND id=? AND revision=? RETURNING id,body,revision,deleted,updated_at AS updatedAt`).bind(JSON.stringify(input.body),input.deleted?1:0,input.mutationId,new Date().toISOString(),user.id,id,input.baseRevision).first<typeof row>() : null)
      if(saved)return json({...saved,body:JSON.parse(saved.body) as unknown})
      const retry=await db.prepare('SELECT result FROM av_mutations WHERE user_id=? AND mutation_id=?').bind(user.id,input.mutationId).first<{result:string}>();if(retry)return json(JSON.parse(retry.result))
      const current=await db.prepare(`SELECT id,body,revision,deleted,updated_at AS updatedAt FROM ${table} WHERE user_id=? AND id=?`).bind(user.id,id).first<{id:string;body:string;revision:number;deleted:number;updatedAt:string}>()
      return json({error:'This record changed on another device. Both versions are preserved until you resolve it.',current:current?{...current,body:JSON.parse(current.body) as unknown}:null},409)
    }
    return json({error:'Not found.'},404)
  }catch(error){if(error instanceof Error && error.message==='BODY_TOO_LARGE')return json({error:'Request too large.'},413);if(error instanceof SyntaxError)return json({error:'Invalid JSON.'},400);console.error(JSON.stringify({event:'user_api_failure',type:error instanceof Error?error.name:'unknown'}));return json({error:'The account service is temporarily unavailable. Your local changes are retained.'},503)}
}
