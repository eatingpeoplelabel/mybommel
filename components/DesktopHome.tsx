// components/DesktopHome.tsx
import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function DesktopHome() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [count, setCount] = useState<number>(0)
  const [showGodModal, setShowGodModal] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [scale, setScale] = useState(1)
  const router = useRouter()
  const navRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    async function fetchCount() {
      const { count: totalCount, error } = await supabase
        .from('bommler')
        .select('*', { head: true, count: 'exact' })
      if (!error && totalCount !== null) setCount(totalCount)
    }
    fetchCount()
  }, [])

  useEffect(() => {
    const DESIGN_WIDTH = 1920
    const updateScale = () => {
      const w = window.innerWidth
      setScale(Math.min(1, w / DESIGN_WIDTH))
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <>
      <Head>
        <title>Grand Fluffdom of Bommlers</title>
        <meta name="description" content="Join the fluffiest community of bommlers!" />
      </Head>

      <div className="fixed inset-0 bg-memphis bg-cover bg-center overflow-hidden">
        <div
          className="relative"
          style={{
            width: 1920,
            height: 1080,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <main className="relative w-full h-full overflow-hidden flex-grow flex flex-col justify-end p-4">
            <div className="absolute top-4 left-4 z-50">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ width: 128, height: 128 }}
                aria-label="Toggle menu"
              >
                <Image src="/menu-button.webp" alt="Menu" width={128} height={128} className="object-contain" />
              </button>
              {menuOpen && (
                <nav
                  ref={navRef}
                  className="absolute top-0 left-[140px] z-50 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg p-4"
                >
                  <ul className="space-y-2 text-gray-800">
                    {[
                      ['/', 'Home'],
                      ['/register', 'Register Your Bommel'],
                      ['/gallery', 'Bommel‑Gallerie'],
                      ['/workshop', 'Bommel Workshop'],
                      ['/how-to-bommel', 'How‑To‑Bommel'],
                      ['/zodiac', 'Bommel‑Horoscope'],
                      ['/faq', 'FABQ'],
                      ['/contact', 'Contact']
                    ].map(([href, label]) => (
                      <li key={href}>
                        <Link href={href} legacyBehavior>
                          <a className="block px-4 py-2 hover:bg-pink-100 rounded-md transition">{label}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>

            <div className="absolute top-[1%] left-[19%] z-10">
              <Image
                src="/be-a-bommler.webp"
                alt="Be A Bommler"
                width={800}
                height={200}
                className="object-contain w-[36rem] drop-shadow-3xl"
              />
            </div>

            <Link href="/gallery" legacyBehavior>
              <a
                className="absolute z-10 flex flex-col items-center gap-0 cursor-pointer"
                style={{ top: '7%', left: '88%', transform: 'translate(-50%, 0)' }}
                aria-label="Zur Bommel‑Gallerie"
              >
                <svg width="240" height="132" viewBox="0 0 200 100">
                  <defs>
                    <path id="arcPath" d="M20,80 A80,80 0 0,1 180,80" fill="none" />
                  </defs>
                  <text dy="8" className="text-white text-lg font-bold">
                    <textPath href="#arcPath" startOffset="50%" textAnchor="middle">Registered Bommels</textPath>
                  </text>
                </svg>
                <div className="relative w-48 h-48 -mt-24">
                  <Image src="/A_high-resolution_digital_image_of_a_circular_pom-.webp" alt="Bommel Counter Frame" fill className="object-contain" />
                  <span className="absolute inset-0 flex items-center justify-center text-5xl font-extrabold text-purple-700">{count}</span>
                </div>
              </a>
            </Link>

            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <Image
                src="/Remove background project-3.webp"
                alt="Große Rote Bommel"
                width={1600}
                height={900}
                className="object-contain"
              />
            </div>

            <Link href="/register" legacyBehavior>
              <a className="absolute top-[50%] left-[65%] transform -translate-x-1/2 pointer-events-auto">
                <Image src="/Adobe Express - file(1).webp" alt="Register Your Bommel" width={300} height={300} className="object-contain" />
              </a>
            </Link>

            <a href="https://www.instagram.com/reel/C3IEXVvtB0_/?igsh=MWU4YXRudTE0cmZvcQ==" target="_blank" rel="noopener noreferrer" className="absolute bottom-80 left-20 bg-yellow-100 bg-opacity-80 backdrop-blur-sm rounded-lg p-6 shadow-lg z-30 pointer-events-auto block">
              <p className="text-2xl text-gray-800 font-medium">I am a Bommler!<br />Find out more here!</p>
            </a>

            <div className="absolute bottom-0 left-[8%] z-0 flex items-end pl-4 pointer-events-auto">
              <Image src="/Bebetta by Ina Peters 9.webp" alt="Ina Peters mit bunter Bommel" width={800} height={800} className="object-contain animate-wiggle-slow" />
            </div>

            <button onClick={() => setShowGodModal(true)} className="absolute bottom-[22vh] right-[13vw] z-20 w-72 h-72" aria-label="Enter Bommel God Realm">
              <Image src="/bommel-god-icon.webp" alt="Ask the Bommel God" width={280} height={280} className="w-full h-full animate-snitch drop-shadow-[0_0_25px_rgba(255,215,0,0.6)]" />
            </button>

            {showGodModal && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-2xl relative">
                  <h2 className="text-2xl font-bold mb-2">✨ Summon the Bommel God ✨</h2>
                  <p className="text-sm text-gray-600 italic mb-4">
                    🌟 A whisper from beyond the fluff...<br />
                    The ancient code to summon the deity lies hidden in plain yarn.
                  </p>
                  <input
                    type="password"
                    placeholder="Enter secret code"
                    className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                  />
                  {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
                  <div className="flex justify-center gap-4">
                    <button
                      className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
                      onClick={() => {
                        if (codeInput === 'bommelbommel') {
                          setShowGodModal(false)
                          router.push('/bommel-god')
                        } else {
                          setErrorMessage('Wrong code, humble fluffling.')
                        }
                      }}
                    >
                      Enter
                    </button>
                    <button
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                      onClick={() => setShowGodModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>

          <footer className="w-full bg-indigo-900 bg-opacity-80 text-gray-200 py-1">
            <div className="mx-auto max-w-5xl flex flex-row items-center justify-start text-lg">
              <p className="whitespace-nowrap pl-4">
                © 2025 Grand Fluffdom of Bommlers. All rights reserved.
              </p>
              <div className="flex flex-row flex-nowrap justify-center gap-4 ml-16">
                <Link href="https://soundcloud.com/bebetta" legacyBehavior>
                  <a className="hover:text-gray-100 whitespace-nowrap">SoundCloud</a>
                </Link>
                <Link href="https://bebetta.de/" legacyBehavior>
                  <a className="hover:text-gray-100 whitespace-nowrap">Website</a>
                </Link>
                <a href="https://www.instagram.com/bebetta_official" target="_blank" rel="noopener" className="hover:text-gray-100 whitespace-nowrap">
                  Instagram
                </a>
                <Link href="/contact" legacyBehavior>
                  <a className="hover:text-gray-100 whitespace-nowrap">Contact</a>
                </Link>
                <Link href="/legal" legacyBehavior>
                  <a className="hover:text-gray-100 whitespace-nowrap">Legal &amp; Fluffformation</a>
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}