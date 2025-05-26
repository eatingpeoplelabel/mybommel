// components/ClientSharePic.tsx
import { useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'

export default function ClientSharePic({ bommel }: { bommel: any }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Optional: auto-scroll into view
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

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

  const fluffStars = typeof bommel.fluff_level === 'string' || typeof bommel.fluff_level === 'number'
    ? '★'.repeat(Number(bommel.fluff_level))
    : '—'

  return (
    <div className="mt-6 flex flex-col items-center">
      <div
        id="sharepic"
        ref={ref}
        className="relative w-[360px] h-[640px] rounded-xl shadow-xl overflow-hidden text-[14px] font-montserrat"
        style={{ backgroundImage: "url('/sharepic/quartett-bg.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Avatar */}
        <div
          className="absolute rounded-full border-4 border-white overflow-hidden"
          style={{ top: '20px', left: '70px', width: '220px', height: '220px' }}
        >
          <img
            src={bommel.imageUrl}
            alt="Bommel"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Badge */}
        <div
          className="absolute flex items-center justify-center rounded-full text-white text-[20px] font-bold"
          style={{ top: '255px', left: '80px', width: '200px', height: '40px', backgroundColor: '#8e24aa' }}
        >
          No. {bommel.bommler_number}
        </div>

        {/* Title */}
        <div
          className="absolute flex items-center justify-center rounded-full border-4 border-[#8e24aa] bg-white/90 font-bangers text-[22px] text-[#8e24aa]"
          style={{ top: '310px', left: '30px', width: '300px', height: '50px' }}
        >
          I AM AN OFFICIAL BOMMLER
        </div>

        {/* Attribute Panel */}
        <div
          className="absolute flex flex-col gap-1 bg-white/90 rounded-xl p-3 text-black"
          style={{ top: '380px', left: '30px', width: '300px' }}
        >
          <div className="flex justify-between">
            <div>
              <div><b>Name:</b> {bommel.name}</div>
              <div><b>Type:</b> {bommel.type}</div>
              <div><b>Birthday:</b> {bommel.birthday}</div>
              <div><b>Zodiac:</b> {bommel.zodiac}</div>
              <div><b>Location:</b> {bommel.location || 'Unknown'}</div>
            </div>
            <div>
              <div><b>Fluff Level:</b> {fluffStars}</div>
              <div><b>Density:</b> {Math.floor(Math.random() * 101)}%</div>
              <div><b>Dreaminess:</b> {'☁️'.repeat(Math.floor(Math.random() * 5) + 1)}</div>
              <div><b>Bounce:</b> {Math.floor(Math.random() * 10) + 1}</div>
              <div><b>Attack:</b> {Math.floor(Math.random() * 10) + 1}</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className="absolute text-center text-white px-4 rounded-xl"
          style={{ bottom: '20px', left: '30px', width: '300px', height: '60px', backgroundColor: '#ff69b4' }}
        >
          <div className="pt-1 text-[14px]">Ready to fluff the world?</div>
          <div className="font-bold text-[16px] text-yellow-300">mybommel.com</div>
          <div className="text-[12px]">by Bebetta with Love</div>
        </div>
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
