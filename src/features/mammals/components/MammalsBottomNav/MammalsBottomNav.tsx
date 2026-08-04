import { Link } from 'react-router-dom'

import styles from './MammalsBottomNav.module.css'

const items = [
  { icon: '⌂', label: 'Home', to: '/parks/kruger' },
  { icon: '●', label: 'Mammals', to: '/parks/kruger/mammals' },
  { icon: '☆', label: 'My Sightings', to: '/parks/kruger/sightings' },
  { icon: '◇', label: 'Park Map', to: '/parks/kruger/map' },
  { icon: 'i', label: 'Park Info', to: '/parks/kruger/information' },
  { icon: 'P', label: 'Passport', to: '/passport' },
] as const

type MammalsBottomNavProps = {
  active?: 'mammals' | 'sightings' | 'map' | 'passport' | 'information'
  fixed?: boolean
}

export function MammalsBottomNav({ active = 'mammals', fixed = false }: MammalsBottomNavProps) {
  return (
    <nav aria-label="Kruger sections" className={`${styles.navigation} ${fixed ? styles.fixed : ''}`}>
      {items.map((item) => {
        const activeLabel = active === 'mammals' ? 'Mammals' : active === 'sightings' ? 'My Sightings' : active === 'map' ? 'Park Map' : active === 'information' ? 'Park Info' : 'Passport'
        const isActive = item.label === activeLabel
        return (
          <Link aria-current={isActive ? 'page' : undefined} className={isActive ? styles.active : undefined} key={item.label} to={item.to}>
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
