import styles from './ExplorerStamp.module.css'

export function ExplorerStamp() {
  return <svg aria-hidden="true" className={styles.stamp} viewBox="0 0 320 320">
    <defs>
      <path id="stamp-top" d="M49 161a111 111 0 0 1 222 0" />
      <path id="stamp-bottom" d="M50 174a111 111 0 0 0 220 0" />
      <filter id="distress"><feTurbulence baseFrequency=".045" numOctaves="3" seed="8" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/><feComponentTransfer><feFuncA type="table" tableValues="0 .35 .75 1"/></feComponentTransfer></filter>
      <mask id="worn"><rect width="320" height="320" fill="white"/><g fill="black" opacity=".36"><circle cx="58" cy="84" r="3"/><circle cx="257" cy="62" r="5"/><circle cx="232" cy="265" r="4"/><path d="M42 225h36v3H42zm194-119h48v2h-48zM88 45h22v3H88z"/></g></mask>
    </defs>
    <g filter="url(#distress)" mask="url(#worn)">
      <circle cx="160" cy="160" r="145" fill="none" stroke="currentColor" strokeWidth="8"/>
      <circle cx="160" cy="160" r="132" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="160" cy="160" r="105" fill="none" stroke="currentColor" strokeWidth="3"/>
      <text className={styles.arc}><textPath href="#stamp-top" startOffset="50%" textAnchor="middle">ANIMAVIDI</textPath></text>
      <text className={styles.est}><textPath href="#stamp-bottom" startOffset="50%" textAnchor="middle">EST. 2026</textPath></text>
      <path d="M75 182h170M68 207h184" fill="none" stroke="currentColor" strokeWidth="3"/>
      <text className={styles.explorer} x="160" y="202" textAnchor="middle">EXPLORER</text>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
        <path d="M130 157c-12-1-18-8-18-20 0-22 17-39 42-39 26 0 46 16 46 40v27h-13v-25c-4 13-14 21-31 21-10 0-18-2-26-4Z"/>
        <path d="M190 124c13 4 21 15 21 31 0 14-7 23-19 25m-58-21v22m22-20v20m-23-60c-9-7-18-5-20 3m82 2c8-4 15-1 18 6"/>
        <path d="M233 165v-33m-18 33c5-20 11-33 18-41 7 9 14 22 20 41m-35-17h31"/>
        <path d="M72 119q9-9 18 0m-6-11q8-8 16 0" strokeWidth="2"/>
      </g>
      <path d="m56 167 8 3 8-3-3 8 3 8-8-3-8 3 3-8Zm200 0 8 3 8-3-3 8 3 8-8-3-8 3 3-8Z" fill="currentColor"/>
    </g>
  </svg>
}
