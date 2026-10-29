import {useEffect,useRef,useState,type FormEvent} from 'react'
import {Link,Navigate,useLocation,useNavigate,useSearchParams} from 'react-router-dom'
import {AppLogo} from '@/components/AppLogo/AppLogo'
import {accountRequest,useAccount} from '../components/AccountProvider'
import hero from '@/assets/welcome/lion-sunset-hero.webp'
import styles from './Accounts.module.css'

export function AccountAccessPage(){
  const location=useLocation()
  return <AccountAccessForm key={location.pathname} />
}
function AccountAccessForm(){
  const location=useLocation(),navigate=useNavigate(),[params]=useSearchParams(),account=useAccount()
  const mode=location.pathname==='/account/create'?'register':location.pathname==='/account/forgot'?'forgot':location.pathname==='/account/reset'?'reset':'login'
  const routeState:unknown=location.state
  const initialEmail=routeState&&typeof routeState==='object'&&'email'in routeState&&typeof routeState.email==='string'&&routeState.email.length<=254?routeState.email:''
  const [name,setName]=useState(''),[email,setEmail]=useState(initialEmail),[password,setPassword]=useState(''),[message,setMessage]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[registrationAccepted,setRegistrationAccepted]=useState(false)
  const submitting=useRef(false),heading=useRef<HTMLHeadingElement>(null)
  const requested=params.get('returnTo') ?? '/parks/kruger',destination=/^\/(parks\/kruger|passport|my-animavidi|my-camps)(?:[/?#]|$)/.test(requested)?requested:'/parks/kruger'
  useEffect(()=>{if(registrationAccepted){heading.current?.focus({preventScroll:true});heading.current?.scrollIntoView({block:'center'})}},[registrationAccepted])
  if(account.user && mode==='login')return <Navigate replace to={destination} />
  async function submit(event:FormEvent){
    event.preventDefault();if(submitting.current)return;submitting.current=true;setBusy(true);setError('');setMessage('')
    try{
      if(mode==='register'){
        await accountRequest('sign-up/email',{name,email,password,callbackURL:window.location.origin+'/login?verified=1'})
        setPassword('');setRegistrationAccepted(true)
      }else if(mode==='forgot'){
        await accountRequest('request-password-reset',{email,redirectTo:window.location.origin+'/account/reset'})
        setMessage('If this account exists, a password reset link has been requested. Check your inbox.')
      }else if(mode==='reset'){
        await accountRequest('reset-password',{token:params.get('token'),newPassword:password});setPassword('');await account.refresh()
        setMessage('Password updated. Sign in with your new password. Previous sessions have been revoked.')
      }else{
        if(localStorage.getItem('animavidi:logout-pending')){await accountRequest('sign-out',{});localStorage.removeItem('animavidi:logout-pending')}
        await accountRequest('sign-in/email',{email,password});setPassword('');await account.refresh();void navigate(destination,{replace:true})
      }
    }catch(reason){setError(reason instanceof Error?reason.message:'Please retry.')}
    finally{submitting.current=false;setBusy(false)}
  }
  async function resend(){
    if(submitting.current)return;submitting.current=true;setBusy(true);setError('')
    try{
      await accountRequest('send-verification-email',{email,callbackURL:window.location.origin+'/login?verified=1'})
      setMessage('If verification is still needed, an activation email has been requested. Check your inbox and spam folder.')
    }catch(reason){setError(reason instanceof Error?reason.message:'Unable to send email.')}
    finally{submitting.current=false;setBusy(false)}
  }
  const title=mode==='register'?(registrationAccepted?'Registration received':'Create your safari account'):mode==='forgot'?'Forgot your password?':mode==='reset'?'Choose a new password':'Welcome back'
  return <main className={styles.access} style={{backgroundImage:`linear-gradient(#14261b55,#14261bdd),url(${hero})`}}>
    <Link to="/" className={styles.logo}><AppLogo tone="dark" /></Link>
    <section className={styles.panel}>
      <p className={styles.eyebrow}>Your personal safari journal</p>
      <h1 ref={heading} tabIndex={-1}>{title}</h1>
      {registrationAccepted?<>
        <div className={styles.confirmation} role="status">
          <h2><span aria-hidden="true">✓ </span>New account?</h2>
          <p>Check your inbox and open the activation link. You must verify your email before signing in.</p>
          <p>Check your spam folder if you cannot find the email.</p>
        </div>
        <div className={styles.existingAccount}>
          <h2>Already registered?</h2>
          <p>Submitting this form again does not change an existing password. Sign in, or use a reset email to choose your own password.</p>
        </div>
        <div className={styles.accountActions}>
          <Link className={styles.primaryAction} to="/login" state={{email}}>Sign in</Link>
          <Link className={styles.secondaryAction} to="/account/forgot" state={{email}}>Set or reset password</Link>
        </div>
        <nav aria-label="Registration help">
          <button type="button" disabled={busy} onClick={()=>void resend()}>Resend activation email</button>
          <button type="button" disabled={busy} onClick={()=>{setRegistrationAccepted(false);setEmail('');setPassword('');setMessage('');setError('')}}>Use a different email</button>
        </nav>
      </>:<>
        <p>{mode==='login'?'Sign in to open your private Passport and synchronise your safari across devices.':'Your private sightings and photographs belong to your account.'}</p>
        <form onSubmit={event=>void submit(event)}>
          {mode==='register'?<label>Name<input required maxLength={80} autoComplete="name" value={name} onChange={event=>setName(event.target.value)} /></label>:null}
          {mode!=='reset'?<label>Email address<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={event=>setEmail(event.target.value)} /></label>:null}
          {mode!=='forgot'?<label>{mode==='reset'?'New password':'Password'}<input required type="password" minLength={mode==='login'?1:12} maxLength={128} autoComplete={mode==='login'?'current-password':'new-password'} value={password} onChange={event=>setPassword(event.target.value)} /></label>:null}
          {mode==='register'||mode==='reset'?<small>Use at least 12 characters. Never reuse a password from another service.</small>:null}
          <button disabled={busy||account.loading} type="submit">{busy?'Please wait…':mode==='login'?'Sign in':mode==='register'?'Create account':mode==='forgot'?'Send reset link':'Save new password'}</button>
        </form>
        <nav>{mode!=='login'?<><Link to="/login" state={{email}}>Sign in</Link>{mode==='register'?<Link to="/account/forgot" state={{email}}>Forgot password?</Link>:null}</>:<>
          <Link to="/account/create">Create account</Link><Link to="/account/forgot" state={{email}}>Forgot password?</Link>
          <button type="button" disabled={busy||!email} onClick={()=>void resend()}>Resend activation email</button>
        </>}</nav>
      </>}
      {params.has('verified')?<p role="status" className={styles.confirmation}>Email verified. You can now sign in.</p>:null}
      {message?<p role="status" className={styles.confirmation}>{message}</p>:null}
      {error?<p role="alert" className={styles.accountError}>{error}</p>:null}
      <Link to="/install">Install Animavidi on your device</Link>
    </section>
  </main>
}
