// components/MobileCameraCapture.tsx
import React, { useEffect, useRef, useState } from 'react'

export default function MobileCameraCapture({ onCapture }: { onCapture: (file: File) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [capturedFile, setCapturedFile] = useState<File | null>(null)

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          videoRef.current.play()
        }
      } catch (error) {
        console.error('Camera access error:', error)
      }
    }
    startCamera()

    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const stopStream = () => {
    stream?.getTracks().forEach((track) => track.stop())
    setStream(null)
  }

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `bommel-${Date.now()}.jpg`, { type: 'image/jpeg' })
        setCapturedFile(file)
        setPreviewUrl(URL.createObjectURL(file))
      }
    }, 'image/jpeg', 0.9)
  }

  const handleRetake = () => {
    setCapturedFile(null)
    setPreviewUrl(null)
  }

  const handleUsePhoto = () => {
    if (capturedFile) {
      stopStream()
      onCapture(capturedFile)
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
      {!previewUrl ? (
        <>
          <div className="relative w-full max-w-md aspect-square overflow-hidden">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
            <div className="absolute inset-0 rounded-full border-8 border-pink-400 shadow-xl pointer-events-none"></div>
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
          <div className="flex gap-4">
            <button
              onClick={handleRetake}
              className="bg-gray-200 px-4 py-2 rounded-full text-black font-semibold"
            >
              🔄 Retake
            </button>
            <button
              onClick={handleUsePhoto}
              className="bg-green-500 text-white px-4 py-2 rounded-full font-bold"
            >
              ✅ Use this photo
            </button>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
