import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef } from 'react'

import type { SpeciesSightingAchievement } from '@/features/achievements/model/sightingAchievement'
import type { Mammal } from '@/features/mammals/model/mammal'
import { MammalImage } from '@/features/mammals/components/MammalImage/MammalImage'
import { AchievementStampIcon } from '@/features/achievements/components/AchievementStampIcon/AchievementStampIcon'
import { achievementSoundsKey } from '@/features/passport/components/BigFiveCelebration/BigFiveCelebration'

import styles from './SightingAchievementDialog.module.css'

type Props = {
  achievement: SpeciesSightingAchievement
  audioSrc?: string
  mammal: Mammal
  onContinue: () => void
  onViewPassport: () => void
}

export function SightingAchievementDialog({ achievement, audioSrc, mammal, onContinue, onViewPassport }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const legendary = achievement.tier === 'legendary'

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => { document.body.style.overflow = previousOverflow; previousFocus.current?.focus() }
  }, [])

  useEffect(() => {
    if (!legendary || !audioSrc) return
    let enabled = true
    try { enabled = localStorage.getItem(achievementSoundsKey) !== 'false' } catch { /* Use the enabled default. */ }
    if (!enabled) return
    const audio = new Audio(audioSrc)
    audio.loop = false
    audio.volume = 0.7
    void audio.play().catch(() => { /* Autoplay blocking must not interrupt recognition. */ })
    return () => { audio.pause(); audio.currentTime = 0 }
  }, [audioSrc, legendary])

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') { event.preventDefault(); onContinue(); return }
    if (event.key !== 'Tab') return
    const controls = panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')
    if (!controls?.length) return
    const first = controls[0]; const last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  return <section aria-labelledby="species-achievement-title" aria-live="assertive" aria-modal="true" className={`${styles.backdrop} ${legendary ? styles.legendary : styles.rare}`} role="dialog">
    <div className={styles.panel} onKeyDown={handleKeyDown} ref={panelRef} tabIndex={-1}>
      <button aria-label="Close achievement" className={styles.close} onClick={onContinue} type="button">×</button>
      {legendary ? <div className={styles.photograph}><MammalImage mammal={mammal} /></div> : null}
      <div aria-hidden="true" className={styles.badge}><AchievementStampIcon tier={achievement.tier} /><b>{legendary ? 'Legendary' : 'Rare'}</b></div>
      <p className={styles.eyebrow}>{legendary ? 'Legendary sighting' : 'Rare sighting'}</p>
      <h2 id="species-achievement-title">{mammal.commonName}</h2>
      <p className={styles.copy}>{legendary ? 'An encounter few safari travellers will ever experience.' : 'A remarkable encounter with one of Kruger’s less commonly seen mammals.'}</p>
      <p className={styles.passportNote}>Added to your Safari Passport</p>
      <div className={styles.actions}><button onClick={onContinue} type="button">Continue safari</button><button onClick={onViewPassport} type="button">View in Passport</button></div>
    </div>
  </section>
}
