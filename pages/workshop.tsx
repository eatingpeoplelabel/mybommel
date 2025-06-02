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
        <meta name="description" content="Join our Pom-Pom Workshop and learn how to create your own magical Bommel. Perfect for festivals and fluffy fun!" />
        <meta name="keywords" content="bommel, pompom, workshop, craft, festival, fluff, diy, pom pom" />
        <meta property="og:title" content="Bommel Workshop – The Fluffy Retreat" />
        <meta property="og:description" content="Join our Pom-Pom Workshop and learn how to create your own magical Bommel. Perfect for festivals and fluffy fun!" />
        <meta property="og:image" content="https://mybommel.com/og-workshop.jpg" />
        <meta property="og:url" content="https://mybommel.com/workshop" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://mybommel.com/workshop" />
      </Head>

      <main className="relative min-h-screen bg-memphis bg-cover bg-center p-6 sm:p-8 flex flex-col items-center pb-24">

        {/* Hamburger Menu (Mobile only) */}
        {isMobile && (
          <button
            onClick={() => setShowMenu(prev => !prev)}
            className="absolute top-2 left-2 p-2 z-50 bg-pink-600 rounded-full shadow"
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
            <div className="w-3/4 max-w-xs h-full bg-pink-900 text-white shadow-2xl p-4 overflow-y-auto border-r-4 border-pink-400">
              <button onClick={() => setShowMenu(false)} aria-label="Close menu" className="mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <nav className="flex flex-col space-y-3 text-lg">
                <Link href="/" className="font-medium hover:text-pink-200">Home</Link>
                <Link href="/register" className="font-medium hover:text-pink-200">Register Your Bommel</Link>
                <Link href="/gallery" className="font-medium hover:text-pink-200">Bommel-Gallery</Link>
                <Link href="/workshop" className="font-medium hover:text-pink-200">Bommel Workshop</Link>
                <Link href="/how-to-bommel" className="font-medium hover:text-pink-200">How-To-Bommel</Link>
                <Link href="/zodiac" className="font-medium hover:text-pink-200">Bommel-Horoscope</Link>
                <Link href="/faq" className="font-medium hover:text-pink-200">FABQ</Link>
                <a href="https://bebetta.de/shop/" target="_blank" rel="noopener" className="font-medium hover:text-pink-200">Shop</a>
                <Link href="/contact" className="font-medium hover:text-pink-200">Contact</Link>
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

        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 mt-10 text-center text-white drop-shadow-md">
          Bommel Workshop – The Fluffy Retreat
        </h1>

        {isMobile && (
          <>
            <Link
              href="/"
              className="mb-4 px-4 py-2 bg-white bg-opacity-80 rounded-full text-sm text-purple-700 font-semibold shadow hover:bg-opacity-100 transition"
            >
              ⬅ Back to Home
            </Link>
            <a
              href="/ThePomPomRetreat.pdf"
              target="_blank"
              rel="noopener"
              className="mb-4 px-6 py-3 bg-yellow-300 text-purple-800 text-sm font-bold rounded-full shadow-lg hover:bg-yellow-400 transition"
            >
              👉 Tap here to view the Workshop PDF
            </a>
          </>
        )}

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

        {!isMobile && (
          <div className="bg-white bg-opacity-90 p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-5xl h-[70vh] sm:h-[80vh]">
            <iframe
              src="/ThePomPomRetreat.pdf#view=FitH&toolbar=1"
              className="w-full h-full"
              title="Bommel Workshop Guide"
            />
          </div>
        )}

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 w-full bg-pink-800 text-white text-sm py-2 flex justify-around items-center z-40">
          <Link href="/" className="hover:underline">Home</Link>
          <a href="https://soundcloud.com/bebetta" target="_blank" rel="noopener" className="hover:underline">SoundCloud</a>
          <a href="https://bebetta.de/" target="_blank" rel="noopener" className="hover:underline">Website</a>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </footer>
      </main>
    </>
  )
}
