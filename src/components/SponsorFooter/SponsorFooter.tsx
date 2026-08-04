import styles from './SponsorFooter.module.css'

type SponsorFooterProps = {
  tone?: 'light' | 'dark'
}

export function SponsorFooter({ tone = 'dark' }: SponsorFooterProps) {
  return (
    <footer className={`${styles.footer} ${styles[tone]}`}>
      <a href="https://luxurysafarihomes.com" rel="noreferrer" target="_blank">
        Sponsored by LuxurySafariHomes.com
        <span className="srOnly"> (opens in a new tab)</span>
      </a>
    </footer>
  )
}
