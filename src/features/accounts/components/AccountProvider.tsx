/* eslint-disable react-refresh/only-export-components -- Provider and its hook share a small module. */
import {createContext,useCallback,useContext,useEffect,useState,useRef,type ReactNode} from 'react'
import {currentUserId,currentUserName,setActiveUserId} from '../data/personalStorage'
import {resetSyncStatus,startSynchronisation} from '../services/sync'
import {finishLegacyMigration} from '../services/legacyMigration'
export type ExplorerUser={id:string;name:string;email:string;emailVerified:boolean;createdAt?:string}
type AccountState={user:ExplorerUser|null;loading:boolean;offline:boolean;refresh:()=>Promise<void>;logout:()=>Promise<void>}
const AccountContext=createContext<AccountState|null>(null)
const cacheKey='animavidi:verified-offline-session',logoutKey='animavidi:logout-pending'
export async function accountRequest(path:string,body?:unknown){
  const response=await fetch('/api/auth/'+path,{method:body===undefined?'GET':'POST',credentials:'include',headers:body===undefined?undefined:{'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})})
  const data:unknown=await response.json();if(!response.ok)throw new Error(data && typeof data==='object' && 'message' in data && typeof data.message==='string'?data.message:data && typeof data==='object' && 'error' in data && typeof data.error==='string'?data.error:'The account request could not be completed.');return data
}
function offlineUser():ExplorerUser|null{try{const value:unknown=JSON.parse(localStorage.getItem(cacheKey) ?? 'null');if(value && typeof value==='object' && 'user' in value && 'expires' in value && typeof value.expires==='number' && value.expires>Date.now()){const user=value.user as ExplorerUser;return typeof user?.id==='string' && user.emailVerified===true?user:null}}catch{/* Corrupt metadata cannot grant offline access. */}return null}
export function AccountProvider({children}:{children:ReactNode}){
  const generation=useRef(0),lastVerified=useRef<{user:ExplorerUser;expires:number}|null>(null)
  const [user,setUser]=useState<ExplorerUser|null>(null),[loading,setLoading]=useState(true),[offline,setOffline]=useState(!navigator.onLine)
  const activate=useCallback((next:ExplorerUser|null)=>{if(currentUserId()!==next?.id)resetSyncStatus();const renamed=currentUserId()===next?.id&&currentUserName()!==next?.name;setActiveUserId(next?.id,next?.name,next?.createdAt);setUser(next);if(renamed)window.dispatchEvent(new Event('animavidi:synced'))},[])
  const refresh=useCallback(async()=>{
    const epoch=++generation.current
    if(localStorage.getItem(logoutKey)){lastVerified.current=null;activate(null);if(navigator.onLine)try{await accountRequest('sign-out',{});localStorage.removeItem(logoutKey)}catch{/* Stay signed out locally until server logout succeeds. */}setLoading(false);return}
    try{
      if(!navigator.onLine)throw new Error('offline')
      const response=await fetch('/api/auth/get-session',{credentials:'include',cache:'no-store'})
      if(!response.ok && response.status!==401)throw new Error('Session service unavailable')
      const data=await response.json() as {user?:ExplorerUser;session?:{expiresAt:string}}|null
      if(epoch!==generation.current||localStorage.getItem(logoutKey))return
      if(data?.user?.emailVerified && data.session){activate(data.user);lastVerified.current={user:data.user,expires:new Date(data.session.expiresAt).getTime()};try{localStorage.setItem(cacheKey,JSON.stringify(lastVerified.current))}catch{try{localStorage.removeItem(cacheKey)}catch{/* No offline session cache is available when storage is blocked. */}}setOffline(false)}
      else{lastVerified.current=null;activate(null);try{localStorage.removeItem(cacheKey)}catch{/* A revoked session never falls back to offline access. */}setOffline(false)}
    }catch{if(epoch===generation.current&&!localStorage.getItem(logoutKey)){activate(lastVerified.current&&lastVerified.current.expires>Date.now()?lastVerified.current.user:offlineUser());setOffline(true)}}finally{if(epoch===generation.current)setLoading(false)}
  },[activate])
  const logout=useCallback(async()=>{
    generation.current++;lastVerified.current=null;localStorage.setItem(logoutKey,'true');localStorage.removeItem(cacheKey);activate(null)
    if(navigator.onLine)try{await accountRequest('sign-out',{});localStorage.removeItem(logoutKey)}catch{/* Original account DB stays isolated and pending logout retries online. */}
  },[activate])
  useEffect(()=>{void refresh();const run=()=>{void refresh()};window.addEventListener('online',run);window.addEventListener('offline',run);window.addEventListener('focus',run);window.addEventListener('animavidi:session-expired',run);const timer=window.setInterval(()=>{if(navigator.onLine)run()},60000);return()=>{window.clearInterval(timer);window.removeEventListener('online',run);window.removeEventListener('offline',run);window.removeEventListener('focus',run);window.removeEventListener('animavidi:session-expired',run)}},[refresh])
  useEffect(()=>{const changed=(event:StorageEvent)=>{if(event.key!==cacheKey&&event.key!==logoutKey)return;if(localStorage.getItem(logoutKey)||!localStorage.getItem(cacheKey)){generation.current++;lastVerified.current=null;activate(null);setLoading(false)}else{lastVerified.current=null;void refresh()}};window.addEventListener('storage',changed);return()=>window.removeEventListener('storage',changed)},[activate,refresh])
  useEffect(()=>{if(!user?.id)return;void navigator.storage?.persist?.().catch(()=>false);const stop=startSynchronisation(),finished=()=>{void finishLegacyMigration()};window.addEventListener('animavidi:synced',finished);return()=>{stop();window.removeEventListener('animavidi:synced',finished)}},[user?.id])
  return <AccountContext.Provider value={{user,loading,offline,refresh,logout}}>{children}</AccountContext.Provider>
}
export function useAccount(){const value=useContext(AccountContext);if(!value)throw new Error('AccountProvider is required.');return value}
