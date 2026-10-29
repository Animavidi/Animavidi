const images = import.meta.glob<string>('/src/assets/birds/*/primary.webp', { eager: true, import: 'default', query: '?url' })

export function getBirdPrimaryImage(animalId: string): string | undefined {
  return images[`/src/assets/birds/${animalId}/primary.webp`]
}
