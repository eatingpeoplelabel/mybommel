// pages/api/backfill-coords.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // nur serverseitig benutzen!
)

type Row = {
  id: number
  postal_code: string | null
  location: string | null
  coords: any
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

function isValidCoords(c: any): c is [number, number] {
  if (!c) return false
  // Array [lon, lat] mit zwei finite numbers
  if (Array.isArray(c) && c.length === 2) {
    const a = typeof c[0] === 'string' ? parseFloat(c[0]) : c[0]
    const b = typeof c[1] === 'string' ? parseFloat(c[1]) : c[1]
    return Number.isFinite(a) && Number.isFinite(b)
  }
  // manchmal als Objekt / String gespeichert → auch ungültig für uns
  return false
}

async function geocode(postal: string, country: string, tries = 0): Promise<[number, number] | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&postalcode=${encodeURIComponent(postal)}&country=${encodeURIComponent(country)}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'mybommel.com backfill (contact: admin@mybommel.com)' }
  })

  if (!res.ok) {
    if ((res.status === 429 || res.status >= 500) && tries < 4) {
      const delay = 800 * Math.pow(1.8, tries) // 0.8s, 1.44s, 2.59s, 4.66s
      await sleep(delay)
      return geocode(postal, country, tries + 1)
    }
    return null
  }

  const data = (await res.json()) as Array<{ lat: string; lon: string }>
  if (!data?.[0]) return null
  const lat = parseFloat(data[0].lat)
  const lon = parseFloat(data[0].lon)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  return [lon, lat] // [lon, lat] für react-simple-maps
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  try {
    const limit = Number(req.query.limit ?? 200)
    const countryFallback = (req.query.country as string) || 'Germany'

    // 1) Alle relevanten Felder holen (KEIN is('coords', null) mehr!)
    const { data, error } = await supabase
      .from('bommler')
      .select('id, postal_code, location, coords')
      .limit(limit)

    if (error) throw error
    const rows = (data || []) as Row[]

    // 2) Kandidaten bestimmen: coords fehlen oder sind ungültig
    const candidates = rows.filter(r => !isValidCoords(r.coords) && !!r.postal_code)

    // Stats für Response
    const total = rows.length
    const invalidBefore = candidates.length
    let processed = 0
    let updated = 0
    const skipped: number[] = []

    // 3) Seriell backfillen (Throttle & Retry inside geocode)
    for (const r of candidates) {
      processed += 1
      const postal = r.postal_code!.trim()
      const country = (r.location || countryFallback).trim()
      const coords = await geocode(postal, country)
      if (!coords) {
        skipped.push(r.id)
        await sleep(1200)
        continue
      }

      const { error: upErr } = await supabase
        .from('bommler')
        .update({ coords })
        .eq('id', r.id)

      if (upErr) {
        skipped.push(r.id)
      } else {
        updated += 1
      }

      await sleep(1200)
    }

    // 4) Noch ein paar Kennzahlen
    const validAfter = rows.filter(r => isValidCoords(r.coords)).length + updated

    return res.status(200).json({
      totalQueried: total,
      invalidBefore,
      processed,
      updated,
      skipped,
      estimatedValidAfter: validAfter
    })
  } catch (e: any) {
    return res.status(500).json({ error: e.message ?? 'Unexpected error' })
  }
}
