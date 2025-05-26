import { useEffect, useState } from 'react'
import html2canvas from 'html2canvas'
import Image from 'next/image'

export default function ClientSharePic({ bommel }: { bommel: any }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(/iPhone|Android/i.test(navigator.userAgent))
  }, [])

  const handleDownload = async () => {
    const element = document.getElementById('sharepic')
    if (!element) return

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    })

    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${bommel.name || 'bommel'}-sharepic.png`
    link.click()
  }

  const handleMobileShare = async () => {
    const element = document.getElementById('sharepic')
    if (!element) return

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    })

    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${bommel.name || 'bommel'}-story.png`
    link.click()

    setTimeout(() => {
      window.location.href = 'instagram://story-camera'
    }, 1200)
  }

  return (
    <div className="flex flex-col items-center">
      <div
        id="sharepic"
        className="relative w-[360px] h-[640px] overflow-hidden rounded-lg shadow-xl"
      >
        <Image
          src="/sharepic-background.png"
          layout="fill"
          objectFit="cover"
          alt="background"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
          <h1 className="font-bangers text-2xl mb-2">I AM AN OFFICIAL BOMMLER</h1>
          <p className="text-sm">Name: {bommel.name}</p>
          <p className="text-sm">Type: {bommel.type}</p>
          <p className="text-sm">Zodiac: {bommel.zodiac}</p>
          <img
            src={bommel.imageUrl}
            alt="Bommel"
            className="w-40 h-40 rounded-full mt-4 border-4 border-white object-cover"
          />
        </div>
      </div>

      {isMobile ? (
        <>
          <button
            onClick={handleMobileShare}
            className="mt-6 px-4 py-2 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600"
          >
            📸 Share to Instagram Story
          </button>
          <p className="text-xs text-center text-gray-600 mt-2">
            💡 After saving, open Instagram and upload this image to your story.
            Don’t forget to tag <span className="text-pink-600 font-semibold">@bebetta_official</span> 💖
          </p>
        </>
      ) : (
        <button
          onClick={handleDownload}
          className="mt-6 px-4 py-2 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600"
        >
          📸 Download PNG
        </button>
      )}
    </div>
  )
}
