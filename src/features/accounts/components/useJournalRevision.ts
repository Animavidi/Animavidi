import {useEffect,useState} from 'react'
export function useJournalRevision(){const [revision,setRevision]=useState(0);useEffect(()=>{const refresh=()=>setRevision(value=>value+1);window.addEventListener('animavidi:synced',refresh);return()=>window.removeEventListener('animavidi:synced',refresh)},[]);return revision}
