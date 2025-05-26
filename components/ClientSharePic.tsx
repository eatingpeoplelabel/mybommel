import { useEffect, useState } from 'react'
import html2canvas from 'html2canvas'
import Image from 'next/image'

export default function ClientSharePic({ bommel }: { bommel: any }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(/iPhone|Android/i.test(navigator.userAgent))
  }, [])

  const handleCapture = async () => {
    const element = document.getElementById('sharepic')
    if (!element) return

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    })

    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${bommel.name || 'bommel'}-sharepic.png`
    link.click()
  }

  const handleMobileShare = async () => {
    await handleCapture()
    setTimeout(() => {
      window.location.href = 'instagram://story-camera'
    }, 1200)
  }

  const fluffStars = typeof bommel.fluff_level === 'string' || typeof bommel.fluff_level === 'number'
    ? '★'.repeat(Number(bommel.fluff_level))
    : '—'

  return (
    <div className="flex flex-col items-center">
      <div
        id="sharepic"
        className="relative w-[360px] h-[640px] overflow-hidden rounded-lg shadow-lg font-montserrat text-black"
      >
        {/* Background Frame */}
        <Image
          src="/sharepic/quartett-bg.png"
          alt="background"
          fill
          className="object-cover"
          priority
        />

        {/* Avatar */}
        <div
          className="absolute border-4 border-white rounded-full overflow-hidden"
          style={{ top: 20, left: 60, width: 240, height: 240 }}
        >
          <img
            src={bommel.imageUrl}
            alt="Bommel"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Title */}
        <div className="absolute top-[280px] left-[30px] w-[300px] h-[50px] bg-white/80 border-2 border-purple-700 rounded-full flex items-center justify-center">
          <span className="font-bangers text-xl text-purple-700 text-center">
            I AM AN OFFICIAL BOMMLER
          </span>
        </div>

        {/* Number Badge */}
        <div className="absolute top-[345px] left-[80px] w-[200px] h-[38px] bg-purple-700 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-lg">
            No. {bommel.bommler_number}
          </span>
        </div>

        {/* Attribute Panel */}
        <div className="absolute top-[400px] left-[30px] w-[300px] h-[180px] bg-white/90 rounded-xl p-2 text-xs leading-5">
          <div className="flex justify-between">
            <div>
              <div><strong>Name:</strong> {bommel.name}</div>
              <div><strong>Type:</strong> {bommel.type}</div>
              <div><strong>Birthday:</strong> {bommel.birthday}</div>
              <div><strong>Zodiac:</strong> {bommel.zodiac}</div>
              <div><strong>Location:</strong> {bommel.location || 'Unknown'}</div>
            </div>
            <div>
              <div><strong>Fluff Level:</strong> {fluffStars}</div>
              <div><strong>Density:</strong> {Math.floor(Math.random() * 101)}%</div>
              <div><strong>Dreaminess:</strong> {['☁️','☁️☁️','☁️☁️☁️','☁️☁️☁️☁️','☁️☁️☁️☁️☁️'][Math.floor(Math.random()*5)]}</div>
              <div><strong>Bounce:</strong> {Math.floor(Math.random()*10)+1}</div>
              <div><strong>Attack:</strong> {Math.floor(Math.random()*10)+1}</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="absolute bottom-[30px] left-[30px] w-[300px] h-[60px] bg-pink-500 rounded-xl flex flex-col justify-center items-center text-white text-center px-2 text-sm">
          <div>Ready to fluff the world?</div>
          <div className="text-yellow-300 font-bold">mybommel.com</div>
          <div className="text-xs">by Bebetta with Love</div>
        </div>
      </div>

      {/* Buttons */}
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
          onClick={handleCapture}
          className="mt-6 px-4 py-2 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600"
        >
          📸 Download PNG
        </button>
      )}
    </div>
  )
}
