import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode, WheelEvent } from 'react'

import type { MapViewportState } from '@/features/map/model/parkMap'

import styles from './KrugerVectorMap.module.css'

export type MapViewportHandle = {
  centre: () => void
  fit: () => void
  reset: () => void
  zoomIn: () => void
  zoomOut: () => void
}

type MapViewportProps = {
  children: ReactNode
  handleRef: React.Ref<MapViewportHandle>
}

const storageKey = 'animavidi:kruger-map-viewport'
const fitState: MapViewportState = { scale: 1, x: 0, y: 0 }

function restoreViewport(): MapViewportState {
  try {
    const value = sessionStorage.getItem(storageKey)
    if (!value) return fitState
    const parsed = JSON.parse(value) as Partial<MapViewportState>
    if (typeof parsed.scale === 'number' && typeof parsed.x === 'number' && typeof parsed.y === 'number') {
      return { scale: Math.min(4, Math.max(1, parsed.scale)), x: parsed.x, y: parsed.y }
    }
  } catch { /* Use the safe fit state. */ }
  return fitState
}

export function MapViewport({ children, handleRef }: MapViewportProps) {
  const [view, setView] = useState<MapViewportState>(restoreViewport)
  const viewportRef = useRef<HTMLDivElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinchDistance = useRef<number | undefined>(undefined)

  const updateScale = useCallback((factor: number) => {
    setView((current) => ({ ...current, scale: Math.min(4, Math.max(1, current.scale * factor)) }))
  }, [])

  useImperativeHandle(handleRef, () => ({
    centre: () => setView({ scale: 1.45, x: 0, y: 0 }),
    fit: () => setView(fitState),
    reset: () => setView(fitState),
    zoomIn: () => updateScale(1.25),
    zoomOut: () => updateScale(0.8),
  }), [updateScale])

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(view))
  }, [view])

  function movePointer(event: ReactPointerEvent<HTMLDivElement>) {
    const previous = pointers.current.get(event.pointerId)
    if (!previous) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    const active = [...pointers.current.values()]
    if (active.length === 1) {
      setView((current) => ({ ...current, x: current.x + event.clientX - previous.x, y: current.y + event.clientY - previous.y }))
      return
    }
    const distance = Math.hypot(active[0].x - active[1].x, active[0].y - active[1].y)
    if (pinchDistance.current) updateScale(distance / pinchDistance.current)
    pinchDistance.current = distance
  }

  function releasePointer(event: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size < 2) pinchDistance.current = undefined
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault()
    updateScale(event.deltaY < 0 ? 1.12 : 0.89)
  }

  return <div
    aria-label="Interactive Kruger prototype map. Use arrow keys to pan, plus and minus to zoom, and zero to fit the map."
    className={styles.viewport}
    onKeyDown={(event) => {
      const delta = 42
      if (event.key === '+' || event.key === '=') updateScale(1.2)
      else if (event.key === '-') updateScale(0.83)
      else if (event.key === '0') setView(fitState)
      else if (event.key.startsWith('Arrow')) {
        event.preventDefault()
        setView((current) => ({ ...current, x: current.x + (event.key === 'ArrowLeft' ? delta : event.key === 'ArrowRight' ? -delta : 0), y: current.y + (event.key === 'ArrowUp' ? delta : event.key === 'ArrowDown' ? -delta : 0) }))
      }
    }}
    onPointerCancel={releasePointer}
    onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY }) }}
    onPointerMove={movePointer}
    onPointerUp={releasePointer}
    onWheel={handleWheel}
    ref={viewportRef}
    role="application"
    tabIndex={0}
  >
    <div className={styles.stage} style={{ transform: `translate3d(calc(-50% + ${view.x}px), ${view.y}px, 0) scale(${view.scale})` }}>
      {children}
    </div>
  </div>
}
