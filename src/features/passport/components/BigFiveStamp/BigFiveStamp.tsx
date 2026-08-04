import { Link } from 'react-router-dom'
import type { BigFiveEntry } from '@/features/passport/model/passport'
import styles from './BigFiveStamp.module.css'

const drawings: Record<string, React.ReactNode> = {
  'african-lion': <><circle cx="50" cy="48" r="23"/><path d="M39 42q11-13 22 0v17q-11 12-22 0Zm4 5h2m10 0h2M46 57q4 4 8 0"/></>,
  'african-elephant': <><path d="M25 58V42q0-21 25-21t25 21v16H63V43q-2 23-13 30-11-7-13-30v15Z"/><path d="M26 36 15 24q-3 25 12 28m47-16 11-12q3 25-12 28"/></>,
  leopard: <><path d="M26 40q4-23 24-23t24 23v21q-24 19-48 0Z"/><circle cx="39" cy="44" r="2"/><circle cx="61" cy="44" r="2"/><path d="m31 27-9-9v19m47-10 9-9v19M42 58q8 7 16 0"/></>,
  'african-buffalo': <><path d="M22 35q-9-19-18-8 8 22 30 20m44-12q9-19 18-8-8 22-30 20M30 38q20-16 40 0v28q-20 15-40 0Z"/><path d="M40 51h1m18 0h1"/></>,
  'white-rhinoceros': <><path d="M17 58q8-31 39-25 22 4 27 25H70l-8 15H30l-7-15Z"/><path d="m62 39 17-17-3 22M35 39 28 24"/><circle cx="58" cy="46" r="2"/></>,
}

type Props={entry:BigFiveEntry;earnedDate?:string;formatDate:(date?:string)=>string}
export function BigFiveStamp({entry,earnedDate,formatDate}:Props){return <Link aria-label={`${entry.title}: ${entry.seen?'Seen':'Not yet seen'}`} className={`${styles.stamp} ${entry.seen?styles.seen:''}`} to={`/parks/kruger/mammals/${entry.id}`}><span className={styles.name}>{entry.title}</span><svg aria-hidden="true" viewBox="0 0 100 90">{drawings[entry.id]}</svg><strong>{entry.seen?'Seen':'Not yet seen'}</strong>{earnedDate?<small>{formatDate(earnedDate)}</small>:null}</Link>}
