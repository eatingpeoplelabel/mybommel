// components/GalleryMobile.tsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
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
  const [approved, setApproved] = useState<Bommel[]>([])
  const [pending, setPending] = useState<Bommel[]>([])
  const [selected, setSelected] = useState<Bommel | null>(null)

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
        const parts = item.image_path.split('/')
        const filename = parts[parts.length - 1]
        const { data: storageData } = supabase.storage.from('bommel-images').getPublicUrl(filename)
        const publicUrl = storageData.publicUrl
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
          status: item.status,
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

      <main className="min-h-screen bg-memphis bg-cover bg-center pt-4 px-4 pb-8">
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xs">
            <Image
              src="/bommel-register-header.png"
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

          <Link href="/map">
            <button className="mb-4 bg-white bg-opacity-80 text-purple-800 font-medium text-sm px-4 py-2 rounded-full shadow hover:bg-purple-100 transition">
              🌍 Open World Map
            </button>
          </Link>

          <Link href="/">
            <button className="mb-6 bg-purple-100 text-purple-800 font-medium text-sm px-6 py-2 rounded-full shadow hover:bg-purple-200 transition">
              ← Back to Home
            </button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
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
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-800">{b.name}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center">
          <Link href="/">
            <button className="bg-purple-100 text-purple-800 font-medium text-sm px-6 py-2 rounded-full shadow hover:bg-purple-200 transition">
              ← Back to Home
            </button>
          </Link>
        </footer>
      </main>
    </>
  )
}