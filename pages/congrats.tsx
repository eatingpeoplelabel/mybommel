import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { getBommelZodiacEn } from '@/lib/zodiac-en'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Congrats() {
  const { query } = useRouter()
  const id = Array.isArray(query.id) ? query.id[0] : query.id

  const [bommel, setBommel] = useState<any | null>(null)
  const [zodiac, setZodiac] = useState<any | null>(null)
  const [showHoroscope, setShowHoroscope] = useState(false)
  const [bommelVisible, setBommelVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileModal, setShowMobileModal] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const popAudioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!id) return
    supabase
      .from('bommler')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (data) setBommel(data)
        else console.error('❌ Bommel not found:', error)
      })
  }, [id])

  useEffect(() => {
    if (bommel?.birthday) {
      setZodiac(getBommelZodiacEn(new Date(bommel.birthday)))
    }
  }, [bommel])

  useEffect(() => {
    const timer = setTimeout(() => setBommelVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setIsMobile(/iPhone|Android/i.test(navigator.userAgent))
  }, [])

  const handleBallClick = () => {
    audioRef.current?.play().catch(() => {})
    setShowHoroscope(prev => !prev)
  }

  const handlePlopClick = () => {
    popAudioRef.current?.play().catch(() => {})
  }

  const confirmLeave = (e: React.MouseEvent) => {
    const leave = confirm(
      `✨ WAIT! Before you leave the Fluffdom... ✨

🧶 Have you downloaded your majestic certificate?
📸 Saved your glorious Insta Story image?
👁 Memorized the secret code to summon the Bommel God?

Leaving unprepared may result in mild existential fuzziness... 🌀

Still brave enough to continue?`
    )
    if (!leave) e.preventDefault()
  }

  const imageUrl = bommel?.image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bommel-images/${bommel.image_path}`
    : '/Bommel1Register.webp'

  return (
    <>
      <a href="/" onClick={confirmLeave} className="fixed top-4 left-4 z-50">
        <img
          src="/back-to-home.webp"
          alt="Back to Home"
          className="w-24 h-auto cursor-pointer"
        />
      </a>

      <main className="relative min-h-screen bg-gradient-to-b from-pink-300 via-yellow-200 via-green-300 to-purple-300 flex flex-col items-center justify-start pt-10 px-6 overflow-visible">
        <audio ref={audioRef} src="/magic-sound.mp3" preload="auto" />
        <audio ref={popAudioRef} src="/plop-sound.mp3" preload="auto" />

        <div className="mx-auto w-full max-w-5xl h-[20rem] relative z-10 flex justify-center mb-[-3rem]">
          <img
            src="/congratulations-fluffy-3d.webp"
            alt="Congratulations!"
            className="w-full h-full object-contain animate-float cursor-pointer hover:scale-110 transition-transform duration-300 drop-shadow-2xl"
          />
        </div>

        <div className="relative z-20 bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl p-10 max-w-xl w-full text-center space-y-6">
          <div
            className="absolute -bottom-12 -right-12 w-28 h-28 cursor-pointer opacity-80 animate-float-slow"
            onClick={handleBallClick}
          >
            <img
              src="/crystal-ball.webp"
              alt="Crystal Ball"
              className={`w-full h-full transition-transform duration-500 ${
                showHoroscope ? 'transform -translate-x-6 -translate-y-6 scale-110' : ''
              }`}
            />
          </div>

          <div className="mx-auto w-40 h-40 border-4 border-yellow-300 rounded-full overflow-hidden shadow-xl">
            <img src={imageUrl} alt="Your Bommel" className="w-full h-full object-cover" />
          </div>

          <p className="text-lg text-gray-800 font-medium">
            You are now an official <span className="font-bold">Bommler</span><br />
            and your official Bommel number is:
          </p>
          <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4">
            <p className="text-4xl font-extrabold text-purple-600 hover:shadow-lg transition-shadow">
              {bommel?.bommler_number || `BOM-${id}`}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href={`/api/certificate?id=${id}`}
              className="bg-pink-500 hover:bg-pink-400 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition"
            >
              📄 Download Certificate
            </Link>
            {isMobile ? (
              <button
                onClick={() => setShowMobileModal(true)}
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition"
              >
                📸 Share to Insta Story
              </button>
            ) : (
              <a
                href={`/api/share-image?id=${id}`}
                download
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition"
              >
                📸 Download Story Image
              </a>
            )}
          </div>

          {/* BOMMELGOTT HINWEIS */}
          <div className="pt-4 text-sm text-center text-purple-800 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 shadow-inner">
            <p className="font-semibold mb-1">🌟 A whisper from beyond the fluff...</p>
            <p className="text-xs text-gray-600 mb-2 italic">The ancient code to summon the Bommel God:</p>
            <p className="font-mono text-xl font-bold text-pink-600 tracking-widest bg-pink-100 inline-block px-4 py-2 rounded-lg shadow-sm mb-2">
              bommelbommel
            </p>
            <p className="mt-2">
              Enter it on the{' '}
              <a
                href="/"
                onClick={confirmLeave}
                className="underline text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                home page
              </a>{' '}
              if you dare to meet the almighty <span className="text-purple-700 font-bold">Bommel God 👁</span>
            </p>
          </div>
        </div>

        {showHoroscope && zodiac && (
          <div className="fixed top-1/2 right-5 transform -translate-y-1/2 -translate-x-10 bg-purple-50 border-2 border-purple-300 rounded-lg p-6 shadow-lg max-w-xs z-30">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-bold text-purple-700">YOUR BOMMEL HOROSCOPE</h4>
              <button onClick={() => setShowHoroscope(false)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
            <p className="text-sm text-purple-800 mb-1"><span className="font-semibold">Zodiac:</span> {zodiac.name}</p>
            <p className="text-sm text-purple-800 mb-2"><span className="font-semibold">Element:</span> {zodiac.element}</p>
            <p className="text-sm text-gray-800">{zodiac.description}</p>
          </div>
        )}

        {bommelVisible && (
          <div
            role="button"
            tabIndex={0}
            className="fixed bottom-10 left-10 w-32 h-32 z-0 hover:scale-110 hover:animate-bounce transition duration-300 cursor-pointer active:scale-90"
            onClick={handlePlopClick}
          >
            <img
              src="/Bommel1Aufplopp.webp"
              alt="Happy Bommel"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {isMobile && showMobileModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowMobileModal(false)}
              >
                ×
              </button>
              <img
                src={`/api/share-image?id=${id}`}
                alt="Your Bommel Story"
                className="w-full rounded-lg mb-4"
              />
              <p className="text-sm mb-2 text-gray-700">
                📲 Save this image and post it to your Instagram Story!
              </p>
              <p className="text-sm text-pink-600 font-semibold mb-4">
                Don’t forget to tag <span className="underline">@bebetta_official</span> so we can share your fluff! 💖
              </p>
              <div className="flex gap-2 justify-center">
                <a
                  href={`/api/share-image?id=${id}`}
                  download
                  className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold py-2 px-4 rounded-full shadow"
                >
                  ⬇️ Save Image
                </a>
                <a
                  href="instagram://app"
                  className="bg-pink-500 hover:bg-pink-400 text-white text-sm font-semibold py-2 px-4 rounded-full shadow"
                >
                  📷 Open Instagram
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
