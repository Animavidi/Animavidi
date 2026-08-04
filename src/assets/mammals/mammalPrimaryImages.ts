const primaryImageModules = import.meta.glob<string>('/src/assets/mammals/*/primary.webp', {
  eager: true,
  import: 'default',
  query: '?url',
})

export function getMammalPrimaryImage(mammalId: string): string | undefined {
  return primaryImageModules[`/src/assets/mammals/${mammalId}/primary.webp`]
}
