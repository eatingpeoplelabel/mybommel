'use client'

import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Contact() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleBack = () => {
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>Contact – Grand Fluffdom of Bommlers</title>
        <meta name="description" content="Get in touch with Bommlers Worldwide. Contact Bebetta and the Bommel community for questions, bookings, and more." />
        <meta name="keywords" content="contact, bommel, pompom, bebett, festival, booking, community" />
        <meta property="og:title" content="Contact – Grand Fluffdom of Bommlers" />
        <meta property="og:description" content="Get in touch with Bommlers Worldwide. Contact Bebetta and the Bommel community for questions, bookings, and more." />
        <meta property="og:image" content="https://mybommel.com/og-contact.jpg" />
        <meta property="og:url" content="https://mybommel.com/contact" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://mybommel.com/contact" />
      </Head>

      <main className="relative min-h-screen bg-memphis bg-cover bg-center p-4 sm:p-8 flex flex-col items-center justify-center">

        {/* Mobile Hamburger Menu */}
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

        {/* Mobile Menu Drawer */}
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

        {/* Mobile Back Button */}
        {isMobile && (
          <button
            onClick={handleBack}
            className="mt-4 mb-6 px-4 py-2 bg-white bg-opacity-80 backdrop-blur-md rounded-xl text-lg font-semibold shadow-md z-40"
          >
            ⬅ Back to Home
          </button>
        )}

        {/* Desktop Back Button Image */}
        {!isMobile && (
          <button onClick={handleBack} className="fixed top-4 left-4 z-50">
            <Image
              src="/back-to-home.webp"
              alt="Back to Home"
              width={96}
              height={96}
              priority
              className="w-24 h-auto cursor-pointer"
            />
          </button>
        )}

        {/* Contact Box */}
        <div
          className={`bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg text-gray-800 z-20 w-full sm:w-[30%] ${
            isMobile ? 'max-w-md' : 'absolute top-[30%] left-[20%]'
          }`}
        >
          <h1 className="text-3xl font-extrabold text-center mb-4">Let’s Connect!</h1>
          <div className="text-lg space-y-2">
            <p><strong>Bebetta</strong></p>
            <p>Email: <a href="mailto:info@bebetta.de" className="text-pink-500 hover:underline">info@bebetta.de</a></p>
            <p>Instagram: <a href="https://www.instagram.com/bebetta_official" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">@bebetta_official</a></p>
            <p>Website Bebetta: <a href="https://bebetta.de/" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">bebetta.de</a></p>
            <p>Website Eating People: <a href="https://eatingpeople.de/" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">eatingpeople.de</a></p>
            <p>SoundCloud Bebetta: <a href="https://soundcloud.com/bebetta" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">/bebetta</a></p>
            <p>SoundCloud Eating People: <a href="https://soundcloud.com/eatingpeople" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">/eatingpeople</a></p>
          </div>
        </div>

        {/* Bebetta Image */}
        <div
          className={`z-10 ${
            isMobile
              ? 'absolute bottom-0 left-0 w-full h-[30vh] opacity-30'
              : 'fixed bottom-0 right-[-35%] w-[100%] h-[100%]'
          }`}
        >
          <Image
            src="/Connect.webp"
            alt="Bebetta connecting"
            layout="fill"
            objectFit="contain"
            priority
            sizes={isMobile ? '100vw' : '50vw'}
          />
        </div>
      </main>
    </>
  )
}
