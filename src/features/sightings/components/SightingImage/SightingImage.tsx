import { useEffect, useState } from 'react'

import type { Mammal } from '@/features/mammals/model/mammal'
import { useMammalPhoto } from '@/features/mammals/components/MammalPhotoProvider/MammalPhotoProvider'
import type { SightingPhoto } from '@/features/sightings/model/sighting'

type SightingImageProps = {
  className?: string
  mammal?: Mammal
  objectPosition?: string
  photo?: SightingPhoto
}

export function SightingImage({ className, mammal, objectPosition, photo }: SightingImageProps) {
  const [photoUrl, setPhotoUrl] = useState<string>()

  useEffect(() => {
    if (!photo) {
      setPhotoUrl(undefined)
      return
    }
    const url = URL.createObjectURL(photo.blob)
    setPhotoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  return mammal ? <KnownMammalSightingImage className={className} mammal={mammal} objectPosition={objectPosition} photoUrl={photoUrl} /> : <img alt="Saved wildlife sighting" className={className} src={photoUrl ?? createMissingAnimalPlaceholder()} />
}

function KnownMammalSightingImage({ className, mammal, objectPosition, photoUrl }: { className?: string; mammal: Mammal; objectPosition?: string; photoUrl?: string }) {
  const resolved = useMammalPhoto(mammal)
  return (
    <img
      alt={mammal.imageAlt}
      className={className}
      onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = resolved.fallback }}
      src={photoUrl ?? resolved.src}
      style={!photoUrl && objectPosition ? { objectPosition } : undefined}
    />
  )
}

function createMissingAnimalPlaceholder() {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#F6F3EC"/><circle cx="400" cy="270" r="130" fill="#1E3328"/><text x="400" y="470" text-anchor="middle" fill="#1E3328" font-family="Georgia,serif" font-size="38">UNKNOWN SPECIES</text></svg>'
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
