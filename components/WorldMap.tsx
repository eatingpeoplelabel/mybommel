// File: components/WorldMap.tsx
import React, { useEffect, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { supabase } from '../lib/supabaseClient'

const getRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`

const getOffset = (index: number): [number, number] => {
  const angle = (index * 45) * (Math.PI / 180)
  const distance = 0.3 // slight offset in degrees
  return [Math.cos(angle) * distance, Math.sin(angle) * distance]
}

// Hilfsfunktion: [lon, lat] zurückgeben oder null
function normalizeCoords(input: any): [number, number] | null {
  if (!input) return null

  // A) Array [a,b] (kann [lon,lat] oder [lat,lon] sein)
  if (Array.isArray(input) && input.length === 2) {
    const a = typeof input[0] === 'string' ? parseFloat(input[0]) : input[0]
    const b = typeof input[1] === 'string' ? parseFloat(input[1]) : input[1]
    if (Number.isFinite(a) && Number.isFinite(b)) {
      // Heuristik: wenn erstes wie lat (-90..90) aussieht und zweites > 90, drehen
      const looksLikeLatFirst = Math.abs(a) <= 90 && Math.abs(b) <= 180 && Math.abs(b) > 90
      return looksLikeLatFirst ? [b as number, a as number] : [a as number, b as number]
    }
  }

  // B) Objekt {lat,lng}/{latitude,longitude}/{lon,lat}/x,y
  if (typeof input === 'object') {
    const lat = input.lat ?? input.latitude ?? input.y ?? input.Lat ?? input.Latitude
    const lon = input.lon ?? input.lng ?? input.longitude ?? input.x ?? input.Lon ?? input.Longitude
    const latN = typeof lat === 'string' ? parseFloat(lat) : lat
    const lonN = typeof lon === 'string' ? parseFloat(lon) : lon
    if (Number.isFinite(latN) && Number.isFinite(lonN)) {
      return [lonN as number, latN as number]
    }
  }

  // C) String "lon,lat" oder "(lon,lat)"
  if (typeof input === 'string') {
    const cleaned = input.replace(/[()\[\]]/g, '').trim()
    const parts = cleaned.split(/[,; ]+/).map(v => parseFloat(v)).filter(Number.isFinite)
    if (parts.length >= 2) {
      const a = parts[0], b = parts[1]
      const looksLikeLatFirst = Math.abs(a) <= 90 && Math.abs(b) <= 180 && Math.abs(b) > 90
      return looksLikeLatFirst ? [b, a] : [a, b]
    }
  }

  return null
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

export default function WorldMap() {
  const [bommels, setBommels] = useState<Bommel[]>([])
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null)
  const [selectedBommel, setSelectedBommel] = useState<Bommel | null>(null)
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState<[number, number]>([0, 20])

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

      const dropped = (data?.length ?? 0) - mapped.length
      if (dropped > 0) {
        console.warn(`WorldMap: ${dropped} Einträge ohne verwertbare coords verworfen.`)
      }

      setBommels(mapped)

      if (mapped.length > 0) {
        setCenter(mapped[0].coords)
        setZoom(4)
      }
    }
    load()
  }, [])

  const handleZoomIn = () => setZoom(z => Math.min(z * 1.5, 8))
  const handleZoomOut = () => setZoom(z => Math.max(z / 1.5, 1))

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const loc = e.target.value
    if (loc) {
      const subset = bommels.filter(b => b.location === loc)
      if (subset.length) {
        setCenter(subset[0].coords)
        setZoom(4)
        setSelectedLoc(loc)
        return
      }
    }
    setCenter([0, 20]); setZoom(1); setSelectedLoc(null)
  }

  const handleMoveEnd = (position: { zoom: number }) => setZoom(position.zoom)

  // Group bommels by identical coordinate key
  const grouped = bommels.reduce((acc, b) => {
    const key = b.coords.join(',')
    acc[key] = acc[key] || []
    acc[key].push(b)
    return acc
  }, {} as Record<string, Bommel[]>)

  return (
    <div className="relative w-full h-full">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-50 flex flex-col space-y-2">
        <button onClick={handleZoomIn} className="w-8 h-8 bg-white bg-opacity-80 rounded-full shadow-md flex items-center justify-center hover:bg-opacity-100">+</button>
        <button onClick={handleZoomOut} className="w-8 h-8 bg-white bg-opacity-80 rounded-full shadow-md flex items-center justify-center hover:bg-opacity-100">–</button>
        <select onChange={handleSelect} className="mt-2 p-1 bg-white bg-opacity-80 rounded shadow-md">
          <option value="">Select Country</option>
          {[...new Set(bommels.map(b => b.location).filter(Boolean))].sort().map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <ComposableMap projectionConfig={{ scale: 160 }} className="w-full h-full">
        <ZoomableGroup center={center} zoom={zoom} onMoveEnd={handleMoveEnd}>
          <Geographies geography="/world-50m.json">
            {({ geographies }) => geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#F9F5FF"
                stroke="#D6BBFB"
                style={{ default: { outline: 'none' }, hover: { fill: '#E9D5FF' }, pressed: { outline: 'none' } }}
              />
            ))}
          </Geographies>

          {Object.entries(grouped).flatMap(([key, group]) =>
            group.map((b, j) => {
              const offset = getOffset(j)
              const coords: [number, number] = [b.coords[0] + offset[0], b.coords[1] + offset[1]]
              return (
                <Marker key={`${key}-${j}-${b.id}`} coordinates={coords}>
                  <g onClick={() => setSelectedBommel(b)} style={{ cursor: 'pointer' }}>
                    <circle r={Math.max(0.5, 4 / zoom)} fill={b.markerColor} />
                  </g>
                </Marker>
              )
            })
          )}
        </ZoomableGroup>
      </ComposableMap>

      {/* Info box by country */}
      {selectedLoc && (
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg border border-purple-200 max-w-xs w-full">
          <h3 className="text-lg font-bold text-purple-700 mb-2">{selectedLoc}</h3>
          <ul className="list-disc list-inside text-sm text-gray-800">
            {bommels.filter(b => b.location === selectedLoc).map(b => (
              <li key={b.id} className="cursor-pointer hover:underline" onClick={() => setSelectedBommel(b)}>
                {b.bommler_number} ({b.name})
              </li>
            ))}
          </ul>
          <button className="mt-2 text-xs text-purple-500 hover:underline" onClick={() => setSelectedLoc(null)}>Close</button>
        </div>
      )}

      {/* Modal for selected Bommel */}
      {selectedBommel && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl shadow-2xl max-w-sm w-full text-center space-y-3">
            <img
              src={supabase.storage.from('bommel-images').getPublicUrl(selectedBommel.image_path || '').data.publicUrl}
              alt={selectedBommel.name}
              className="rounded-full mx-auto w-32 h-32 object-cover"
            />
            <h2 className="text-xl font-bold text-gray-800">{selectedBommel.name}</h2>
            <p className="text-gray-700 text-sm">Registration No: <strong>{selectedBommel.bommler_number}</strong></p>
            {selectedBommel.fluff_level != null && <p className="text-gray-700 text-sm">Fluff Level: {selectedBommel.fluff_level}</p>}
            {selectedBommel.type && <p className="text-gray-700 text-sm">Type: {selectedBommel.type}</p>}
            {selectedBommel.birthday && <p className="text-gray-700 text-sm">Birthday: {selectedBommel.birthday}</p>}
            {selectedBommel.about && <p className="text-gray-700 text-sm">About: {selectedBommel.about}</p>}
            <p className="text-gray-700 text-sm">Location: {selectedBommel.location}</p>
            <button onClick={() => setSelectedBommel(null)} className="mt-3 px-5 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-full text-sm transition">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
