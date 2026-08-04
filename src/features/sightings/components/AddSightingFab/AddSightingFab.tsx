import { forwardRef, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import styles from './AddSightingFab.module.css'

type AddSightingFabProps = {
  contextKey: string
  icon: ReactNode
  label: string
  onActivate: () => void
}

const introductionKey = 'animavidi.addSightingFabIntroduced'
const expandedDuration = 2000

export const AddSightingFab = forwardRef<HTMLButtonElement, AddSightingFabProps>(function AddSightingFab({ contextKey, icon, label, onActivate }, forwardedRef) {
  const localRef = useRef<HTMLButtonElement | null>(null)
  const pointerTypeRef = useRef('mouse')
  const previousContextRef = useRef(contextKey)
  const timerRef = useRef<number | undefined>(undefined)
  const [expanded, setExpanded] = useState(() => {
    try {
      if (window.localStorage.getItem(introductionKey)) return false
      window.localStorage.setItem(introductionKey, 'true')
      return true
    } catch {
      return false
    }
  })
  const introduceOnMountRef = useRef(expanded)

  const setButtonRef = useCallback((node: HTMLButtonElement | null) => {
    localRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }, [forwardedRef])

  const clearCollapseTimer = useCallback(() => {
    if (timerRef.current !== undefined) window.clearTimeout(timerRef.current)
    timerRef.current = undefined
  }, [])

  const collapse = useCallback(() => {
    clearCollapseTimer()
    setExpanded(false)
  }, [clearCollapseTimer])

  const revealTemporarily = useCallback(() => {
    clearCollapseTimer()
    setExpanded(true)
    timerRef.current = window.setTimeout(() => setExpanded(false), expandedDuration)
  }, [clearCollapseTimer])

  useEffect(() => {
    if (introduceOnMountRef.current) {
      introduceOnMountRef.current = false
      revealTemporarily()
    }
    return clearCollapseTimer
  }, [clearCollapseTimer, revealTemporarily])

  useEffect(() => {
    if (previousContextRef.current !== contextKey) {
      previousContextRef.current = contextKey
      collapse()
    }
  }, [collapse, contextKey])

  useEffect(() => {
    if (!expanded) return
    const handleOutsidePointer = (event: PointerEvent) => {
      if (!localRef.current?.contains(event.target as Node)) collapse()
    }
    document.addEventListener('pointerdown', handleOutsidePointer, true)
    return () => document.removeEventListener('pointerdown', handleOutsidePointer, true)
  }, [collapse, expanded])

  function activate() {
    collapse()
    onActivate()
  }

  function handleClick(event: ReactMouseEvent<HTMLButtonElement>) {
    if (event.detail === 0) {
      activate()
      return
    }

    if (pointerTypeRef.current === 'touch' || pointerTypeRef.current === 'pen') {
      if (!expanded) revealTemporarily()
      else activate()
      return
    }

    activate()
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    pointerTypeRef.current = event.pointerType
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    activate()
  }

  const className = expanded ? `${styles.fab} ${styles.expanded}` : styles.fab

  return (
    <button
      aria-label={label}
      aria-expanded={expanded}
      className={className}
      onBlur={collapse}
      onClick={handleClick}
      onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) setExpanded(true) }}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setExpanded(true) }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse' && document.activeElement !== event.currentTarget) collapse() }}
      ref={setButtonRef}
      type="button"
    >
      <span aria-hidden="true" className={styles.label}>{label}</span>
      <span aria-hidden="true" className={styles.iconSlot}>{icon}</span>
    </button>
  )
})
