import { useRef, useState } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'

import addSightingIcon from '@/assets/icons/animavidi-add-sighting-final.svg'
import { findMammal } from '@/features/mammals/model/mammals'
import { AddSightingFab } from '@/features/sightings/components/AddSightingFab/AddSightingFab'
import { SpeciesPickerSheet } from '@/features/sightings/components/SpeciesPickerSheet/SpeciesPickerSheet'

import styles from './AddSightingLauncher.module.css'

type AddSightingLauncherProps = {
  disabled?: boolean
}

const pickerRoutes = new Set(['/parks/kruger', '/parks/kruger/mammals', '/parks/kruger/sightings', '/parks/kruger/map', '/parks/kruger/information', '/passport'])

export function AddSightingLauncher({ disabled = false }: AddSightingLauncherProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [pickerOpen, setPickerOpen] = useState(false)
  const detailMatch = matchPath({ end: true, path: '/parks/kruger/mammals/:animalId' }, location.pathname)
  const directAnimalId = detailMatch?.params.animalId && findMammal(detailMatch.params.animalId) ? detailMatch.params.animalId : undefined
  const visible = !disabled && (pickerRoutes.has(location.pathname) || Boolean(directAnimalId))

  if (!visible) return null

  function closePicker() {
    setPickerOpen(false)
    requestAnimationFrame(() => buttonRef.current?.focus())
  }

  function launch() {
    if (directAnimalId) void navigate(`/parks/kruger/mammals/${directAnimalId}/sightings/new`)
    else setPickerOpen(true)
  }

  function selectSpecies(animalId: string) {
    setPickerOpen(false)
    void navigate(`/parks/kruger/mammals/${animalId}/sightings/new`)
  }

  const clearanceClassName = location.pathname === '/parks/kruger' ? `${styles.clearance} ${styles.withoutNavigation}` : styles.clearance
  const brandIcon = <img alt="" draggable="false" src={addSightingIcon} />
  return <><div aria-hidden="true" className={clearanceClassName} /><AddSightingFab contextKey={location.pathname} icon={brandIcon} label="Add sighting" onActivate={launch} ref={buttonRef} /><SpeciesPickerSheet onClose={closePicker} onSelect={selectSpecies} open={pickerOpen} /></>
}
