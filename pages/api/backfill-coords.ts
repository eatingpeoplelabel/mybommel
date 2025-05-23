import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Geocoding helper
async function geocode(postal: string, country: string): Promise<[number, number] | null> {
  const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postal)}&country=${encodeURIComponent(country)}&format=json&limit=1`
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (data && data[0]) {
      return [parseFloat(data[0].lon), parseFloat(data[0].lat)]
    }
  } catch (e) {
    console.error('Geocoding error:', e)
  }
  return null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { data: bommels, error } = await supabase
      .from('bommler')
      .select('id, postal_code, location')
      .is('coords', null)

    if (error) throw error

    const updates = []
    for (const b of bommels) {
      if (!b.postal_code || !b.location) continue
      const coords = await geocode(b.postal_code, b.location)
      if (!coords) continue

      updates.push(
        supabase
          .from('bommler')
          .update({ coords })
          .eq('id', b.id)
      )
    }

    await Promise.all(updates)

    return res.status(200).json({ message: `Updated ${updates.length} bommels with coordinates.` })
  } catch (err: any) {
    console.error('❌ Geocode backfill error:', err)
    return res.status(500).json({ error: err.message ?? 'Unexpected error' })
  }
}
