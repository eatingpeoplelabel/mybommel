// components/MobileHome.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function MobileHome() {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [showGodModal, setShowGodModal] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    async function fetchCount() {
      const { count: totalCount, error } = await supabase
        .from('bommler')
        .select('*', { head: true, count: 'exact' })
      if (!error && totalCount !== null) {
        setCount(totalCount)
      }
    }
    fetchCount()
  }, [])

  return (
    <main className="relative flex flex-col items-center p-4 space-y-6 bg-memphis bg-cover min-h-screen">

      {/* Hamburger Menu */}
      <button
        onClick={() => setShowMenu(prev => !prev)}
        className="absolute top-2 left-2 p-2 z-50"
        aria-label="Toggle menu"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Menu Drawer */}
      {showMenu && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-3/4 max-w-xs h-full bg-white shadow-2xl p-4 overflow-y-auto border-r-4 border-purple-200">
            <button onClick={() => setShowMenu(false)} aria-label="Close menu" className="mb-4">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="flex flex-col space-y-3 text-lg">
              <Link href="/" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">Home</Link>
              <Link href="/register" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">Register Your Bommel</Link>
              <Link href="/gallery" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">Bommel-Gallery</Link>
              <Link href="/workshop" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">Bommel Workshop</Link>
              <Link href="/how-to-bommel" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">How-To-Bommel</Link>
              <Link href="/zodiac" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">Bommel-Horoscope</Link>
              <Link href="/faq" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">FABQ</Link>
              <Link href="/contact" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">Contact</Link>
            </nav>
          </div>
          <div className="flex-1 bg-black bg-opacity-50" onClick={() => setShowMenu(false)} />
        </div>
      )}

      {/* Logo */}
      <div className="mt-4 mb-2 w-full flex justify-center">
        <Image src="/be-a-bommler.png" alt="Be A Bommler" width={320} height={80} className="object-contain" />
      </div>

      {/* Main Buttons */}
      <div className="w-full flex flex-col items-center space-y-4">
        <button onClick={() => router.push('/register')} className="w-full py-4 bg-purple-700 text-white text-lg font-bold rounded-2xl shadow-lg border-2 border-white">
          Register Your Bommel
        </button>

        <button onClick={() => router.push('/gallery')} className="w-full py-4 bg-pink-500 text-white text-lg font-bold rounded-2xl shadow-lg border-2 border-white">
          Bommel-Gallery
        </button>

        <button onClick={() => router.push("https://www.instagram.com/reel/C3IEXVvtB0_/?igsh=MWU4YXRudTE0cmZvcQ==")} className="w-full py-4 bg-yellow-400 text-white text-lg font-bold rounded-2xl shadow-lg border-2 border-white">
          I am a Bommler - Find Out More
        </button>

        {/* Bommel God Icon */}
        <button onClick={() => setShowGodModal(true)} className="w-32 h-32 mt-2 relative" aria-label="Enter Bommel God Realm">
          <Image src="/bommel-god-icon.png" alt="Ask the Bommel God" fill className="object-contain" />
        </button>

        {/* Registered count */}
        <div className="mt-2 bg-purple-700 bg-opacity-80 px-4 py-2 rounded-full shadow inner-glow text-white font-bold">
          Registered Bommels: {count}
        </div>
      </div>

      {/* Holy Code Modal */}
      {showGodModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border-4 border-purple-200 text-center">
            <h2 className="text-2xl font-bold text-purple-700 mb-2">🌀 The Portal Awaits...</h2>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              So, mortal...<br />
              You seek audience with the <span className="font-semibold">Bommel God</span>?<br />
              Only those who have <span className="text-pink-500 font-semibold underline underline-offset-2">registered their first sacred Bommel</span> may pass.<br />
              Enter your <span className="underline">Holy Code</span> and prove your fluff-worthiness.
            </p>
            <input
              type="text"
              placeholder="Enter Holy Code"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="w-full px-4 py-2 rounded-full border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center mb-2"
            />
            {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
            <div className="flex justify-center gap-4 mt-2">
              <button
                onClick={() => {
                  if (codeInput.trim().toLowerCase() === 'bommelbommel') {
                    setShowGodModal(false)
                    router.push('/bommel-god') // <- updated path
                  } else {
                    setErrorMessage('🚫 The gods are displeased. Try again.')
                  }
                }}
                className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-6 rounded-full shadow-md transition"
              >
                Enter the Realm
              </button>
              <button
                onClick={() => setShowGodModal(false)}
                className="text-sm text-gray-500 underline hover:text-gray-700"
              >
                Flee in Fear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Footer */}
      <nav className="fixed bottom-0 left-0 w-full bg-indigo-900 py-2 flex justify-around items-center text-white text-sm space-x-4">
        <button onClick={() => setShowMenu(prev => !prev)} className="p-2" aria-label="Toggle menu">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <a href="https://soundcloud.com/bebetta_official" target="_blank" rel="noopener" className="flex-1 text-center">SoundCloud</a>
        <a href="https://bebetta.de/" target="_blank" rel="noopener" className="flex-1 text-center">Website</a>
        <Link href="/contact" className="flex-1 text-center">Contact</Link>
      </nav>
    </main>
  )
}
