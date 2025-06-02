'use client'

import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Workshop() {
  const [isMobile, setIsMobile] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <Head>
        <title>Bommel Workshop – The Fluffy Retreat</title>
        <meta name="description" content="Your Pom-Pom Workshop guide" />
      </Head>

      <main className="relative min-h-screen bg-memphis bg-cover bg-center p-6 sm:p-8 flex flex-col items-center">

        {/* Hamburger Menu (Mobile only) */}
        {isMobile && (
          <button
            onClick={() => setShowMenu(prev => !prev)}
            className="absolute top-2 left-2 p-2 z-50 bg-purple-600 rounded-full shadow"
            aria-label="Toggle menu"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Menu Drawer */}
        {isMobile && showMenu && (
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
                <a href="https://bebetta.de/shop/" target="_blank" rel="noopener" className="font-medium hover:text-purple-700">Shop</a>
                <Link href="/contact" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">Contact</Link>
              </nav>
            </div>
            <div className="flex-1 bg-black bg-opacity-50" onClick={() => setShowMenu(false)} />
          </div>
        )}

        {/* Desktop: Back Icon oben links */}
        {!isMobile && (
          <Link href="/" className="fixed top-4 left-4 z-50">
            <img
              src="/back-to-home.webp"
              alt="Back to Home"
              className="w-24 h-auto cursor-pointer"
            />
          </Link>
        )}

        {/* Mobile: Tap to View PDF Button (prominent, ganz oben) */}
        {isMobile && (
          <a
            href="/ThePomPomRetreat.pdf"
            target="_blank"
            rel="noopener"
            className="mb-4 px-6 py-3 bg-yellow-300 text-purple-800 text-sm font-bold rounded-full shadow-lg hover:bg-yellow-400 transition"
          >
            👉 Tap here to view the Workshop PDF
          </a>
        )}

        {/* Titel – mit mehr Abstand nach oben & Pastell-Verlauf */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 mt-8 text-center bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent drop-shadow">
          Bommel Workshop – The Fluffy Retreat
        </h1>

        {/* Mobile: Back Button unter Headline */}
        {isMobile && (
          <Link
            href="/"
            className="mb-4 px-4 py-2 bg-white bg-opacity-80 rounded-full text-sm text-purple-700 font-semibold shadow hover:bg-opacity-100 transition"
          >
            ⬅ Back to Home
          </Link>
        )}

        {/* Buttons */}
        <div className="mb-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="/ThePomPomRetreat.pdf"
            download
            className="px-6 py-3 bg-pink-500 hover:bg-pink-400 text-white rounded-full shadow-lg transition text-center"
          >
            📥 Download Workshop Guide (PDF)
          </a>
          <a
            href="mailto:info@bebetta.de?subject=I%20AM%20TOTALLY%20VERBOMMELT%20-%20Booking%20Request%20for%20Bommel%20workshop"
            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-lg transition text-center"
          >
            📩 Book us for your Event/Festival
          </a>
        </div>

        {/* PDF Section – only on desktop */}
        {!isMobile && (
          <div className="bg-white bg-opacity-90 p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-5xl h-[70vh] sm:h-[80vh]">
            <iframe
              src="/ThePomPomRetreat.pdf#view=FitH&toolbar=1"
              className="w-full h-full"
              title="Bommel Workshop Guide"
            />
          </div>
        )}
      </main>
    </>
  )
}
