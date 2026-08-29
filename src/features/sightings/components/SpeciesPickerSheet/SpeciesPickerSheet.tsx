import { useEffect, useMemo, useRef, useState } from 'react'

import type { Mammal, MammalCategory } from '@/features/mammals/model/mammal'
import { MammalImage } from '@/features/mammals/components/MammalImage/MammalImage'
import { mammals } from '@/features/mammals/model/mammals'
import { loadRecentlyObservedMammals } from '@/features/sightings/services/recentSpeciesService'

import styles from './SpeciesPickerSheet.module.css'

type SpeciesPickerSheetProps = {
  onClose: () => void
  onSelect: (animalId: string) => void
  open: boolean
}

type PickerSection = {
  category?: MammalCategory
  id: string
  mammals?: readonly Mammal[]
  title: string
}

const categorySections: readonly PickerSection[] = [
  { category: 'big-five', id: 'big-five', title: 'Big Five' },
  { category: 'predators', id: 'predators', title: 'Predators' },
  { category: 'antelopes', id: 'antelopes', title: 'Antelopes' },
  { category: 'primates', id: 'primates', title: 'Primates' },
  { id: 'all-main-mammals', mammals: mammals.filter((mammal) => mammal.overviewSection === 'main'), title: 'All main mammals' },
  { id: 'bats', mammals: mammals.filter((mammal) => mammal.smallMammalGroup === 'bats'), title: 'Small mammals · Bats' },
  { id: 'rodents', mammals: mammals.filter((mammal) => mammal.smallMammalGroup === 'rodents'), title: 'Small mammals · Rodents' },
  { id: 'shrews-moles', mammals: mammals.filter((mammal) => mammal.smallMammalGroup === 'shrews-moles'), title: 'Small mammals · Shrews & Moles' },
]

const alphabetically = (entries: readonly Mammal[]) => entries.slice().sort((left, right) => left.sortName.localeCompare(right.sortName) || left.commonName.localeCompare(right.commonName))

function categoryLabel(value?: string) {
  if (!value) return 'Kruger mammal'
  return value.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toLocaleUpperCase())
}

export function SpeciesPickerSheet({ onClose, onSelect, open }: SpeciesPickerSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [recentMammals, setRecentMammals] = useState<readonly Mammal[]>([])
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const searchResults = useMemo(() => alphabetically(mammals.filter((mammal) => !normalizedQuery || [mammal.commonName, mammal.scientificName ?? '', ...mammal.aliases].join(' ').toLocaleLowerCase().includes(normalizedQuery))), [normalizedQuery])
  const sections = useMemo<readonly PickerSection[]>(() => recentMammals.length ? [{ id: 'recently-observed', mammals: recentMammals, title: 'Recently observed' }, ...categorySections] : categorySections, [recentMammals])

  useEffect(() => {
    if (!open) return
    let current = true
    void loadRecentlyObservedMammals().then((entries) => { if (current) setRecentMammals(entries) }).catch(() => { if (current) setRecentMammals([]) })
    return () => { current = false }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.body.dataset.pickerOpen = 'true'
      requestAnimationFrame(() => searchRef.current?.focus())
    }
    if (!open && dialog.open) dialog.close()
    if (!open) {
      delete document.body.dataset.pickerOpen
      setQuery('')
    }
    return () => { delete document.body.dataset.pickerOpen }
  }, [open])

  function close() {
    onClose()
  }

  return (
    <dialog aria-describedby="species-picker-description" aria-labelledby="species-picker-title" className={styles.dialog} onCancel={(event) => { event.preventDefault(); close() }} onClick={(event) => { if (event.target === event.currentTarget) close() }} onClose={onClose} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); close() } }} ref={dialogRef}>
      <div aria-live="polite" className="srOnly">{open ? 'Animal chooser opened' : ''}</div>
      <div className={styles.sheet}>
        <div aria-hidden="true" className={styles.handle} />
        <header>
          <div><h2 id="species-picker-title">What did you see?</h2><p id="species-picker-description">Choose an animal to start your sighting.</p></div>
          <button aria-label="Close animal chooser" className={styles.close} onClick={close} type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
        </header>
        <label className={styles.search}>
          <span className="srOnly">Search animals by English name, scientific name or alias</span>
          <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>
          <input onChange={(event) => setQuery(event.target.value)} placeholder="Search animals…" ref={searchRef} type="search" value={query} />
          {query ? <button aria-label="Clear search" className={styles.clear} onClick={() => { setQuery(''); searchRef.current?.focus() }} type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17" /></svg></button> : null}
        </label>
        <div className={styles.scrollArea}>
          {normalizedQuery ? (
            <section aria-labelledby="search-results-title" className={styles.section}>
              <div className={styles.sectionHeading}><h3 id="search-results-title">Search results</h3><span role="status">{searchResults.length}</span></div>
              {searchResults.length ? <div className={styles.list}>{searchResults.map((mammal) => <SpeciesRow key={mammal.id} mammal={mammal} onSelect={onSelect} />)}</div> : <div className={styles.empty} role="status"><svg aria-hidden="true" viewBox="0 0 32 32"><circle cx="14" cy="14" r="8"/><path d="m20 20 7 7"/></svg><strong>No animals found.</strong><span>Try another name or alias.</span></div>}
            </section>
          ) : sections.map((section) => {
            const sectionMammals = section.mammals ?? mammals.filter((mammal) => section.category && mammal.categories.includes(section.category))
            const entries = section.id === 'recently-observed' ? sectionMammals : alphabetically(sectionMammals)
            if (!entries.length) return null
            return <section aria-labelledby={`${section.id}-title`} className={styles.section} key={section.id}><div className={styles.sectionHeading}><h3 id={`${section.id}-title`}>{section.title}</h3><span>{entries.length}</span></div><div className={styles.list}>{entries.map((mammal) => <SpeciesRow key={mammal.id} mammal={mammal} onSelect={onSelect} />)}</div></section>
          })}
        </div>
      </div>
    </dialog>
  )
}

function SpeciesRow({ mammal, onSelect }: { mammal: Mammal; onSelect: (animalId: string) => void }) {
  return <button className={styles.species} onClick={() => onSelect(mammal.id)} type="button"><MammalImage mammal={mammal} /><span><strong>{mammal.commonName}</strong>{mammal.scientificName ? <em>{mammal.scientificName}</em> : null}<small>{categoryLabel(mammal.categories[0])}</small></span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg></button>
}
