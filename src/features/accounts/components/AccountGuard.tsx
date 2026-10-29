import {Fragment,useEffect,useState,useSyncExternalStore} from 'react'
import {Link,Navigate,Outlet,useLocation} from 'react-router-dom'
import {useAccount} from './AccountProvider'
import {subscribeSync,syncSnapshot} from '../services/sync'
import {legacyStatus} from '../services/legacyMigration'
import styles from '../routes/Accounts.module.css'
export function AccountGuard(){
  const account=useAccount(),location=useLocation(),sync=useSyncExternalStore(subscribeSync,syncSnapshot)
  const [legacy,setLegacy]=useState(false)
  useEffect(()=>{let active=true;if(account.user?.id)void legacyStatus().then(status=>{if(active)setLegacy(status.count>0&&!status.complete)});return()=>{active=false}},[account.user?.id,sync.pending])
  if(account.loading)return <main className={styles.state} role="status">Opening your account…</main>
  if(!account.user)return <Navigate replace to={`/login?returnTo=${encodeURIComponent(location.pathname+location.search)}`} />
  return <Fragment key={account.user.id}>{legacy && location.pathname!=='/my-animavidi'?<aside className={styles.migrationNotice}>An existing local journal is safe on this device. <Link to="/my-animavidi#migration">Back up and import it into your account</Link>.</aside>:null}<Outlet /><Link className={styles.syncPill} to="/my-animavidi#sync">{sync.conflicts?`${sync.conflicts} sync conflicts`:account.offline||!navigator.onLine?'Offline · saved on device':sync.running?'Synchronising…':sync.pending?`${sync.pending} changes on this device`:'Account synchronised'}</Link></Fragment>
}
