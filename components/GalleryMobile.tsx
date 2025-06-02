'use client'

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { getBommelZodiacEn } from '../lib/zodiac-en'

type Bommel = {
  id: number
  name: string
  bommler_number: string
  fluff_level: number
  type: string
  birthday: string
  zodiac_sign: string
  image_url: string
  about?: string
  location: string
  status: string
}

export default function GalleryMobile() {
  const router = useRouter()
  const [approved, setApproved] = useState<Bommel[]>([])
  const [pending, setPending] = useState<Bommel[]>([])
  const [selected, setSelected] = useState<Bommel | null>(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    async function fetchBommels() {
      const { data, error } = await supabase
        .from('bommler')
        .select('id, name, bommler_number, fluff_level, type, birthday, image_path, about, location, status')

      if (error || !data) {
        console.error('Error loading bommels:', error)
        return
      }

      const items: Bommel[] = data.map(item => {
        const { data: storageData } = supabase.storage.from('bommel-images').getPublicUrl(item.image_path)
        const publicUrl = storageData?.publicUrl || '/fallback.webp'
        const zodiac_sign = getBommelZodiacEn(new Date(item.birthday)).name

        return {
          id: item.id,
          name: item.name,
          bommler_number: item.bommler_number,
          fluff_level: item.fluff_level,
          zodiac_sign,
          type: item.type,
          birthday: item.birthday,
          image_url: publicUrl,
          about: item.about || '',
          location: item.location,
          status: item.status?.toLowerCase() || '',
        }
      })

      const approvedList = items
        .filter(b => b.status === 'approved')
        .sort((a, b) => parseInt(a.bommler_number) - parseInt(b.bommler_number))

      const pendingList = items
        .filter(b => b.status !== 'approved')
        .sort((a, b) => parseInt(a.bommler_number) - parseInt(b.bommler_number))

      setApproved(approvedList)
      setPending(pendingList)
    }

    fetchBommels()
  }, [])

  return (
    <>
      <Head>
        <title>Bommel-Register Gallery</title>
        <meta name="description" content="View all registered Bommels in the Grand Fluffdom" />
      </Head>

      <main className="relative flex flex-col items-center p-4 space-y-6 bg-memphis bg-cover min-h-screen">

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

        {/* Header */}
        <div className="w-full max-w-xs">
          <Image
            src="/bommel-register-header.webp"
            alt="Bommel Register"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto drop-shadow-md"
            priority
          />
        </div>

        <p className="mt-2 mb-4 px-4 py-1 text-center text-sm font-medium text-purple-700 bg-white bg-opacity-50 border border-purple-200 rounded-xl shadow-md backdrop-blur">
          View all registered Bommels in the Grand Fluffdom
        </p>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {approved.map(b => (
            <div
              key={b.id}
              className="bg-white bg-opacity-80 rounded-xl p-2 shadow hover:scale-105 transition text-center"
              onClick={() => setSelected(b)}
            >
              <p className="text-xs font-medium text-purple-600 bg-white bg-opacity-50 rounded-full px-2 py-1 mb-2">
                #{b.bommler_number}
              </p>
              <div className="aspect-square overflow-hidden rounded-full w-full">
                <Image
                  src={b.image_url}
                  alt={b.name}
                  width={200}
                  height={200}
                  loading="lazy"
                  unoptimized
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-800">{b.name}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Mobile Footer */}
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
    </>
  )
}
