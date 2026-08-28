export type BigFiveReliefName = 'african-lion' | 'african-elephant' | 'leopard' | 'african-buffalo' | 'white-rhinoceros'

type BigFiveReliefProps = {
  className?: string
  name: BigFiveReliefName
}

export function BigFiveRelief({ className, name }: BigFiveReliefProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 100 100">
      {name === 'african-lion' ? <LionRelief /> : null}
      {name === 'african-elephant' ? <ElephantRelief /> : null}
      {name === 'leopard' ? <LeopardRelief /> : null}
      {name === 'african-buffalo' ? <BuffaloRelief /> : null}
      {name === 'white-rhinoceros' ? <RhinoRelief /> : null}
    </svg>
  )
}

function LionRelief() {
  return (
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M50 7c-8 0-12 5-17 7-8-1-15 5-16 13-7 5-8 14-4 21-5 8-1 18 6 22 1 9 9 15 18 15 4 6 9 9 13 10 4-1 9-4 13-10 9 0 17-6 18-15 7-4 11-14 6-22 4-7 3-16-4-21-1-8-8-14-16-13-5-2-9-7-17-7Z"
        fill="currentColor"
        fillOpacity="0.13"
        strokeWidth="2.2"
      />
      <path d="M50 12c-7 1-10 5-14 8-7-1-12 4-12 10-7 4-7 12-3 18-5 6-2 14 4 17-1 8 6 13 14 12 3 7 7 11 11 13 4-2 8-6 11-13 8 1 15-4 14-12 6-3 9-11 4-17 4-6 4-14-3-18 0-6-5-11-12-10-4-3-7-7-14-8Z" strokeWidth="1.15" />
      <path d="M33 28c3-8 11-13 17-13s14 5 17 13M30 34c-6 7-6 17-1 24M70 34c6 7 6 17 1 24M26 61c3 7 9 11 16 12M74 61c-3 7-9 11-16 12" strokeWidth="0.85" />

      <path
        d="M35 30c4-6 10-9 15-9s11 3 15 9l-2 26c-1 9-6 19-13 23-7-4-12-14-13-23Z"
        fill="currentColor"
        fillOpacity="0.16"
        strokeWidth="1.5"
      />
      <path d="M39 31c2 4 2 8 1 12M61 31c-2 4-2 8-1 12M50 23v21M43 27l-1 15M57 27l1 15" strokeWidth="0.65" opacity="0.76" />
      <path d="M36 45c4-4 9-5 13-1-4 5-9 6-13 1Zm28 0c-4-4-9-5-13-1 4 5 9 6 13 1Z" fill="var(--relief-cut, #4a291c)" fillOpacity="0.38" strokeWidth="1.05" />
      <path d="M40 45c2-1 4-1 6 0M60 45c-2-1-4-1-6 0" strokeWidth="0.55" />
      <circle cx="43.5" cy="45" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="56.5" cy="45" r="1.25" fill="currentColor" stroke="none" />

      <path d="M45 53c1-3 3-5 5-5s4 2 5 5l-1 4-4 3-4-3Z" fill="currentColor" fillOpacity="0.48" strokeWidth="0.9" />
      <path d="M50 60v4m0 0c-4 0-6 2-8 5m8-5c4 0 6 2 8 5M42 69c3 5 13 5 16 0" strokeWidth="1" />
      <path d="M37 54c3 1 6 3 9 5M36 58c4 0 7 1 10 3M63 54c-3 1-6 3-9 5M64 58c-4 0-7 1-10 3" strokeWidth="0.55" opacity="0.74" />
      <path d="M39 63c-6 0-10 1-14 3m15 1c-6 1-9 3-13 6m34-10c6 0 10 1 14 3m-15 1c6 1 9 3 13 6" strokeWidth="0.6" opacity="0.7" />

      <g strokeWidth="0.55" opacity="0.64">
        <path d="m29 20-6 12m12-9-9 14m8-6-10 13m9-5-9 12m9-4-8 11m11-4-7 10m10-3-5 9m8-3-3 8" />
        <path d="m71 20 6 12m-12-9 9 14m-8-6 10 13m-9-5 9 12m-9-4 8 11m-11-4 7 10m-10-3 5 9m-8-3 3 8" />
        <path d="M30 72l7 8m-13-5 9 6m37-9-7 8m13-5-9 6" />
      </g>
      <g fill="currentColor" stroke="none" opacity="0.52">
        <circle cx="39" cy="55" r="0.7" /><circle cx="36" cy="57" r="0.55" /><circle cx="41" cy="59" r="0.55" />
        <circle cx="61" cy="55" r="0.7" /><circle cx="64" cy="57" r="0.55" /><circle cx="59" cy="59" r="0.55" />
      </g>
    </g>
  )
}

function ElephantRelief() {
  return (
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 12c-10 0-17 5-21 14C17 17 7 24 8 40c1 18 10 31 25 35l5-8c2 12 6 21 12 25 6-4 10-13 12-25l5 8c15-4 24-17 25-35 1-16-9-23-21-14-4-9-11-14-21-14Z" fill="currentColor" fillOpacity="0.13" strokeWidth="2.1" />
      <path d="M30 29c4-9 11-13 20-13s16 4 20 13M26 30c-10-5-15 2-13 13 2 13 8 22 18 27M74 30c10-5 15 2 13 13-2 13-8 22-18 27" strokeWidth="1.15" />
      <path d="M34 30c4-6 10-9 16-9s12 3 16 9l-3 29c-1 15-5 27-13 33-8-6-12-18-13-33Z" fill="currentColor" fillOpacity="0.15" strokeWidth="1.5" />
      <path d="M42 39c3-2 6-2 8 0m8 0c-3-2-6-2-8 0M43 41l5 1m9-1-5 1" strokeWidth="0.85" />
      <circle cx="46" cy="41.5" r="1" fill="currentColor" stroke="none" /><circle cx="54" cy="41.5" r="1" fill="currentColor" stroke="none" />
      <path d="M46 46c1 8 0 20-2 28-1 7 1 12 6 16 5-4 7-9 6-16-2-8-3-20-2-28M46 72c2 2 6 2 8 0M47 82c2 1 4 1 6 0" strokeWidth="1" />
      <path d="M36 51c-5 5-7 12-5 20 4-2 7-6 10-12M64 51c5 5 7 12 5 20-4-2-7-6-10-12" strokeWidth="1.15" />
      <g strokeWidth="0.55" opacity="0.68">
        <path d="M37 28c3 4 5 8 5 13m-9-8c3 5 5 10 6 15m-10-9c3 6 5 12 6 18m-10-9c3 6 5 11 7 15" />
        <path d="M63 28c-3 4-5 8-5 13m9-8c-3 5-5 10-6 15m10-9c-3 6-5 12-6 18m10-9c-3 6-5 11-7 15" />
        <path d="M43 30c2 5 3 10 3 15m11-15c-2 5-3 10-3 15M48 52c1 3 1 6 0 9m4-9c-1 3-1 6 0 9M47 66h6M46 77h8" />
      </g>
    </g>
  )
}

function LeopardRelief() {
  return (
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="m29 19-14-8 4 25c-5 7-7 15-5 24 3 17 17 28 36 33 19-5 33-16 36-33 2-9 0-17-5-24l4-25-14 8C65 13 58 10 50 10s-15 3-21 9Z" fill="currentColor" fillOpacity="0.13" strokeWidth="2.1" />
      <path d="m23 19 8 8c5-7 11-11 19-11s14 4 19 11l8-8-2 21c5 7 6 15 3 23-4 11-14 19-28 24-14-5-24-13-28-24-3-8-2-16 3-23Z" strokeWidth="1.1" />
      <path d="M30 35c5-8 12-12 20-12s15 4 20 12l-4 29c-3 10-9 16-16 20-7-4-13-10-16-20Z" fill="currentColor" fillOpacity="0.14" strokeWidth="1.45" />
      <path d="M32 44c5-4 11-4 16 0-4 5-10 6-16 0Zm36 0c-5-4-11-4-16 0 4 5 10 6 16 0Z" fill="var(--relief-cut, #4a291c)" fillOpacity="0.32" strokeWidth="1" />
      <circle cx="41" cy="44.5" r="1.25" fill="currentColor" stroke="none" /><circle cx="59" cy="44.5" r="1.25" fill="currentColor" stroke="none" />
      <path d="M44 56c2-3 4-4 6-4s4 1 6 4l-2 4-4 2-4-2Z" fill="currentColor" fillOpacity="0.48" strokeWidth="0.9" />
      <path d="M50 62v4m0 0c-4 0-7 2-9 5m9-5c4 0 7 2 9 5M42 71c4 6 12 6 16 0" strokeWidth="0.95" />
      <path d="M39 61c-6 0-11 1-16 4m17 0c-7 1-11 3-15 6m36-10c6 0 11 1 16 4m-17 0c7 1 11 3 15 6" strokeWidth="0.55" opacity="0.72" />
      <g strokeWidth="0.75" opacity="0.72">
        <path d="M34 29c2-3 5-3 7 0-2 3-5 3-7 0Zm25 0c2-3 5-3 7 0-2 3-5 3-7 0ZM27 52c2-3 5-3 7 0-2 3-5 3-7 0Zm39 0c2-3 5-3 7 0-2 3-5 3-7 0ZM30 66c2-3 5-3 7 0-2 3-5 3-7 0Zm33 0c2-3 5-3 7 0-2 3-5 3-7 0Z" />
        <circle cx="50" cy="31" r="2" /><circle cx="40" cy="36" r="1.4" /><circle cx="60" cy="36" r="1.4" />
        <circle cx="38" cy="78" r="1.5" /><circle cx="62" cy="78" r="1.5" />
      </g>
      <g strokeWidth="0.5" opacity="0.55"><path d="m22 25 7 7m-9 1 7 5m51-13-7 7m9 1-7 5M35 22l3 7m27-7-3 7" /></g>
    </g>
  )
}

function BuffaloRelief() {
  return (
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M31 28C20 12 9 8 4 18c2 18 12 29 30 31l5-8h22l5 8c18-2 28-13 30-31-5-10-16-6-27 10-5-7-12-11-19-11s-14 4-19 11Z" fill="currentColor" fillOpacity="0.14" strokeWidth="2.2" />
      <path d="M31 31C20 17 12 14 9 20c3 12 12 20 26 21 4-8 9-12 15-12s11 4 15 12c14-1 23-9 26-21-3-6-11-3-22 11" strokeWidth="1.15" />
      <path d="M26 27c8 3 15 4 24 2 9 2 16 1 24-2M35 35c4-7 9-10 15-10s11 3 15 10" strokeWidth="0.8" />
      <path d="M29 39c5-7 13-11 21-11s16 4 21 11l-5 35-16 17-16-17Z" fill="currentColor" fillOpacity="0.15" strokeWidth="1.55" />
      <path d="M34 47c4-4 9-4 14 0-4 5-9 5-14 0Zm32 0c-4-4-9-4-14 0 4 5 9 5 14 0Z" fill="var(--relief-cut, #4a291c)" fillOpacity="0.34" strokeWidth="1" />
      <circle cx="42" cy="47" r="1.15" fill="currentColor" stroke="none" /><circle cx="58" cy="47" r="1.15" fill="currentColor" stroke="none" />
      <path d="M39 60c3-5 7-7 11-7s8 2 11 7l-2 15-9 9-9-9Z" fill="currentColor" fillOpacity="0.19" strokeWidth="1" />
      <path d="M42 68c2-3 5-4 8-4s6 1 8 4l-2 5H44Z" fill="currentColor" fillOpacity="0.42" strokeWidth="0.85" />
      <path d="M46 70h1m6 0h1M50 73v5m-6 1c4 3 8 3 12 0" strokeWidth="0.8" />
      <g strokeWidth="0.55" opacity="0.66">
        <path d="M17 20c3 8 9 13 18 16m-14-19c4 7 9 11 16 14m46-11c-3 8-9 13-18 16m14-19c-4 7-9 11-16 14" />
        <path d="M36 39c2 4 3 8 3 13m25-13c-2 4-3 8-3 13M34 55c3 2 5 4 7 7m25-7c-3 2-5 4-7 7M38 76l5 6m19-6-5 6" />
      </g>
    </g>
  )
}

function RhinoRelief() {
  return (
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 62c5-24 21-36 43-34l12-13 4 17c11 4 20 13 24 25l-12 3-8 20-13 5H31L20 75 7 70Z" fill="currentColor" fillOpacity="0.14" strokeWidth="2.1" />
      <path d="M15 61c5-19 18-28 38-27l12-10 1 13c9 3 16 10 20 19l-10 2-8 17-12 4H34L23 70l-10-3Z" strokeWidth="1.15" />
      <path d="M23 45c6-8 15-12 27-12 8 0 15 2 21 7M31 39c-3-6-7-10-12-12l4 16M65 37 88 17 76 41" strokeWidth="1.1" />
      <path d="M76 41 91 24 82 47M70 42l12-9" fill="currentColor" fillOpacity="0.12" strokeWidth="1.25" />
      <path d="M42 43c6-4 14-5 22-2l8 10-5 18-13 7-18-5-7-13Z" fill="currentColor" fillOpacity="0.13" strokeWidth="1.25" />
      <path d="M57 47c4-2 8-1 11 2-4 4-8 4-11-2Z" fill="var(--relief-cut, #4a291c)" fillOpacity="0.34" strokeWidth="0.9" />
      <circle cx="64" cy="48" r="1.1" fill="currentColor" stroke="none" />
      <path d="M68 60c5-2 10-2 14 0M65 68c4 2 8 2 12 0M38 71c8 4 17 5 26 2" strokeWidth="0.9" />
      <path d="M28 54c-5 2-9 6-11 11M33 78l-2 9m27-9 2 9" strokeWidth="1" />
      <g strokeWidth="0.55" opacity="0.66">
        <path d="M30 44c4 1 8 2 11 5m-15 1c5 1 9 3 13 6m-15 1c5 1 10 3 14 7m9-28c-2 5-3 10-2 15m8-16c-2 5-2 10-1 15" />
        <path d="M45 57c5 2 10 3 16 2m-18 4c6 3 12 4 18 3M35 68c7 4 15 5 23 4M71 46l7 6m-9-1 7 6" />
      </g>
      <g fill="currentColor" stroke="none" opacity="0.5"><circle cx="47" cy="54" r="0.7" /><circle cx="52" cy="57" r="0.6" /><circle cx="58" cy="54" r="0.65" /></g>
    </g>
  )
}
