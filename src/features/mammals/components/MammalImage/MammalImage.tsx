import { useState, type ImgHTMLAttributes } from 'react'

import type { Mammal } from '@/features/mammals/model/mammal'
import { useMammalPhoto } from '@/features/mammals/components/MammalPhotoProvider/MammalPhotoProvider'

type MammalImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src'> & {
  readonly decorative?: boolean
  readonly mammal: Mammal
}

export function MammalImage({ decorative = false, mammal, onError, ...props }: MammalImageProps) {
  const photo = useMammalPhoto(mammal)
  const [failedSource, setFailedSource] = useState<string>()
  const src = failedSource === photo.src ? photo.fallback : photo.src

  return <img {...props} alt={decorative ? '' : mammal.imageAlt} aria-hidden={decorative || undefined} onError={(event) => { setFailedSource(photo.src); onError?.(event) }} src={src} />
}
