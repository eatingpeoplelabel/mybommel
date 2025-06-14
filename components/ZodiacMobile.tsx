'use client'

import { useState } from 'react'
import { BOMMEL_ZODIAC_EN, getBommelZodiacEn } from '@/lib/zodiac-en'
import Image from 'next/image'
import Link from 'next/link'

type ZodiacSign = typeof BOMMEL_ZODIAC_EN[0]

export default function ZodiacMobile() {
  const [birthday, setBirthday] = useState<string>('')
  const [result, setResult] = useState<ZodiacSign | null>(null)
  const [showMenu, setShowMenu] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const date = new Date(birthday)
    if (!isNaN(date.getTime())) {
      const zodiac = getBommelZodiacEn(date)
      setResult(zodiac)
    }
  }

  const handleReset = () => {
    setBirthday('')
    setResult(null)
  }

  return (
    <main className="relative min-h-screen bg-zodiac bg-cover bg-center p-6 flex flex-col items-center text-white text-center">

      {/* Hamburger Button */}
      <button
        onClick={() => setShowMenu(prev => !prev)}
        className="absolute top-2 left-2 p-2 z-50 bg-purple-700 rounded-full shadow"
        aria-label="Toggle menu"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Menu Drawer (dark + mystic) */}
      {showMenu && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-3/4 max-w-xs h-full bg-indigo-900 shadow-2xl p-4 overflow-y-auto border-r-4 border-purple-400 text-white">
            <button onClick={() => setShowMenu(false)} aria-label="Close menu" className="mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="flex flex-col space-y-3 text-lg">
              <Link href="/" className="font-medium hover:text-purple-300">Home</Link>
              <Link href="/register" className="font-medium hover:text-purple-300">Register Your Bommel</Link>
              <Link href="/gallery" className="font-medium hover:text-purple-300">Bommel-Gallery</Link>
              <Link href="/workshop" className="font-medium hover:text-purple-300">Bommel Workshop</Link>
              <Link href="/how-to-bommel" className="font-medium hover:text-purple-300">How-To-Bommel</Link>
              <Link href="/zodiac" className="font-medium hover:text-purple-300">Bommel-Horoscope</Link>
              <Link href="/faq" className="font-medium hover:text-purple-300">FABQ</Link>
              <a href="https://bebetta.de/shop/" target="_blank" rel="noopener" className="font-medium hover:text-purple-300">Shop</a>
              <Link href="/contact" className="font-medium hover:text-purple-300">Contact</Link>
            </nav>
          </div>
          <div className="flex-1 bg-black bg-opacity-60" onClick={() => setShowMenu(false)} />
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold mt-10 mb-4 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
        🔮 Bommel Horoscope
      </h1>

      {/* Back Home Button */}
      <Link href="/">
        <button className="mb-6 px-4 py-2 bg-white/20 rounded-full border border-white/30 text-sm hover:bg-white/30">
          ← Back to Home
        </button>
      </Link>

      {/* Input */}
      {!result && (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <p className="mb-4 text-sm text-white/80">
            Enter your birthday and discover your mystical Bommel sign…
          </p>
          <input
            type="date"
            required
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-full text-black border border-white/30 shadow-inner"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-full bg-white/10 backdrop-blur border border-white/30 hover:bg-white/20 transition"
          >
            Reveal my Bommel Sign ✨
          </button>
        </form>
      )}

      {/* Result */}
      {result && (
        <div className="mt-8 bg-white/10 p-6 rounded-2xl border border-white/30 backdrop-blur w-full max-w-xs text-white animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">{result.name}</h2>
          <div className="mb-4 italic text-white/80">{result.element}</div>
          <Image
            src={`/zodiac/thumbs/${result.image
              .replace(/\.(png|jpe?g)/i, '')
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '')}.webp`}
            alt={result.name}
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <p className="text-sm px-2 leading-snug mb-4">
            {result.description}
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm rounded-full bg-white/10 border border-white/30 hover:bg-white/20 transition"
          >
            Try another birthday
          </button>
        </div>
      )}

      {/* Footer */}
      <nav className="fixed bottom-0 left-0 w-full bg-indigo-900 py-2 flex justify-around items-center text-white text-sm space-x-4 z-40">
        <button onClick={() => setShowMenu(prev => !prev)} className="p-2" aria-label="Toggle menu">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <a href="https://soundcloud.com/bebetta" target="_blank" rel="noopener" className="flex-1 text-center">SoundCloud</a>
        <a href="https://bebetta.de/" target="_blank" rel="noopener" className="flex-1 text-center">Website</a>
        <Link href="/contact" className="flex-1 text-center">Contact</Link>
      </nav>
    </main>
  )
}
