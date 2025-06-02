import imageCompression from 'browser-image-compression'

export async function cropAndResizeImageToAspect(
  file: File,
  aspectRatio = 4 / 5,
  maxSize = 1000
): Promise<File> {
  const imageBitmap = await createImageBitmap(file)
  const { width, height } = imageBitmap

  const inputAspect = width / height
  let cropWidth = width
  let cropHeight = height

  if (inputAspect > aspectRatio) {
    cropWidth = height * aspectRatio
  } else {
    cropHeight = width / aspectRatio
  }

  const cropX = (width - cropWidth) / 2
  const cropY = (height - cropHeight) / 2

  const canvas = document.createElement('canvas')
  canvas.width = maxSize
  canvas.height = Math.round(maxSize / aspectRatio)

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  ctx.drawImage(
    imageBitmap,
    cropX, cropY, cropWidth, cropHeight,
    0, 0, canvas.width, canvas.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return reject(new Error('Image compression failed'))

      const croppedFile = new File([blob], file.name, { type: 'image/jpeg' })

      const compressed = await imageCompression(croppedFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: maxSize,
        useWebWorker: true,
      })

      resolve(compressed)
    }, 'image/jpeg', 0.9)
  })
}
