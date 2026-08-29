const acceptedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maximumInputBytes = 10 * 1024 * 1024
const maximumLongSide = 1600

export async function prepareAdminPhoto(file: File): Promise<Blob> {
  if (!acceptedTypes.has(file.type)) throw new Error('Use a JPEG, PNG or WebP photo.')
  if (file.size > maximumInputBytes) throw new Error('Choose a photo smaller than 10 MB.')
  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, maximumLongSide / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('This browser cannot prepare the photo.')
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const result = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.88))
    if (!result) throw new Error('This browser cannot create a WebP photo.')
    if (result.size > maximumInputBytes) throw new Error('The prepared photo is still larger than 10 MB.')
    return result
  } finally {
    bitmap.close()
  }
}
