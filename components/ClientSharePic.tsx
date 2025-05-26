// components/ClientSharePic.tsx
import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { QUARTETT_BG_BASE64 } from '@/lib/quartettBg'

export default function ClientSharePic({ bommel }: { bommel: any }) {
  const ref = useRef<HTMLDivElement>(null)

  const fuzzDensity = Math.floor(Math.random() * 101)
  const dreaminessEmoji = ['☁️','☁️☁️','☁️☁️☁️','☁️☁️☁️☁️','☁️☁️☁️☁️☁️'][Math.floor(Math.random() * 5)]
  const bounceFactor = Math.floor(Math.random() * 10) + 1
  const fluffAttack = Math.floor(Math.random() * 10) + 1
  const fluffStars = typeof bommel.fluff_level === 'string' || typeof bommel.fluff_level === 'number'
    ? '★'.repeat(Number(bommel.fluff_level))
    : '—'

  const handleDownload = async () => {
    if (!ref.current) return
    const canvas = await html2canvas(ref.current, {
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

  return (
    <div className="flex flex-col items-center">
      <div ref={ref} className="w-[360px] aspect-[9/16]">
        <svg
          width="720"
          height="1280"
          viewBox="0 0 1080 1920"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <image href={QUARTETT_BG_BASE64} width="1080" height="1920" />
          <g transform="translate(0,288)">
            <defs>
              <clipPath id="clip">
                <circle cx="540" cy="270" r="250" />
              </clipPath>
            </defs>
            <circle cx="540" cy="270" r="254" fill="none" stroke="#fff" strokeWidth="4" />
            <image
              href={bommel.imageUrl}
              x="290"
              y="20"
              width="500"
              height="500"
              clipPath="url(#clip)"
            />
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
          <g transform="translate(0,0)">
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
        className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow"
      >
        📸 Download Sharepic
      </button>
    </div>
  )
}
