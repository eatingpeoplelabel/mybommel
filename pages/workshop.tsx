import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Workshop() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
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

        {/* Desktop: Icon oben links */}
        {!isMobile && (
          <Link href="/" className="fixed top-4 left-4 z-50">
            <img
              src="/back-to-home.png"
              alt="Back to Home"
              className="w-24 h-auto cursor-pointer"
            />
          </Link>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow text-center">
          Bommel Workshop – The Fluffy Retreat
        </h1>

        {/* Mobile: Back to Home Button unter Headline */}
        {isMobile && (
          <Link
            href="/"
            className="mb-4 px-4 py-2 bg-white bg-opacity-80 rounded-full text-sm text-purple-700 font-semibold shadow hover:bg-opacity-100 transition"
          >
            ⬅ Back to Home
          </Link>
        )}

        {/* Download and Booking Buttons */}
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

        {/* Embedded PDF */}
        <div className="bg-white bg-opacity-90 p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-5xl h-[70vh] sm:h-[80vh]">
          <iframe
            src="/ThePomPomRetreat.pdf#view=FitH&toolbar=1"
            className="w-full h-full"
            title="Bommel Workshop Guide"
          />
        </div>
      </main>
    </>
  )
}
