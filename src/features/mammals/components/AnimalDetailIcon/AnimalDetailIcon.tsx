import type { ReactNode } from 'react'

export type AnimalDetailIconName = 'behaviour' | 'conservation' | 'count' | 'date' | 'diet' | 'group' | 'habitat' | 'location' | 'recognise' | 'sightings' | 'spark'

export function AnimalDetailIcon({ name }: { name: AnimalDetailIconName }) {
  const paths: Record<AnimalDetailIconName, ReactNode> = {
    behaviour: <><path d="M4 16c4-1 6-5 8-9 2 4 4 8 8 9"/><path d="M8 20c2-3 6-3 8 0"/></>,
    conservation: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z"/><path d="M9 13c3 0 5-2 6-5 1 4-1 8-6 8"/></>,
    count: <><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2.5 20c.5-4 2.5-6 5.5-6s5 2 5.5 6M11 20c.5-4 2.5-6 5.5-6 2.5 0 4.5 2 5 6"/></>,
    date: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M8 14h2M14 14h2M8 18h2"/></>,
    diet: <><path d="M7 3v8M4 3v5c0 2 1 3 3 3s3-1 3-3V3M7 11v10M16 3c-3 4-3 9 1 11v7M17 14c3-4 3-8-1-11"/></>,
    group: <><circle cx="12" cy="7" r="3"/><circle cx="5" cy="10" r="2"/><circle cx="19" cy="10" r="2"/><path d="M6 21c0-5 2-8 6-8s6 3 6 8M1 21c0-4 1-6 4-6M23 21c0-4-1-6-4-6"/></>,
    habitat: <><path d="M12 22V8M12 4c-5 0-8 3-8 7 4 0 7-1 8-4M12 6c5 0 8 3 8 7-4 0-7-1-8-4M7 22h10"/></>,
    location: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    recognise: <><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    sightings: <><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M10 12h4M4 12 2 7h4M20 12l2-5h-4M7 9l2-5M17 9l-2-5"/></>,
    spark: <><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/><path d="m19 17 .7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7z"/></>,
  }
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">{paths[name]}</svg>
}
