/** Server-only transport. Tests inject fetch; deployed requests always use Resend. */
export type AccountMessage={to:string;subject:string;text:string;html:string}
export type MailEnv={RESEND_API_KEY?:string;AUTH_EMAIL_FROM?:string;EMAIL?:{send(message:AccountMessage & {from:{email:string;name:string}}):Promise<unknown>}}
export const accountSender='no-reply@mail.animavidi.com'
export function mailConfigured(env:MailEnv){return Boolean(env.RESEND_API_KEY||env.EMAIL&&env.AUTH_EMAIL_FROM)}
export async function tokenDigest(token:string){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token)))].map(byte=>byte.toString(16).padStart(2,'0')).join('')}
export async function sendAccountMail(env:MailEnv,message:AccountMessage,transport:typeof fetch=fetch):Promise<void>{
  if(!env.RESEND_API_KEY){if(env.EMAIL&&env.AUTH_EMAIL_FROM){await env.EMAIL.send({...message,from:{email:env.AUTH_EMAIL_FROM,name:'Animavidi'}});return}throw new Error('Account email is not configured.')}
  const body=JSON.stringify({from:`Animavidi <${accountSender}>`,to:[message.to],subject:message.subject,text:message.text,html:message.html})
  const key='animavidi-account-'+await tokenDigest(body)
  for(let attempt=0;attempt<3;attempt++){
    let retry=false
    try{
      const response=await transport('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':key},body,signal:AbortSignal.timeout(8000)})
      if(response.ok){const result:unknown=await response.json();if(result&&typeof result==='object'&&'id'in result&&typeof result.id==='string'&&result.id)return;throw new Error('Invalid account email response.')}
      retry=response.status===429||response.status>=500
      await response.body?.cancel()
      if(!retry)throw new Error('Account email service rejected the request.')
    }catch(error){if(error instanceof Error&&['Account email service rejected the request.','Invalid account email response.'].includes(error.message))throw error;retry=true}
    if(!retry||attempt===2)throw new Error('Account email delivery is temporarily unavailable.')
    await new Promise(resolve=>setTimeout(resolve,250*2**attempt))
  }
}
