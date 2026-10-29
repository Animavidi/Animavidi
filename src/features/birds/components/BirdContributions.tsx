import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadBirdContributions } from '../services/birdApi'
import { getAdminApiBaseUrl } from '@/features/mammals/services/mammalPhotoApi'
import type { BirdDraft } from '../model/communityBird'

export function BirdContributions({ animalId }: { animalId:string }) {
  const [items,setItems]=useState<{id:string;draft:BirdDraft;approvedAt:string}[]>([])
  const [error,setError]=useState('')
  useEffect(()=>{ let active=true; setItems([]); setError(''); void loadBirdContributions(animalId).then((rows)=>{if(active)setItems(rows)}).catch(()=>{if(active)setError('Community contributions are temporarily unavailable.')}); return()=>{active=false} },[animalId])
  return <section aria-label="Community contributions"><h2>Community contributions</h2><p><Link to={`/parks/kruger/birds/propose?target=${animalId}`}>Contribute a photo, correction or information</Link></p>{error ? <p role="status">{error}</p> : null}{items.map((item)=><article key={item.id}><h3>{item.draft.kind==='correction' ? `Suggested name: ${item.draft.commonName}` : item.draft.kind==='photo' ? 'Community photograph' : 'Community information'}</h3><p>{item.draft.description}</p>{item.draft.photoType ? <figure><img loading="lazy" style={{width:'100%',maxWidth:640,height:'auto',aspectRatio:'4/3',objectFit:'contain'}} src={`${getAdminApiBaseUrl()}/api/bird-contributions/${item.id}/photo`} alt={`${item.draft.commonName}, contributed by ${item.draft.author}`} /><figcaption>Photo: {item.draft.author} · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a></figcaption></figure> : null}<p><small>Community contribution by {item.draft.author ?? 'Anonymous contributor'} · Administrator approved {item.approvedAt.slice(0,10)}. {item.draft.sourceUrl ? <a href={item.draft.sourceUrl} target="_blank" rel="noreferrer">Contributor source</a> : null}</small></p></article>)}</section>
}
