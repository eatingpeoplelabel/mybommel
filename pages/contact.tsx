import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Contact() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

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
        <meta name="description" content="Get in touch with Bommlers Worldwide" />
      </Head>

      <main className="relative min-h-screen bg-memphis bg-cover bg-center p-4 sm:p-8 flex flex-col items-center justify-center">

        {/* Mobile Back Button */}
        {isMobile && (
          <button
            onClick={handleBack}
            className="mt-4 mb-6 px-4 py-2 bg-white bg-opacity-80 backdrop-blur-md rounded-xl text-lg font-semibold shadow-md z-50"
          >
            ⬅ Back to Home
          </button>
        )}

        {/* Desktop Back Button Image */}
        {!isMobile && (
          <button onClick={handleBack} className="fixed top-4 left-4 z-50">
            <Image
              src="/back-to-home.png"
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
            src="/Connect.png"
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
