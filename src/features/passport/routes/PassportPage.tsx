import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { SponsorFooter } from '@/components/SponsorFooter/SponsorFooter'
import { findMammal } from '@/features/mammals/model/mammals'
import { MammalsBottomNav } from '@/features/mammals/components/MammalsBottomNav/MammalsBottomNav'
import { BigFiveStamp } from '@/features/passport/components/BigFiveStamp/BigFiveStamp'
import { ExplorerStamp } from '@/features/passport/components/ExplorerStamp/ExplorerStamp'
import { PassportIcon, type PassportIconName } from '@/features/passport/components/PassportIcon/PassportIcon'
import type { PassportSummary } from '@/features/passport/model/passport'
import { loadPassport } from '@/features/passport/services/passportService'
import { SightingImage } from '@/features/sightings/components/SightingImage/SightingImage'
import { AddSightingLauncher } from '@/features/sightings/components/AddSightingLauncher/AddSightingLauncher'

import styles from './PassportPage.module.css'

const formatDate = (date?: string) => date ? new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00`)) : 'Not yet recorded'

export function PassportPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [passport, setPassport] = useState<PassportSummary>()
  const [error, setError] = useState('')
  const [shareStatus, setShareStatus] = useState('')
  const refresh = useCallback(() => { setError(''); void loadPassport().then(setPassport).catch(() => setError('Your local Passport could not be opened. Your data remains on this device.')) }, [])
  useEffect(refresh, [refresh])

  const share = async () => {
    if (!passport) return
    const text = `My Animavidi Safari Passport: ${passport.totalSightings} sightings, ${passport.uniqueSpecies} species, ${passport.bigFive.filter((item) => item.seen).length} of the Big Five discovered.`
    try {
      if (navigator.share) await navigator.share({ title: 'Animavidi Safari Passport', text, url: window.location.origin })
      else if (navigator.clipboard) { await navigator.clipboard.writeText(`${text} ${window.location.origin}`); setShareStatus('Passport summary copied.') }
      else setShareStatus('Sharing is unavailable on this device.')
    } catch (reason) { if ((reason as DOMException).name !== 'AbortError') setShareStatus('Sharing is unavailable right now.') }
  }

  if (error) return <main className={styles.state}><h1>Safari Passport</h1><p role="alert">{error}</p><button onClick={refresh}>Try again</button><Link to="/parks/kruger">Return to Kruger Home</Link></main>
  if (!passport) return <main className={styles.loading} aria-busy="true"><div /><p>Opening your Safari Passport…</p></main>

  const completedBigFive = passport.bigFive.filter((item) => item.seen).length
  const earned = passport.achievements.filter((item) => item.earnedDate)
  const firstBigFiveDate = (animalId: string) => passport.sightings.find((sighting) => animalId === 'white-rhinoceros' ? sighting.animalId.includes('rhinoceros') : sighting.animalId === animalId)?.date
  const statistics: readonly [PassportIconName, string, string | number][] = [
    ['sightings', 'Sightings', passport.totalSightings], ['species', 'Species', passport.uniqueSpecies], ['parks', 'Parks', passport.parksVisited], ['countries', 'Countries', passport.countriesExplored], ['bigFive', 'Big Five', `${completedBigFive}/5`], ['animals', 'Animals', passport.totalAnimals], ['photos', 'Photos', passport.photographs],
  ]

  return <main className={styles.page} id="passport-main">
    <header className={styles.header}>
      <button aria-label="Go back" className={styles.back} onClick={() => { if (window.history.length > 1) void navigate(-1); else void navigate('/parks/kruger') }}><span /></button>
      <div><p>Personal wildlife journal</p><h1>Safari Passport</h1></div>
      <button className={styles.share} onClick={() => void share()}><PassportIcon name="share"/> Share</button>
    </header>
    {shareStatus ? <p className={styles.toast} role="status">{shareStatus}</p> : null}

    <div className={styles.document}>
      <section aria-labelledby="identity-title" className={styles.cover}>
        <div className={styles.coverTitle}><p>Animavidi</p><h2 id="identity-title">Safari<br/>Passport</h2><span>Your adventure. Your legacy.</span></div>
        <div className={styles.explorerStamp}><ExplorerStamp /></div>
        <div aria-hidden="true" className={styles.wildlifeEmblem}><PassportIcon name="species"/></div>
        <dl className={styles.identity}>
          <div className={styles.explorerName}><dt>Explorer</dt><dd>{passport.profile.name}</dd></div>
          <div><dt>Passport no.</dt><dd>{passport.profile.number}</dd></div>
          <div><dt>Explorer since</dt><dd>{passport.profile.explorerSince}</dd></div>
          <div><dt>Primary park</dt><dd>{passport.profile.primaryPark}</dd></div>
          <div><dt>Country</dt><dd>{passport.profile.country}</dd></div>
        </dl>
      </section>

      {searchParams.has('flow') ? <Link className={styles.continueFlow} to="/parks/kruger">Continue to Kruger Home <span aria-hidden="true">→</span></Link> : null}

      <section aria-label="Lifetime Passport statistics" className={`${styles.paper} ${styles.statisticsPanel}`}>
        <dl className={styles.statistics}>{statistics.map(([icon,label,value])=><div key={label}><dt><PassportIcon name={icon}/><span>{label}</span></dt><dd>{value}</dd></div>)}</dl>
        <dl className={styles.dates}><div><dt>First sighting</dt><dd>{formatDate(passport.firstSighting)}</dd></div><div><dt>Most recent</dt><dd>{formatDate(passport.recentSighting)}</dd></div></dl>
      </section>

      <section aria-labelledby="rank-title" className={styles.rankPanel}>
        <div aria-hidden="true" className={styles.rankEmblem}><PassportIcon name="rank"/></div>
        <div className={styles.rankCopy}><p>Explorer rank</p><h2 id="rank-title">{passport.rank.title}</h2><strong>Next: {passport.nextRank?.title ?? 'Highest rank reached'}</strong><span>{passport.rankMessage}</span></div>
        <div className={styles.rankProgress}><p>{passport.rankProgress}% towards next rank</p><div aria-label={`${passport.rankProgress}% progress towards ${passport.nextRank?.title ?? 'highest rank'}`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={passport.rankProgress} className={styles.progress} role="progressbar"><span style={{width:`${passport.rankProgress}%`}}/></div>{passport.nextRank ? <dl><div><dt>{passport.nextRank.uniqueSpecies}</dt><dd>species</dd></div><div><dt>{passport.nextRank.totalSightings}</dt><dd>sightings</dd></div><div><dt>{passport.nextRank.parksVisited}</dt><dd>park{passport.nextRank.parksVisited===1?'':'s'}</dd></div></dl> : null}</div>
      </section>

      <section aria-labelledby="big-five-title" className={`${styles.paper} ${styles.bigFivePanel}`}>
        <div className={styles.ruledHeading}><span/><h2 id="big-five-title">The Big Five</h2><span/></div>
        <div className={styles.bigFiveStamps}>{passport.bigFive.map((item)=><BigFiveStamp earnedDate={firstBigFiveDate(item.id)} entry={item} formatDate={formatDate} key={item.id}/>)}</div>
        <p>{completedBigFive} of 5 discovered</p>
      </section>

      <div className={styles.spread}>
        <section aria-labelledby="journey-title" className={`${styles.paper} ${styles.journeyPanel}`}><div className={styles.sectionHeading}><h2 id="journey-title">My Safari Journey</h2></div>{passport.hasKrugerVisit?<Link className={styles.journey} to="/parks/kruger"><div aria-hidden="true" className={styles.journeyMap}><i/></div><div><strong>South Africa</strong><span>{passport.countriesExplored} country</span><hr/><strong>Kruger National Park</strong><span>{passport.totalSightings} sighting{passport.totalSightings===1?'':'s'} · {passport.uniqueSpecies} species</span><small>First visit: {formatDate(passport.firstSighting)}</small></div><b aria-hidden="true">›</b></Link>:<div className={styles.empty}><h3>Your journey begins here</h3><p>Complete onboarding or record a Kruger sighting to add your first supported destination.</p><Link to="/parks/kruger">Explore Kruger</Link></div>}<p className={styles.future}>Future destinations remain locked until you visit them.</p></section>

        <section aria-labelledby="achievements-title" className={`${styles.paper} ${styles.achievementPanel}`}><div className={styles.sectionHeading}><div><h2 id="achievements-title">Achievements</h2><p>{earned.length} of {passport.achievements.length} earned</p></div></div>{!earned.length?<p className={styles.emptyInline}>No stamps earned yet. Genuine progress will be celebrated here.</p>:null}<div className={styles.achievements}>{passport.achievements.map((item,index)=><article className={item.earnedDate?styles.earned:styles.locked} key={item.id}><PassportIcon name={item.earnedDate?(index%2?'photos':'sightings'):'lock'}/><h3>{item.title}</h3><p>{item.requirement}</p><small>{item.earnedDate?formatDate(item.earnedDate):'Locked'}</small></article>)}</div></section>
      </div>

      <section aria-labelledby="species-title" className={`${styles.paper} ${styles.speciesPanel}`}><div className={styles.sectionHeading}><div><h2 id="species-title">Species Discovered</h2><p>Personal field record</p></div></div>{passport.species.length?<div className={styles.species}>{passport.species.map((item)=><Link key={item.mammal.id} to={`/parks/kruger/mammals/${item.mammal.id}`}><SightingImage mammal={item.mammal}/><div><h3>{item.mammal.commonName}</h3><p>{item.sightings} sighting{item.sightings===1?'':'s'}</p><small>{formatDate(item.firstSeen)} — {formatDate(item.lastSeen)}</small></div></Link>)}</div>:<div className={styles.empty}><h3>No species discovered yet</h3><p>Your first recorded encounter will become the opening entry in this collection.</p><Link to="/parks/kruger/mammals">Choose a species</Link></div>}</section>

      <section aria-labelledby="memories-title" className={`${styles.paper} ${styles.memoriesPanel}`}><div className={styles.sectionHeading}><div><h2 id="memories-title">Recent Memories</h2><p>Latest journal entries</p></div></div>{passport.sightings.length?<div className={styles.memories}>{passport.sightings.slice(0,4).map((item)=>{const mammal=findMammal(item.animalId);return <Link key={item.id} to={`/parks/kruger/sightings/${item.id}`}><SightingImage mammal={mammal} photo={item.photos[0]}/><div><h3>{mammal?.commonName??'Unknown species'}</h3><strong>Kruger National Park</strong><p>{formatDate(item.date)} · {item.time} · {item.count} animal{item.count===1?'':'s'} · {item.behaviour}</p><small>{item.location}</small></div><b aria-hidden="true">›</b></Link>})}</div>:<div className={styles.empty}><h3>No memories recorded yet</h3><p>Photos are optional; every saved encounter can become a memory.</p><Link to="/parks/kruger/mammals">Add a sighting</Link></div>}</section>
      <div className={styles.sponsor}><SponsorFooter tone="light"/></div>
    </div>
    <AddSightingLauncher />
    <MammalsBottomNav active="passport"/>
  </main>
}
