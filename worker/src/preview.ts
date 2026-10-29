import api from './index.ts'
import { handleUsers } from './users.ts'
import { cleanDeletedUsers, verifiedUser,type UserEnv } from './userAuth.ts'
type PreviewEnv=Parameters<typeof api.fetch>[1] & UserEnv & {ASSETS:Fetcher}

// Separate beta entry point. Production routes, bindings and origins stay in
// wrangler.jsonc; this Worker uses only the isolated preview configuration.
export default {
  async fetch(request:Request,env:PreviewEnv,context:ExecutionContext):Promise<Response> {
    const url=new URL(request.url)
    if(url.pathname.startsWith('/api/')) {
      const headers=new Headers(request.headers)
      // Same-origin browser GETs omit Origin. Sec-Fetch-Site is browser-controlled.
      if(!headers.has('Origin') && headers.get('Sec-Fetch-Site')==='same-origin')headers.set('Origin',url.origin)
      const incoming=new Request(request,{headers})
      if(url.pathname.startsWith('/api/auth/') || url.pathname.startsWith('/api/me/'))return handleUsers(incoming,env,context)
      let submitter:string|undefined
      if(url.pathname==='/api/bird-proposals' && request.method==='POST'){
        if(headers.get('Origin')!==url.origin)return Response.json({error:'Origin not allowed.'},{status:403})
        try{const user=await verifiedUser(incoming,env);if(!user)return Response.json({error:'Sign in with a verified account to contribute.'},{status:401});submitter=user.id}catch{return Response.json({error:'Account service unavailable.'},{status:503})}
      }
      return api.fetch(incoming,{...env,ADMIN_ALLOWED_ORIGINS:url.origin,MEDIA_BASE_URL:`${url.origin}/media`,SUBMITTER_ID:submitter})
    }
    if(url.pathname.startsWith('/media/')) {
      if(request.method!=='GET' && request.method!=='HEAD')return new Response(null,{status:405})
      const key=url.pathname.slice('/media/'.length)
      if(!/^mammals\/[a-z0-9-]+\/primary\.(?:jpg|png|webp)$/.test(key))return new Response(null,{status:404})
      const object=await env.MAMMAL_PHOTOS.get(key)
      if(!object)return new Response(null,{status:404})
      return new Response(request.method==='HEAD' ? null : object.body,{headers:{'Content-Type':object.httpMetadata?.contentType ?? 'image/webp','X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=3600','ETag':object.httpEtag}})
    }
    const response=await env.ASSETS.fetch(request)
    const headers=new Headers(response.headers)
    headers.set('X-Robots-Tag','noindex, nofollow')
    headers.set('X-Content-Type-Options','nosniff')
    headers.set('Referrer-Policy','strict-origin-when-cross-origin')
    headers.set('Content-Security-Policy',"frame-ancestors 'none'; object-src 'none'; base-uri 'self'")
    return new Response(response.body,{status:response.status,headers})
  },
  async scheduled(_event:ScheduledController,env:PreviewEnv){await cleanDeletedUsers(env)},
} satisfies ExportedHandler<PreviewEnv>
