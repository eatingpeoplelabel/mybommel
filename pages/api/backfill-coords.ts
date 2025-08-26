// pages/api/backfill-coords.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side ONLY
)

type Row = { id: number; postal_code: string | null; location: string | null }

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

async function geocode(postal: string, country: string, tries = 0): Promise<[number, number] | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&postalcode=${encodeURIComponent(postal)}&country=${encodeURIComponent(country)}`
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'mybommel.com backfill (contact: admin@mybommel.com)'
    }
  })

  // Retry bei Rate-Limit/Serverfehlern (max. 4 Versuche mit Backoff)
  if (!res.ok) {
    if ((res.status === 429 || res.status >= 500) && tries < 4) {
      const delay = 800 * Math.pow(1.8, tries) // 0.8s, 1.44s, 2.59s, 4.66s
      console.warn(`Nominatim ${res.status}, retry in ${Math.round(delay)}ms (${tries + 1}/4)`)
      await sleep(delay)
      return geocode(postal, country, tries + 1)
    }
    console.warn(`Geocode failed (${res.status}) for ${postal} ${country}`)
    return null
  }

  const data = (await res.json()) as Array<{ lat: string; lon: string }>
  if (!data?.[0]) return null
  const lat = parseFloat(data[0].lat)
  const lon = parseFloat(data[0].lon)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  // [lon, lat] -> so erwartet es react-simple-maps
  return [lon, lat]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  try {
    const limit = Number(req.query.limit ?? 100) // optional: ?limit=50
    const countryFallback = (req.query.country as string) || 'Germany' // falls location fehlt

    const { data, error } = await supabase
      .from('bommler')
      .select('id, postal_code, location')
      .is('coords', null)
      .limit(limit)

    if (error) throw error

    const rows = (data as Row[]).filter(r => r.postal_code)
    let processed = 0
    let updated = 0
    const skipped: number[] = []

    for (const r of rows) {
      processed += 1
      const country = (r.location || countryFallback).trim()
      const postal = r.postal_code!.trim()

      // Seriell + Throttle: freundlich zu Nominatim
      const coords = await geocode(postal, country)
      if (!coords) {
        skipped.push(r.id)
        await sleep(1200)
        continue
      }

      const { error: upErr } = await supabase
        .from('bommler')
        .update({ coords }) // speichert als JSON-Array [lon, lat]
        .eq('id', r.id)

      if (upErr) {
        console.warn('Update failed', r.id, upErr)
        skipped.push(r.id)
      } else {
        updated += 1
      }

      // mind. 1.2s Pause pro Request
      await sleep(1200)
    }

    return res.status(200).json({ totalQueried: rows.length, processed, updated, skipped })
  } catch (e: any) {
    console.error('❌ backfill error:', e)
    return res.status(500).json({ error: e.message ?? 'Unexpected error' })
  }
}
