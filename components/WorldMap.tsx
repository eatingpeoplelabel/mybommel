// File: components/WorldMap.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { supabase } from '../lib/supabaseClient'

/** ---- Types ---- */
export type WorldMapProps = {
  /** Bommel-ID (aus Query /map?focusId=123), auf die gezoomt werden soll */
  focusId?: string
}

type Bommel = {
  id: number
  name: string
  bommler_number: string
  location: string
  coords: [number, number] // [lon, lat]
  fluff_level?: number
  type?: string
  birthday?: string
  about?: string
  image_path?: string
  markerColor?: string
}

/** ---- Helpers ---- */
const getRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`

const getOffset = (index: number): [number, number] => {
  const angle = (index * 45) * (Math.PI / 180)
  const distance = 0.3 // slight offset in degrees
  return [Math.cos(angle) * distance, Math.sin(angle) * distance]
}

/** Normalisiert verschiedene Eingabeformate zu [lon, lat] oder null */
function normalizeCoords(input: unknown): [number, number] | null {
  if (!input) return null

  // A) Array [a,b]
  if (Array.isArray(input) && input.length === 2) {
    const a = typeof input[0] === 'string' ? parseFloat(input[0]) : (input[0] as number)
    const b = typeof input[1] === 'string' ? parseFloat(input[1]) : (input[1] as number)
    if (Number.isFinite(a) && Number.isFinite(b)) {
      const looksLikeLatFirst = Math.abs(a) <= 90 && Math.abs(b) <= 180 && Math.abs(b) > 90
      return looksLikeLatFirst ? [b, a] : [a, b]
    }
  }

  // B) Objekt
  if (typeof input === 'object' && input !== null) {
    const any = input as Record<string, unknown>
    const lat = any.lat ?? any.latitude ?? any.y ?? any.Lat ?? any.Latitude
    const lon = any.lon ?? any.lng ?? any.longitude ?? any.x ?? any.Lon ?? any.Longitude
    const latN = typeof lat === 'string' ? parseFloat(lat) : (lat as number)
    const lonN = typeof lon === 'string' ? parseFloat(lon) : (lon as number)
    if (Number.isFinite(latN) && Number.isFinite(lonN)) {
      return [lonN, latN]
    }
  }

  // C) String "lon,lat" / "(lon,lat)"
  if (typeof input === 'string') {
    const cleaned = input.replace(/[()\[\]]/g, '').trim()
    const parts = cleaned.split(/[,; ]+/).map(v => parseFloat(v)).filter(Number.isFinite)
    if (parts.length >= 2) {
      const [a, b] = parts
      const looksLikeLatFirst = Math.abs(a) <= 90 && Math.abs(b) <= 180 && Math.abs(b) > 90
      return looksLikeLatFirst ? [b, a] : [a, b]
    }
  }

  return null
}

/** Sichere Public-URL aus Supabase Storage (oder Fallback) */
function getPublicImageUrl(path?: string): string {
  if (!path) return '/fallback.webp'
  const { data } = supabase.storage.from('bommel-images').getPublicUrl(path)
  return data?.publicUrl || '/fallback.webp'
}

/** ---- Component ---- */
export default function WorldMap({ focusId }: WorldMapProps) {
  const [bommels, setBommels] = useState<Bommel[]>([])
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null)
  const [selectedBommel, setSelectedBommel] = useState<Bommel | null>(null)

  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState<[number, number]>([0, 20])

  /** Daten laden */
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('bommler')
        .select('id, name, bommler_number, location, coords, fluff_level, type, birthday, about, image_path')

      if (error) {
        console.error('Error loading Bommel data:', error)
        return
      }

      const mapped = (data as any[]).map(row => {
        const norm = normalizeCoords(row.coords)
        return norm
          ? ({
              id: row.id,
              name: row.name,
              bommler_number: row.bommler_number,
              location: row.location,
              coords: norm as [number, number], // [lon, lat]
              fluff_level: row.fluff_level,
              type: row.type,
              birthday: row.birthday,
              about: row.about,
              image_path: row.image_path,
              markerColor: getRandomColor(),
            } as Bommel)
          : null
      }).filter(Boolean) as Bommel[]

      // Hinweis, falls Koordinaten fehlen
      const dropped = (data?.length ?? 0) - mapped.length
      if (dropped > 0) {
        console.warn(`WorldMap: ${dropped} Einträge ohne verwertbare coords verworfen.`)
      }

      setBommels(mapped)

      // Default-Ansicht (falls kein Fokus)
      if (!focusId) {
        if (mapped.length > 0) {
          setCenter(mapped[0].coords)
          setZoom(4)
        } else {
          setCenter([0, 20])
          setZoom(1)
        }
      }
    }
    load()
    // nur initial laden
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Fokus aus Query anwenden, sobald Daten da sind */
  useEffect(() => {
    if (!focusId || bommels.length === 0) return
    const idNum = Number(focusId)
    const target = bommels.find(b => String(b.id) === String(focusId) || (Number.isFinite(idNum) && b.id === idNum))
    if (target) {
      setCenter(target.coords)
      setZoom(6)
      setSelectedLoc(target.location || null)
      setSelectedBommel(target)
    }
  }, [focusId, bommels])

  /** Gruppierung für Marker-Stapelung (gleiche Koordinate) */
  const grouped = useMemo(() => {
    return bommels.reduce((acc, b) => {
      const key = b.coords.join(',')
      acc[key] = acc[key] || []
      acc[key].push(b)
      return acc
    }, {} as Record<string, Bommel[]>)
  }, [bommels])

  /** Select-Options (Locations) */
  const locations = useMemo(
    () => [...new Set(bommels.map(b => b.location).filter(Boolean))].sort(),
    [bommels]
  )

  /** UI Handlers */
  const handleZoomIn = () => setZoom(z => Math.min(z * 1.5, 8))
  const handleZoomOut = () => setZoom(z => Math.max(z / 1.5, 1))
  const handleMoveEnd = (position: { zoom: number }) => setZoom(position.zoom)

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const loc = e.target.value
    if (loc) {
      const subset = bommels.filter(b => b.location === loc)
      if (subset.length) {
        setCenter(subset[0].coords)
        setZoom(4)
        setSelectedLoc(loc)
        setSelectedBommel(null)
        return
      }
    }
    setCenter([0, 20]); setZoom(1); setSelectedLoc(null); setSelectedBommel(null)
  }

  return (
    <div className="relative w-full h-full">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-50 flex flex-col space-y-2">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-white bg-opacity-80 rounded-full shadow-md flex items-center justify-center hover:bg-opacity-100"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-white bg-opacity-80 rounded-full shadow-md flex items-center justify-center hover:bg-opacity-100"
          aria-label="Zoom out"
        >
          –
        </button>
        <select
          onChange={handleSelect}
          className="mt-2 p-1 bg-white bg-opacity-80 rounded shadow-md text-sm"
          aria-label="Select country"
          value={selectedLoc || ''}
        >
          <option value="">All Countries</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Karte */}
      <ComposableMap projectionConfig={{ scale: 160 }} className="w-full h-full">
        <ZoomableGroup center={center} zoom={zoom} onMoveEnd={handleMoveEnd}>
          <Geographies geography="/world-50m.json">
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#F9F5FF"
                  stroke="#D6BBFB"
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#E9D5FF', outline: 'none' },
                    pressed: { outline: 'none' }
                  }}
                />
              ))
            }
          </Geographies>

          {/* Marker (mit kleinem Offset bei Duplikaten) */}
          {Object.entries(grouped).flatMap(([key, group]) =>
            group.map((b, j) => {
              const offset = getOffset(j)
              const coords: [number, number] = [b.coords[0] + offset[0], b.coords[1] + offset[1]]
              const isFocused = selectedBommel?.id === b.id || (focusId && String(b.id) === String(focusId))
              const radius = Math.max(0.5, 4 / zoom)

              return (
                <Marker key={`${key}-${j}-${b.id}`} coordinates={coords}>
                  <g onClick={() => setSelectedBommel(b)} style={{ cursor: 'pointer' }}>
                    {/* Highlight-Ring wenn fokussiert */}
                    {isFocused && (
                      <circle r={radius * 1.8} fill="none" stroke="#7C3AED" strokeWidth={2 / zoom} />
                    )}
                    <circle r={radius} fill={b.markerColor} />
                  </g>
                </Marker>
              )
            })
          )}
        </ZoomableGroup>
      </ComposableMap>

      {/* Info-Box (Location) */}
      {selectedLoc && (
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg border border-purple-200 max-w-xs w-full">
          <h3 className="text-lg font-bold text-purple-700 mb-2">{selectedLoc}</h3>
          <ul className="list-disc list-inside text-sm text-gray-800 max-h-56 overflow-y-auto">
            {bommels.filter(b => b.location === selectedLoc).map(b => (
              <li
                key={b.id}
                className="cursor-pointer hover:underline"
                onClick={() => {
                  setSelectedBommel(b)
                  setCenter(b.coords)
                  setZoom(6)
                }}
              >
                #{b.bommler_number} — {b.name}
              </li>
            ))}
          </ul>
          <button
            className="mt-2 text-xs text-purple-600 hover:underline"
            onClick={() => setSelectedLoc(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* Modal (Bommel) */}
      {selectedBommel && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl shadow-2xl max-w-sm w-full text-center space-y-3">
            <img
              src={getPublicImageUrl(selectedBommel.image_path)}
              alt={selectedBommel.name}
              className="rounded-full mx-auto w-32 h-32 object-cover"
              loading="lazy"
            />
            <h2 className="text-xl font-bold text-gray-800">{selectedBommel.name}</h2>
            <p className="text-gray-700 text-sm">
              Registration No: <strong>{selectedBommel.bommler_number}</strong>
            </p>
            {selectedBommel.fluff_level != null && (
              <p className="text-gray-700 text-sm">Fluff Level: {selectedBommel.fluff_level}</p>
            )}
            {selectedBommel.type && <p className="text-gray-700 text-sm">Type: {selectedBommel.type}</p>}
            {selectedBommel.birthday && <p className="text-gray-700 text-sm">Birthday: {selectedBommel.birthday}</p>}
            {selectedBommel.about && <p className="text-gray-700 text-sm">About: {selectedBommel.about}</p>}
            <p className="text-gray-700 text-sm">Location: {selectedBommel.location}</p>

            <div className="mt-2 flex items-center justify-center gap-2">
              <a
                href={`/gallery?focusId=${selectedBommel.id}`}
                className="px-4 py-2 rounded-full bg-white border border-purple-300 text-purple-700 text-sm hover:bg-purple-50"
              >
                ← Back to Gallery
              </a>
              <button
                onClick={() => setSelectedBommel(null)}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-sm transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
