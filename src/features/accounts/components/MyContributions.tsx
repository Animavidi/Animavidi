import {useEffect,useState,useSyncExternalStore} from 'react'
import {useAccount} from './AccountProvider'
import {metadata,openJournal,committed} from '../data/journalDb'
import {currentUserId} from '../data/personalStorage'
import {subscribeSync,syncSnapshot} from '../services/sync'
import type {BirdDraft} from '@/features/birds/model/communityBird'
type Item={id:string;draft:BirdDraft;status:string;createdAt:string}
export function MyContributions(){
  const {user}=useAccount(),sync=useSyncExternalStore(subscribeSync,syncSnapshot),[items,setItems]=useState<Item[]>([]),[message,setMessage]=useState('')
  useEffect(()=>{let active=true;const owner=user?.id;if(!owner)return
    void (async()=>{const cached=await metadata<Item[]>('own-contributions',owner);if(active&&cached)setItems(cached);if(!navigator.onLine){if(active)setMessage('Showing this device\'s last available contribution list. New submissions require a connection.');return}
      const response=await fetch('/api/me/contributions',{credentials:'include',headers:{'X-Animavidi-Account':owner}});if(!response.ok)throw new Error('Contributions are temporarily unavailable.');const data=await response.json() as {items:Item[]};if(!active||currentUserId()!==owner)return;setItems(data.items);setMessage('');const db=await openJournal(owner);try{const tx=db.transaction('meta','readwrite'),done=committed(tx);tx.objectStore('meta').put({key:'own-contributions',value:data.items});await done}finally{db.close()}
    })().catch(()=>{if(active)setMessage('Your last available contributions are shown. Refresh when connected.')});return()=>{active=false}
  },[user?.id,sync.lastSuccess])
  return <><h2>My contributions</h2><p>Your submissions are linked to your account. Only administrator-approved contributions are public.</p>{message?<p role="status">{message}</p>:null}{items.length?<ul>{items.map(item=><li key={item.id}><strong>{item.draft.commonName}</strong> · {item.draft.kind ?? 'new bird'} · {item.status} · {item.createdAt.slice(0,10)}</li>)}</ul>:<p>No contributions are available in this account yet.</p>}</>
}
