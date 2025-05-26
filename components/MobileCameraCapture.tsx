// components/MobileCameraCapture.tsx
import React, { useEffect, useRef, useState } from 'react'

export default function MobileCameraCapture({ onCapture }: { onCapture: (file: File) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          setStreaming(true)
        }
      } catch (err) {
        setError('Unable to access camera')
        console.error(err)
      }
    }
    startCamera()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], `bommel-${Date.now()}.jpg`, { type: 'image/jpeg' })
        setPreviewUrl(URL.createObjectURL(file))
        onCapture(file)
      }
    }, 'image/jpeg', 0.9)
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
      {error && <p className="text-white text-center mb-4">{error}</p>}
      {!previewUrl ? (
        <>
          <div className="relative w-full max-w-md aspect-square">
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-full border-4 border-pink-400"
            />
            <div className="absolute inset-0 rounded-full border-8 border-pink-300/60 pointer-events-none shadow-xl"></div>
          </div>
          <button
            onClick={handleCapture}
            className="mt-6 bg-pink-500 text-white font-bold py-3 px-6 rounded-full shadow-xl hover:bg-pink-400"
          >
            📸 Take Bommel Shot
          </button>
        </>
      ) : (
        <>
          <div className="w-full max-w-md aspect-square mb-4">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-full border-4 border-pink-400" />
          </div>
          <p className="text-pink-200">Your Bommel picture was captured! 🎉</p>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
