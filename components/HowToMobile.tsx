'use client'

import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function HowToMobile() {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div
      className="relative min-h-screen bg-cover bg-center px-4 pt-8 pb-24 flex flex-col items-center"
      style={{ backgroundImage: "url('/how-to-bommel-bg.webp')" }}
    >
      <Head>
        <title>How to Bommel</title>
      </Head>

      {/* Hamburger Menu */}
      <button
        onClick={() => setShowMenu(prev => !prev)}
        className="absolute top-2 left-2 p-2 z-50 bg-purple-600 rounded-full shadow"
        aria-label="Toggle menu"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Menu Drawer */}
      {showMenu && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-3/4 max-w-xs h-full bg-lime-700 text-white shadow-2xl p-4 overflow-y-auto border-r-4 border-purple-400">
            <button onClick={() => setShowMenu(false)} aria-label="Close menu" className="mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="flex flex-col space-y-3 text-lg">
              <Link href="/" onClick={() => setShowMenu(false)} className="font-medium hover:text-lime-300">Home</Link>
              <Link href="/register" onClick={() => setShowMenu(false)} className="font-medium hover:text-lime-300">Register Your Bommel</Link>
              <Link href="/gallery" onClick={() => setShowMenu(false)} className="font-medium hover:text-lime-300">Bommel-Gallery</Link>
              <Link href="/workshop" onClick={() => setShowMenu(false)} className="font-medium hover:text-lime-300">Bommel Workshop</Link>
              <Link href="/how-to-bommel" onClick={() => setShowMenu(false)} className="font-medium hover:text-lime-300">How-To-Bommel</Link>
              <Link href="/zodiac" onClick={() => setShowMenu(false)} className="font-medium hover:text-lime-300">Bommel-Horoscope</Link>
              <Link href="/faq" onClick={() => setShowMenu(false)} className="font-medium hover:text-lime-300">FABQ</Link>
              <a href="https://bebetta.de/shop/" target="_blank" rel="noopener" className="font-medium hover:text-lime-300">Shop</a>
              <Link href="/contact" onClick={() => setShowMenu(false)} className="font-medium hover:text-lime-300">Contact</Link>
            </nav>
          </div>
          <div className="flex-1 bg-black bg-opacity-60" onClick={() => setShowMenu(false)} />
        </div>
      )}

      {/* Main content */}
      <img
        src="/header-how-to-bommel.webp"
        alt="How to Bommel Header"
        className="w-72 drop-shadow-lg mb-4"
      />

      <Link
        href="/"
        className="mb-6 bg-white text-blue-600 px-4 py-2 rounded-xl text-sm shadow-md"
      >
        ⬅ Back to Home
      </Link>

      <p className="text-center text-blue-400 font-semibold text-base mb-2">
        Watch my quick tutorial and make your very own Bommel today.
      </p>

      <div className="w-full aspect-video bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
        <span className="text-gray-500 italic text-sm">Video Placeholder (Coming Soon)</span>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-lime-600 text-white text-sm py-2 flex justify-around items-center z-40">
        <Link href="/" className="hover:underline">Home</Link>
        <a href="https://soundcloud.com/bebetta" target="_blank" rel="noopener" className="hover:underline">SoundCloud</a>
        <a href="https://bebetta.de/" target="_blank" rel="noopener" className="hover:underline">Website</a>
        <Link href="/contact" className="hover:underline">Contact</Link>
      </footer>
    </div>
  )
}
