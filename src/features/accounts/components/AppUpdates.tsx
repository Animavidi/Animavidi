import {useEffect,useState} from 'react'
export function AppUpdates(){
  const [waiting,setWaiting]=useState<ServiceWorker|null>(null)
  useEffect(()=>{if(!('serviceWorker' in navigator)||!import.meta.env.PROD)return;let current=true,registration:ServiceWorkerRegistration|undefined
    void navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'}).then(value=>{registration=value;if(current&&value.waiting)setWaiting(value.waiting);value.addEventListener('updatefound',()=>{const worker=value.installing;worker?.addEventListener('statechange',()=>{if(current&&worker.state==='installed'&&navigator.serviceWorker.controller)setWaiting(worker)})})}).catch(()=>{/* Initial visit remains usable if installation is unavailable. */})
    const check=()=>{if(navigator.onLine)void registration?.update()};window.addEventListener('online',check);return()=>{current=false;window.removeEventListener('online',check)}
  },[])
  function apply(){if(!waiting)return;navigator.serviceWorker.addEventListener('controllerchange',()=>window.location.reload(),{once:true});waiting.postMessage('ACTIVATE_UPDATE')}
  return waiting?<aside style={{position:'fixed',top:8,left:'5%',width:'90%',padding:12,background:'#f6f0e1',border:'1px solid #b99455',borderRadius:12,zIndex:2000,color:'#1d3828'}}>An Animavidi update is ready. Save any open form first. Saved records and queued changes remain on this device. <button type="button" onClick={apply}>Apply update</button></aside>:null
}
