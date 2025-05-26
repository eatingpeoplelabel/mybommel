// components/GalleryDesktop.tsx
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

export default function GalleryDesktop() {
  const [approved, setApproved] = useState<Bommel[]>([])
  const [pending, setPending] = useState<Bommel[]>([])
  const [selected, setSelected] = useState<Bommel | null>(null)

  const [filterType, setFilterType] = useState('')
  const [filterZodiac, setFilterZodiac] = useState('')
  const [filterFluff, setFilterFluff] = useState('')
  const [filterLocation, setFilterLocation] = useState('')

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
        const { data: storageData } = supabase.storage
          .from('bommel-images')
          .getPublicUrl(item.image_path)

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

  const filteredApproved = approved.filter(b =>
    (filterType === '' || b.type === filterType) &&
    (filterZodiac === '' || b.zodiac_sign === filterZodiac) &&
    (filterFluff === '' || b.fluff_level.toString() === filterFluff) &&
    (filterLocation === '' || b.location === filterLocation)
  )

  const uniqueTypes = Array.from(new Set(approved.map(b => b.type)))
  const uniqueZodiacs = Array.from(new Set(approved.map(b => b.zodiac_sign)))
  const uniqueFluffLevels = Array.from(new Set(approved.map(b => b.fluff_level))).sort((a, b) => a - b)
  const uniqueLocations = Array.from(new Set(approved.map(b => b.location))).filter(Boolean).sort()

  return (
    <>
      <Head>
        <title>Bommel-Register Gallery</title>
        <meta name="description" content="View all registered Bommels in the Grand Fluffdom" />
      </Head>

      <main className="min-h-screen bg-memphis bg-cover bg-center pt-1 px- pb-8 relative">
        <Link href="/map" className="absolute top-4 right-4 z-50 hidden sm:flex flex-col items-center animate-bounce">
          <Image
            src="/worldmap.webp"
            alt="World Map"
            width={150}
            height={150}
            className="drop-shadow-xl hover:scale-105 transition"
          />
          <p className="mt-1 text-xs text-purple-700 font-medium bg-white bg-opacity-70 px-2 py-0.5 rounded-md shadow">
            Bommel World Map
          </p>
        </Link>

        <Link href="/" className="fixed top-4 left-4 z-50">
          <img
            src="/back-to-home.webp"
            alt="Back to Home"
            className="w-[80px] h-[80px] drop-shadow-xl hover:scale-105 transition"
          />
        </Link>

        <div className="flex flex-col items-center">
          <div className="w-[80%] max-w-[600px]">
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
          <p className="mt-2 mb-2 px-4 py-1 text-center text-base font-medium text-purple-700 bg-white bg-opacity-50 border border-purple-200 rounded-xl shadow-md backdrop-blur">
            View all registered Bommels in the Grand Fluffdom
          </p>
        </div>

        {/* Filter Tool */}
        <div className="flex flex-wrap gap-6 justify-center items-center mb-8 bg-white bg-opacity-60 p-4 rounded-xl shadow">
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">Type:</label>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-1 rounded-md border border-purple-300 bg-white text-sm"
            >
              <option value="">All</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">Zodiac:</label>
            <select
              value={filterZodiac}
              onChange={e => setFilterZodiac(e.target.value)}
              className="px-3 py-1 rounded-md border border-purple-300 bg-white text-sm"
            >
              <option value="">All</option>
              {uniqueZodiacs.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">Fluff Level:</label>
            <select
              value={filterFluff}
              onChange={e => setFilterFluff(e.target.value)}
              className="px-3 py-1 rounded-md border border-purple-300 bg-white text-sm"
            >
              <option value="">All</option>
              {uniqueFluffLevels.map(level => (
                <option key={level} value={level.toString()}>{level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">Location:</label>
            <select
              value={filterLocation}
              onChange={e => setFilterLocation(e.target.value)}
              className="px-3 py-1 rounded-md border border-purple-300 bg-white text-sm"
            >
              <option value="">All</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Keine Ergebnisse Hinweis */}
        {filteredApproved.length === 0 && (
          <p className="text-center text-red-500 mt-8">
            ❌ No matching Bommels found. Try adjusting your filters!
          </p>
        )}

        {/* Approved Bommels Grid: Jetzt mit 5 Spalten */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
          {filteredApproved.map(b => (
            <div
              key={b.id}
              className="relative bg-white bg-opacity-80 rounded-xl p-4 shadow-lg cursor-pointer hover:scale-105 transition"
              onClick={() => setSelected(b)}
            >
              <p className="text-center text-sm font-medium text-purple-600 bg-white bg-opacity-50 rounded-full px-2 py-1 mb-2">
                #{b.bommler_number}
              </p>
              <div className="relative aspect-square overflow-hidden rounded-full w-full">
                <Image
                  src={b.image_url}
                  alt={b.name}
                  width={500}
                  height={500}
                  unoptimized
                  className="object-cover w-full h-full transition"
                />
              </div>
              <h2 className="mt-4 text-base font-semibold text-gray-800 text-center">{b.name}</h2>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto text-center space-y-4">
              <Image
                src={selected.image_url}
                alt={selected.name}
                width={300}
                height={300}
                unoptimized
                className="rounded-full mx-auto object-cover aspect-square"
              />
              <h2 className="text-2xl font-bold text-gray-800">{selected.name}</h2>
              <p className="text-gray-700">Registration No: <strong>{selected.bommler_number}</strong></p>
              <p className="text-gray-700">Fluff Level: {selected.fluff_level}</p>
              <p className="text-gray-700">Zodiac Sign: {selected.zodiac_sign}</p>
              <p className="text-gray-700">Type: {selected.type}</p>
              <p className="text-gray-700">Birthday: {selected.birthday}</p>
              {selected.about && <p className="text-gray-700">About: {selected.about}</p>}
              <p className="text-gray-700">Location: {selected.location}</p>
              <button
                onClick={() => setSelected(null)}
                className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-full transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
