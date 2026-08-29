import { type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from 'react'

import achievementTheme from '@/assets/audio/big-five-complete.wav'
import { AppLogo } from '@/components/AppLogo/AppLogo'
import { MammalImage } from '@/features/mammals/components/MammalImage/MammalImage'
import type { PassportSummary } from '@/features/passport/model/passport'

import styles from './BigFiveCelebration.module.css'

export const bigFiveCelebratedKey = 'animavidi.achievement.bigFiveCompletedCelebrated'
export const achievementSoundsKey = 'animavidi.achievementSoundsEnabled'

type BigFiveCelebrationProps = {
  completionDate: string
  completedAnimalId: string
  onContinue: () => void
  onViewPassport: () => void
  passport: PassportSummary
}

function soundsEnabled() {
  try { return localStorage.getItem(achievementSoundsKey) !== 'false' } catch { return true }
}

export function BigFiveCelebration({ completionDate, completedAnimalId, onContinue, onViewPassport, passport }: BigFiveCelebrationProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | undefined>(undefined)
  const [soundOn, setSoundOn] = useState(soundsEnabled)
  const initialSoundOnRef = useRef(soundOn)
  const [playbackBlocked, setPlaybackBlocked] = useState(false)
  const [audioAvailable, setAudioAvailable] = useState(true)

  function stopAudio() {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
  }

  async function playTheme() {
    if (!soundOn || !audioAvailable) return
    const audio = audioRef.current ?? new Audio(achievementTheme)
    audioRef.current = audio
    audio.loop = false
    audio.volume = 0.7
    audio.currentTime = 0
    try {
      await audio.play()
      setPlaybackBlocked(false)
    } catch {
      setPlaybackBlocked(true)
    }
  }

  useEffect(() => {
    dialogRef.current?.focus()
    try { localStorage.setItem(bigFiveCelebratedKey, 'true') } catch { /* The visual remains valid without preference persistence. */ }

    const audio = new Audio(achievementTheme)
    audioRef.current = audio
    audio.preload = 'auto'
    audio.loop = false
    audio.volume = 0.7
    audio.addEventListener('error', () => {
      setAudioAvailable(false)
      if (import.meta.env.DEV) console.warn('Big Five achievement theme could not be loaded.')
    }, { once: true })
    if (initialSoundOnRef.current) {
      void audio.play().then(() => setPlaybackBlocked(false)).catch(() => setPlaybackBlocked(true))
    }
    return stopAudio
  }, [])

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Tab') return
    const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')
    if (!controls?.length) return
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  function toggleSound() {
    if (playbackBlocked && soundOn) {
      void playTheme()
      return
    }
    const next = !soundOn
    setSoundOn(next)
    try { localStorage.setItem(achievementSoundsKey, String(next)) } catch { /* Keep the in-memory preference. */ }
    if (!next) { stopAudio(); setPlaybackBlocked(false) }
    else void playTheme()
  }

  function continueSafari() { stopAudio(); onContinue() }
  function viewPassport() { stopAudio(); onViewPassport() }

  return <section aria-labelledby="big-five-complete-title" aria-live="assertive" aria-modal="true" className={styles.backdrop} role="dialog">
    <div className={styles.panel} onKeyDown={handleKeyDown} ref={dialogRef} tabIndex={-1}>
      <div className={styles.brand}><AppLogo /><span>Safari Passport Achievement</span></div>
      <p className={styles.eyebrow}>A rare chapter completed</p>
      <h2 id="big-five-complete-title">Big Five Complete</h2>
      <p className={styles.intro}>You have now observed all five of Kruger’s Big Five.</p>
      <div aria-label="Completed Big Five collection" className={styles.stamps} role="list">
        {passport.bigFive.map((entry, index) => <article className={entry.id === completedAnimalId || (entry.title === 'Rhinoceros' && completedAnimalId.includes('rhinoceros')) ? styles.newStamp : undefined} key={entry.id} role="listitem" style={{ '--stamp-index': index } as CSSProperties}>
          <MammalImage decorative mammal={entry.mammal} />
          <strong>{entry.title.replace('African ', '')}</strong><span>Observed</span>
        </article>)}
      </div>
      <p className={styles.date}>Completed {new Date(`${completionDate}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <p className={styles.passportNote}>Saved to your Safari Passport</p>
      <div className={styles.actions}><button onClick={continueSafari} type="button">Continue your safari</button><button onClick={viewPassport} type="button">View Safari Passport</button></div>
      {audioAvailable ? <button aria-label={soundOn ? 'Mute achievement theme' : 'Play achievement theme'} className={styles.sound} onClick={toggleSound} type="button"><span aria-hidden="true">{soundOn && !playbackBlocked ? 'Ⅱ' : '♪'}</span>{playbackBlocked && soundOn ? 'Play achievement theme' : soundOn ? 'Mute theme' : 'Play theme'}</button> : null}
    </div>
  </section>
}
