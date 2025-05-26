// components/ClientSharePic.tsx
import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { QUARTETT_BG_BASE64 } from '@/lib/quartettBg'

export default function ClientSharePic({ bommel }: { bommel: any }) {
  const ref = useRef<HTMLDivElement>(null)
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)

  // random attributes
  const fuzzDensity = Math.floor(Math.random() * 101)
  const dreaminessEmoji = ['☁️','☁️☁️','☁️☁️☁️','☁️☁️☁️☁️','☁️☁️☁️☁️☁️'][Math.floor(Math.random() * 5)]
  const bounceFactor = Math.floor(Math.random() * 10) + 1
  const fluffAttack = Math.floor(Math.random() * 10) + 1
  const fluffStars = typeof bommel.fluff_level === 'string' || typeof bommel.fluff_level === 'number'
    ? '★'.repeat(Number(bommel.fluff_level))
    : '—'

  // preload image as data URL
  useEffect(() => {
    if (!bommel.imageUrl) return
    fetch(bommel.imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader()
        reader.onloadend = () => setImageDataUrl(reader.result as string)
        reader.readAsDataURL(blob)
      })
  }, [bommel.imageUrl])

  // download handler
  const handleDownload = async () => {
    if (!ref.current) return
    const canvas = await html2canvas(ref.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      width: 1080,
      height: 1920,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1080,
      windowHeight: 1920
    })
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${bommel.name || 'bommel'}-sharepic.png`
    link.click()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* responsive container: keep aspect ratio */}
      <div
        ref={ref}
        className="relative w-full max-w-[360px] overflow-hidden"
        style={{ paddingTop: '177.78%' /* 1920/1080 = 1.7778 => 100% * 1.7778 */ }}
      >
        <svg
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily: 'Montserrat, sans-serif', width: '100%', height: '100%' }}
        >
          <image href={QUARTETT_BG_BASE64} width="1080" height="1920" />
          <g transform="translate(0,288)">
            <defs>
              <clipPath id="clip">
                <circle cx="540" cy="270" r="250" />
              </clipPath>
            </defs>
            <circle cx="540" cy="270" r="254" fill="none" stroke="#fff" strokeWidth="4" />
            {imageDataUrl && (
              <image
                href={imageDataUrl}
                x="290"
                y="20"
                width="500"
                height="500"
                clipPath="url(#clip)"
              />
            )}
            <rect x="390" y="425" width="300" height="54" rx="27" fill="#8e24aa" />
            <text
              x="540"
              y="460"
              textAnchor="middle"
              fontSize="37"
              fontFamily="Montserrat, sans-serif"
              fill="#fff"
            >
              No. {bommel.bommler_number}
            </text>
            <rect x="140" y="570" width="800" height="70" rx="35" fill="#ffffffcc" stroke="#8e24aa" strokeWidth="4" />
            <text x="540" y="620" textAnchor="middle" fontFamily="Bangers, sans-serif" fontSize="50" fill="#8e24aa">
              I AM AN OFFICIAL BOMMLER
            </text>
            <rect x="135" y="750" width="810" height="265" rx="10" fill="#ffffffdd" />
            <line x1="540" y1="770" x2="540" y2="995" stroke="#ccc" strokeWidth="2" strokeDasharray="4,4" />
            <text x="155" y="795" fontSize="30" fill="#333">Name: {bommel.name}</text>
            <text x="155" y="840" fontSize="30" fill="#333">Type: {bommel.type}</text>
            <text x="155" y="885" fontSize="30" fill="#333">Birthday: {bommel.birthday}</text>
            <text x="155" y="930" fontSize="30" fill="#333">Zodiac: {bommel.zodiac}</text>
            <text x="155" y="975" fontSize="30" fill="#333">Location: {bommel.location || 'Unknown'}</text>
            <text x="575" y="795" fontSize="30" fill="#333">Fluff Level: {fluffStars}</text>
            <text x="575" y="840" fontSize="30" fill="#333">Fuzz Density: {fuzzDensity}%</text>
            <text x="575" y="885" fontSize="30" fill="#333">Dreaminess: {dreaminessEmoji}</text>
            <text x="575" y="930" fontSize="30" fill="#333">Bounce Factor: {bounceFactor}</text>
            <text x="575" y="975" fontSize="30" fill="#333">Fluff Attack: {fluffAttack}</text>
          </g>
          <g>
            <rect x="220" y="1380" width="640" height="140" rx="20" fill="#ff69b4" />
            <text x="540" y="1430" textAnchor="middle" fontSize="30" fill="#fff">
              Ready to fluff the world?
            </text>
            <text x="540" y="1490" textAnchor="middle" fontSize="30" fill="#ffff00">
              <tspan fontWeight="700">mybommel.com</tspan> by Bebetta with Love
            </text>
          </g>
        </svg>
      </div>

      <button
        onClick={handleDownload}
        className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow"
      >
        📸 Download Sharepic
      </button>
    </div>
  )
}