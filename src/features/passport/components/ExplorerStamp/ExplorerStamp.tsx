import styles from './ExplorerStamp.module.css'

export function ExplorerStamp() {
  return (
    <svg aria-hidden="true" className={styles.stamp} viewBox="0 0 320 320">
      <defs>
        <path id="explorer-stamp-top" d="M48 160a112 112 0 0 1 224 0" />
        <path id="explorer-stamp-bottom" d="M48 175a112 112 0 0 0 224 0" />
        <filter id="explorer-stamp-ink" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence baseFrequency=".026 .095" numOctaves="3" seed="26" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="2.8" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <mask id="explorer-stamp-wear">
          <rect width="320" height="320" fill="white" />
          <g fill="black" opacity=".72">
            <path d="M33 112h29v3H33zm16 96h42v4H49zm203-103h35v3h-35zM235 239h48v4h-48zM96 42h20v4H96zm60 241h28v3h-28z" />
            <circle cx="62" cy="75" r="4" /><circle cx="273" cy="181" r="5" /><circle cx="211" cy="51" r="3" />
            <circle cx="94" cy="269" r="3" /><circle cx="156" cy="145" r="2.5" /><circle cx="198" cy="188" r="3" />
          </g>
          <g fill="none" stroke="black" strokeWidth="2" opacity=".42">
            <path d="m46 152 18 3m174-82 23 5M91 224l31 4m92-4 27-5" />
          </g>
        </mask>
      </defs>

      <g filter="url(#explorer-stamp-ink)" mask="url(#explorer-stamp-wear)">
        <circle className={styles.outerRing} cx="160" cy="160" r="141" />
        <circle className={styles.brokenRing} cx="160" cy="160" r="132" />
        <circle className={styles.innerRing} cx="160" cy="160" r="101" />

        <text className={styles.arc}><textPath href="#explorer-stamp-top" startOffset="50%" textAnchor="middle">ANIMAVIDI</textPath></text>
        <text className={styles.est}><textPath href="#explorer-stamp-bottom" startOffset="50%" textAnchor="middle">EST. 2026</textPath></text>

        <path className={styles.star} d="m54 165 4 2 4-2-1 5 3 3-5 .5-2 4-2-4-5-.5 3-3Z" />
        <path className={styles.star} d="m258 165 4 2 4-2-1 5 3 3-5 .5-2 4-2-4-5-.5 3-3Z" />

        <g className={styles.ornament}>
          <path d="M104 119h28m56 0h28" />
          <path d="m146 118 4 2 4-2-1 5 3 3-5 .5-2 4-2-4-5-.5 3-3Zm22 0 4 2 4-2-1 5 3 3-5 .5-2 4-2-4-5-.5 3-3Z" />
          <circle cx="137" cy="119" r="2.5" />
          <circle cx="183" cy="119" r="2.5" />
        </g>

        <path className={styles.divider} d="M77 156h166M70 198h180" />
        <text className={styles.explorer} x="160" y="187" textAnchor="middle">EXPLORER</text>
      </g>
    </svg>
  )
}
