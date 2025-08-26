'use client'

import React, { useState, useEffect, useMemo } from 'react'
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
  const [showMenu, setShowMenu] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

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

      const items: Bommel[] = data.map((item: any) => {
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
          status: (item.status || '').toLowerCase(),
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

  const uniqueTypes = useMemo(() => Array.from(new Set(approved.map(b => b.type))).filter(Boolean).sort(), [approved])
  const uniqueZodiacs = useMemo(() => Array.from(new Set(approved.map(b => b.zodiac_sign))).filter(Boolean).sort(), [approved])
  const uniqueFluffLevels = useMemo(
    () => Array.from(new Set(approved.map(b => b.fluff_level))).filter(v => v !== undefined && v !== null).sort((a, b) => a - b),
    [approved]
  )
  const uniqueLocations = useMemo(
    () => Array.from(new Set(approved.map(b => b.location))).filter(Boolean).sort(),
    [approved]
  )

  const filteredApproved = useMemo(
    () =>
      approved.filter(b =>
        (filterType === '' || b.type === filterType) &&
        (filterZodiac === '' || b.zodiac_sign === filterZodiac) &&
        (filterFluff === '' || b.fluff_level.toString() === filterFluff) &&
        (filterLocation === '' || b.location === filterLocation)
      ),
    [approved, filterType, filterZodiac, filterFluff, filterLocation]
  )

  const hasActiveFilter = filterType || filterZodiac || filterFluff || filterLocation
  const resetFilters = () => {
    setFilterType('')
    setFilterZodiac('')
    setFilterFluff('')
    setFilterLocation('')
  }

  return (
    <>
      <Head>
        <title>Bommel-Register Gallery</title>
        <meta name="description" content="View and filter all registered Bommels in the Grand Fluffdom" />
      </Head>

      <main className="relative flex flex-col items-center p-4 pb-24 space-y-4 bg-memphis bg-cover min-h-screen">
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

        {/* Map Quick-Link (Top Right) → /map */}
        <Link
          href="/map"
          className="absolute top-2 right-2 p-2 z-50 bg-white/90 rounded-full shadow hover:bg-white"
          aria-label="Open map"
        >
          <svg className="w-7 h-7 text-purple-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
            <path d="M2.05 12h19.9M12 2.05a15.1 15.1 0 0 1 0 19.9M12 2.05a15.1 15.1 0 0 0 0 19.9" />
          </svg>
        </Link>

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
                <Link href="/map" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">Worldmap</Link>
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
        <div className="w-full max-w-xs mt-8">
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

        {/* Filter Toggle / Pills */}
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="px-3 py-1 text-xs font-medium text-purple-700 bg-white/60 border border-purple-200 rounded-xl shadow-md backdrop-blur">
              View all registered Bommels in the Grand Fluffdom
            </p>
            <button
              onClick={() => setShowFilters(v => !v)}
              className="px-3 py-2 text-sm rounded-xl bg-white shadow border border-purple-200"
              aria-expanded={showFilters}
              aria-controls="filters"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          { (filterType || filterZodiac || filterFluff || filterLocation) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {filterType && <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">{filterType}</span>}
              {filterZodiac && <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">{filterZodiac}</span>}
              {filterFluff && <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">Fluff {filterFluff}</span>}
              {filterLocation && <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">{filterLocation}</span>}
              <button
                onClick={resetFilters}
                className="ml-auto px-2 py-1 text-xs bg-white border border-purple-200 rounded-full shadow hover:bg-purple-50"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Filters Sheet */}
        {showFilters && (
          <div id="filters" className="w-full max-w-sm bg-white/80 border border-purple-200 rounded-xl shadow p-3 space-y-3">
            <div>
              <label className="block text-xs font-medium text-purple-700 mb-1">Type</label>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-purple-300 bg-white text-sm"
              >
                <option value="">All</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-purple-700 mb-1">Zodiac</label>
                <select
                  value={filterZodiac}
                  onChange={e => setFilterZodiac(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-purple-300 bg-white text-sm"
                >
                  <option value="">All</option>
                  {uniqueZodiacs.map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-purple-700 mb-1">Fluff Level</label>
                <select
                  value={filterFluff}
                  onChange={e => setFilterFluff(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-purple-300 bg-white text-sm"
                >
                  <option value="">All</option>
                  {uniqueFluffLevels.map(level => (
                    <option key={level} value={String(level)}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-purple-700 mb-1">Location</label>
                <select
                  value={filterLocation}
                  onChange={e => setFilterLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-purple-300 bg-white text-sm"
                >
                  <option value="">All</option>
                  {uniqueLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 px-3 py-2 rounded-md bg-purple-600 text-white text-sm shadow hover:bg-purple-500"
              >
                Apply
              </button>
              <button
                onClick={resetFilters}
                className="px-3 py-2 rounded-md bg-white border border-purple-300 text-sm hover:bg-purple-50"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Keine Ergebnisse */}
        {filteredApproved.length === 0 && (
          <p className="text-center text-red-500 mt-4">❌ No matching Bommels found. Try adjusting your filters!</p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {filteredApproved.map(b => (
            <div
              key={b.id}
              className="bg-white/80 rounded-xl p-2 shadow hover:scale-105 transition text-center cursor-pointer"
              onClick={() => setSelected(b)}
            >
              <p className="text-xs font-medium text-purple-600 bg-white/60 rounded-full px-2 py-1 mb-2">
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
              <p className="text-[11px] text-gray-500">{b.type} • {b.zodiac_sign} • Fluff {b.fluff_level}</p>
              {b.location && <p className="text-[11px] text-gray-500">{b.location}</p>}
            </div>
          ))}
        </div>
      </main>

      {/* Details Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] px-4"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.image_url}
              alt={selected.name}
              className="rounded-full mx-auto object-cover aspect-square w-60 h-60"
              loading="lazy"
            />
            <h2 className="text-2xl font-bold text-gray-800">{selected.name}</h2>
            <p className="text-gray-700">Registration No: <strong>{selected.bommler_number}</strong></p>
            <p className="text-gray-700">Fluff Level: {selected.fluff_level}</p>
            <p className="text-gray-700">Zodiac Sign: {selected.zodiac_sign}</p>
            <p className="text-gray-700">Type: {selected.type}</p>
            <p className="text-gray-700">Birthday: {selected.birthday}</p>
            {selected.about && <p className="text-gray-700">About: {selected.about}</p>}
            <p className="text-gray-700">Location: {selected.location}</p>

            <Link
              href={`/map?focusId=${encodeURIComponent(String(selected.id))}`}
              className="mt-2 inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition"
            >
              View on Worldmap
            </Link>

            <button
              onClick={() => setSelected(null)}
              className="mt-2 px-6 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-full transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <nav className="fixed bottom-0 left-0 w-full bg-indigo-900 py-2 flex justify-around items-center text-white text-sm space-x-4 z-40">
        <button onClick={() => setShowMenu(prev => !prev)} className="p-2" aria-label="Toggle menu">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <a href="https://soundcloud.com/bebetta" target="_blank" rel="noopener" className="flex-1 text-center">SoundCloud</a>
        <a href="https://bebetta.de/" target="_blank" rel="noopener" className="flex-1 text-center">Website</a>
        <Link href="/contact" className="flex-1 text-center">Contact</Link>
        <Link href="/map" className="flex-1 flex flex-col items-center justify-center gap-0.5">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
            <path d="M2.05 12h19.9M12 2.05a15.1 15.1 0 0 1 0 19.9M12 2.05a15.1 15.1 0 0 0 0 19.9" />
          </svg>
          <span className="text-xs">Worldmap</span>
        </Link>
      </nav>
    </>
  )
}
