type LimitEnv={CONTENT_DB?:D1Database;BETTER_AUTH_SECRET?:string}
export type RateRule={window:number;max:number}
export const authRules={signup:{window:900,max:30},signin:{window:300,max:60},mail:{window:900,max:30}}
export function trustedClientIp(request:Request):string|null{
  const ip=request.headers.get('CF-Connecting-IP')?.trim();if(!ip||ip.length>64||ip.includes(','))return null
  if(/^\d{1,3}(?:\.\d{1,3}){3}$/.test(ip))return ip.split('.').every(part=>Number(part)<=255)?ip:null
  if(!/^[a-fA-F0-9:.]+$/.test(ip)||!ip.includes(':'))return null
  try{new URL(`http://[${ip}]/`);return ip}catch{return null}
}
/** Atomic shared D1 counters. Denied requests do not prolong the waiting period. */
export async function consumeAuthLimit(env:LimitEnv,scope:string,identity:string,rule:RateRule,now=Math.floor(Date.now()/1000)){
  if(!env.CONTENT_DB||!env.BETTER_AUTH_SECRET)throw new Error('Account rate limiter is not configured.')
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.BETTER_AUTH_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign'])
  const bytes=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(JSON.stringify([scope,identity,rule.window,rule.max])))
  const id='auth-v2:'+Array.from(new Uint8Array(bytes),byte=>byte.toString(16).padStart(2,'0')).join('')
  const row=await env.CONTENT_DB.prepare(`INSERT INTO bird_submission_limits(client_key,window_start,attempts) VALUES (?,?,1)
    ON CONFLICT(client_key) DO UPDATE SET
      attempts=CASE WHEN window_start<=? THEN 1 ELSE MIN(attempts+1,?) END,
      window_start=CASE WHEN window_start<=? OR attempts<? THEN excluded.window_start ELSE window_start END
    RETURNING attempts,window_start`).bind(id,now,now-rule.window,rule.max+1,now-rule.window,rule.max).first<{attempts:number;window_start:number}>()
  if(!row)throw new Error('Account rate limiter unavailable.')
  return{allowed:row.attempts<=rule.max,retryAfter:row.attempts<=rule.max?null:Math.max(1,row.window_start+rule.window-now)}
}
export function rateLimitedResponse(seconds:number){
  const retry=Math.max(1,Math.ceil(seconds)),minutes=Math.ceil(retry/60)
  return Response.json({code:'RATE_LIMITED',message:`Too many attempts. Please try again in ${minutes} ${minutes===1?'minute':'minutes'}.`,retryAfterSeconds:retry},{status:429,headers:{'Retry-After':String(retry),'X-Retry-After':String(retry),'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})
}
