import api from './index.ts'
type PreviewEnv=Parameters<typeof api.fetch>[1] & {ASSETS:Fetcher}

// Separate beta entry point. Production routes, bindings and origins stay in
// wrangler.jsonc; this Worker uses only the isolated preview configuration.
export default {
  async fetch(request:Request,env:PreviewEnv):Promise<Response> {
    const url=new URL(request.url)
    if(url.pathname.startsWith('/api/')) {
      const headers=new Headers(request.headers)
      // Same-origin browser GETs omit Origin. Sec-Fetch-Site is browser-controlled.
      if(!headers.has('Origin') && headers.get('Sec-Fetch-Site')==='same-origin')headers.set('Origin',url.origin)
      return api.fetch(new Request(request,{headers}),{...env,ADMIN_ALLOWED_ORIGINS:url.origin,MEDIA_BASE_URL:`${url.origin}/media`})
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
} satisfies ExportedHandler<PreviewEnv>
