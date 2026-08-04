export type PassportIconName = 'sightings'|'species'|'parks'|'countries'|'bigFive'|'animals'|'photos'|'rank'|'share'|'lock'
export function PassportIcon({ name }: { name: PassportIconName }) {
  const paths: Record<PassportIconName, React.ReactNode> = {
    sightings:<><circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M6 12 3 21h7l2-7 2 7h7l-3-9M8 5V3m8 2V3"/></>,
    species:<><circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="4" cy="13" r="2"/><circle cx="20" cy="13" r="2"/><path d="M12 11c-4 0-7 5-6 8 1 3 4 1 6 1s5 2 6-1c1-3-2-8-6-8Z"/></>,
    parks:<><path d="M12 2 5 11h4l-5 7h6v4h4v-4h6l-5-7h4Z"/></>,
    countries:<><path d="M5 22V3m1 2h12l-3 4 3 4H6"/></>,
    bigFive:<><path d="M5 19c-2-4 0-9 4-11 5-3 11 0 11 5 0 4-3 7-8 7H8m0-12L5 5M18 9l3-3"/><circle cx="15" cy="12" r="1"/></>,
    animals:<><path d="M2 17c2-5 6-7 10-7s8 2 10 7M5 17v4m14-4v4M7 10 5 5l5 3m7 2 2-5-5 3"/><circle cx="10" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></>,
    photos:<><rect x="2" y="6" width="20" height="15" rx="2"/><path d="m8 6 2-3h4l2 3"/><circle cx="12" cy="13" r="4"/></>,
    rank:<><circle cx="12" cy="12" r="9"/><path d="m12 4 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"/></>,
    share:<><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5m-8 7 8 5"/></>,
    lock:<><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  }
  return <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">{paths[name]}</svg>
}
