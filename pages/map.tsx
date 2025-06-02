import React from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

// Dynamically import WorldMap for client-side only
const WorldMap = dynamic(() => import('../components/WorldMap'), { ssr: false })

export default function MapPage() {
  return (
    <>
      <Head>
        <title>🌍 Bommel World Map – Explore Global Bommels</title>
        <meta
          name="description"
          content="Discover where all Bommels live across Earth (and beyond)! Explore the interactive world map showing the global Bommel community."
        />
        <meta property="og:title" content="Bommel World Map – Explore Global Bommels" />
        <meta
          property="og:description"
          content="Discover where all Bommels live across Earth (and beyond)! Explore the interactive world map showing the global Bommel community."
        />
        <meta property="og:url" content="https://mybommel.com/map" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href="https://mybommel.com/map" />
      </Head>

      <main
        className="relative min-h-screen bg-register bg-cover bg-center pt-8 pb-8 px-4"
        role="main"
        aria-label="Bommel World Map page"
      >
        {/* Back to Home Icon Button */}
        <Link href="/" aria-label="Back to Home" className="absolute top-4 left-4 z-50">
          <Image
            src="/back-to-home.webp"
            alt="Back to Home"
            width={120}
            height={40}
            className="hover:opacity-80 transition"
          />
        </Link>

        {/* Header */}
        <header className="flex flex-col items-center mb-8 pt-16" role="banner">
          <Image
            src="/bommel-register-header.webp"
            alt="Bommel World Map Header"
            width={400}
            height={100}
            className="drop-shadow-md"
            priority
          />
          <p className="mt-2 text-center text-lg font-medium text-purple-700 bg-white/50 border border-purple-200 rounded-xl px-6 py-2 shadow-md backdrop-blur">
            Explore the Global Bommelution and the Bommels' locations on this world map!
          </p>

          {/* Back to Gallery Button */}
          <div className="mt-4">
            <Link href="/gallery" passHref>
              <button
                aria-label="Back to Gallery"
                className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-full shadow hover:bg-purple-700 transition"
              >
                🖼️ Back to Gallery
              </button>
            </Link>
          </div>
        </header>

        {/* Map Container */}
        <section
          className="w-full max-w-6xl mx-auto h-[600px] bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 overflow-hidden"
          aria-label="Interactive Bommel World Map"
        >
          <WorldMap />
        </section>
      </main>
    </>
  )
}
