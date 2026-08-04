type SightingIconName = 'behaviour' | 'calendar' | 'camera' | 'composition' | 'count' | 'location' | 'memory' | 'time'

export function SightingIcon({ name }: { name: SightingIconName }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: 1.7 }
  return <svg aria-hidden="true" viewBox="0 0 24 24">
    {name === 'calendar' ? <><rect {...common} height="16" rx="2" width="18" x="3" y="5" /><path {...common} d="M7 3v4m10-4v4M3 9h18" /></> : null}
    {name === 'time' ? <><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="M12 7v5l3 2" /></> : null}
    {name === 'location' ? <><path {...common} d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle {...common} cx="12" cy="10" r="2.5" /></> : null}
    {name === 'count' ? <><circle {...common} cx="8" cy="8" r="3" /><circle {...common} cx="16.5" cy="9" r="2.5" /><path {...common} d="M2.8 19c.5-4 2.2-6 5.2-6s4.7 2 5.2 6m.5-5.2c3.8-.8 6.4 1.2 6.8 5.2" /></> : null}
    {name === 'composition' ? <><circle {...common} cx="8" cy="8" r="2.5" /><circle {...common} cx="16" cy="8" r="2.5" /><path {...common} d="M3 19c.4-4 2-6 5-6s4.6 2 5 6m-2-4.8c1.1-.8 2.3-1.2 3.7-1.2 3 0 4.8 2 5.3 6" /></> : null}
    {name === 'behaviour' ? <><path {...common} d="M4 15c3-6 7-9 16-9-1 8-5 12-12 12" /><path {...common} d="M4 20c3-5 7-8 12-10" /></> : null}
    {name === 'memory' ? <><path {...common} d="M12 20s-8-4.6-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.4-8 10-8 10Z" /></> : null}
    {name === 'camera' ? <><rect {...common} height="13" rx="2" width="19" x="2.5" y="7" /><path {...common} d="m7 7 1.5-3h7L17 7" /><circle {...common} cx="12" cy="13.5" r="3.5" /></> : null}
  </svg>
}
