// pages/api/share-image.ts
import { Resvg } from '@resvg/resvg-js'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import { getBommelZodiacEn } from '@/lib/zodiac-en'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req, res) {
  console.log("[share-image] aufgerufen mit query:", req.query)

  try {
    const { id, debug } = req.query as { id?: string; debug?: string }
    if (!id) {
      console.error("[share-image] Fehlende ID")
      return res.status(400).send('Missing Bommel ID')
    }
    console.log("[share-image] ID:", id)

    const { data: bommel, error } = await supabase
      .from('bommler')
      .select('*')
      .eq('id', parseInt(id, 10))
      .single()

    if (error || !bommel) {
      console.error("[share-image] Bommel nicht gefunden für ID:", id, "Error:", error)
      return res.status(404).send('Bommel not found')
    }
    console.log("[share-image] Bommel-Daten:", bommel)

    const bgPath = path.join(process.cwd(), 'public/quartett-bg.webp')
    let bgBuf: Buffer
    try {
      const rawWebp = await fs.readFile(bgPath)
      bgBuf = await sharp(rawWebp).resize(1080, 1920).png().toBuffer()
      console.log("[share-image] Hintergrund als PNG geladen:", bgPath)
    } catch (e) {
      console.error("[share-image] Fehler beim Laden oder Konvertieren des Hintergrunds:", e)
      return res.status(500).send('Background image could not be processed')
    }
    const backgroundDataUri = `data:image/png;base64,${bgBuf.toString('base64')}`

    const avatarUrl = bommel.image_path
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bommel-images/${bommel.image_path}`
      : `${req.headers.origin}/Bommel1Register.png`
    let avatarRaw = Buffer.alloc(0)
    try {
      const r = await fetch(avatarUrl)
      if (r.ok) avatarRaw = Buffer.from(await r.arrayBuffer())
      console.log("[share-image] Avatar geladen von:", avatarUrl)
    } catch (e) {
      console.warn("[share-image] Avatar konnte nicht geladen werden, benutze Platzhalter:", e)
    }
    const avatarBuf = await sharp(avatarRaw).resize(500, 500).png().toBuffer()
    const avatarDataUri = `data:image/png;base64,${avatarBuf.toString('base64')}`

    const zodiac = getBommelZodiacEn(new Date(bommel.birthday))
    const fuzzDensity = Math.floor(Math.random() * 101)
    const dreaminessEmoji = ['☁️','☁️☁️','☁️☁️☁️','☁️☁️☁️☁️','☁️☁️☁️☁️☁️'][Math.floor(Math.random() * 5)]
    const bounceFactor = Math.floor(Math.random() * 10) + 1
    const fluffAttack = Math.floor(Math.random() * 10) + 1

    const rawFluff = bommel.fluff_level
    const fluffNum = typeof rawFluff === 'number'
      ? rawFluff
      : (typeof rawFluff === 'string' ? parseInt(rawFluff, 10) || 0 : 0)
    const fluffStars = fluffNum > 0 ? '★'.repeat(fluffNum) : '—'
    console.log("[share-image] fluff_level:", fluffNum, "→ fluffStars:", fluffStars)

    const svg = `
<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: 'DejaVu Sans', sans-serif; }
  </style>
  <image href="${backgroundDataUri}" width="1080" height="1920"/>
  <g>
    <defs>
      <clipPath id="clip">
        <circle cx="540" cy="558" r="250"/>
      </clipPath>
    </defs>
    <circle cx="540" cy="558" r="254" fill="none" stroke="#fff" stroke-width="4"/>
    <image href="${avatarDataUri}" x="290" y="308" width="500" height="500" clip-path="url(#clip)"/>
    <rect x="390" y="713" width="300" height="54" rx="27" fill="#8e24aa"/>
    <text x="540" y="748" text-anchor="middle" font-weight="700" font-size="36" fill="#fff">
      No. ${bommel.bommler_number}
    </text>
    <rect x="140" y="820" width="800" height="70" rx="35" fill="#fff8" stroke="#8e24aa" stroke-width="4"/>
    <text x="540" y="870" text-anchor="middle" font-size="52" fill="#8e24aa">
      I AM AN OFFICIAL BOMMLER
    </text>
    <rect x="135" y="960" width="810" height="265" rx="10" fill="#ffffffdd"/>
    <line x1="540" y1="980" x2="540" y2="1205" stroke="#ccc" stroke-width="2" stroke-dasharray="4,4"/>
    <text x="155" y="1005" font-weight="700" font-size="32" fill="#333">Name: ${bommel.name}</text>
    <text x="155" y="1050" font-size="32" fill="#333">Type: ${bommel.type}</text>
    <text x="155" y="1095" font-size="32" fill="#333">Birthday: ${bommel.birthday}</text>
    <text x="155" y="1140" font-size="32" fill="#333">Zodiac: ${zodiac.name}</text>
    <text x="155" y="1185" font-size="32" fill="#333">Location: ${bommel.location || 'Unknown'}</text>
    <text x="575" y="1005" font-size="32" fill="#333">Fluff Level: ${fluffStars}</text>
    <text x="575" y="1050" font-size="32" fill="#333">Fuzz Density: ${fuzzDensity}%</text>
    <text x="575" y="1095" font-size="32" fill="#333">Dreaminess: ${dreaminessEmoji}</text>
    <text x="575" y="1140" font-size="32" fill="#333">Bounce Factor: ${bounceFactor}</text>
    <text x="575" y="1185" font-size="32" fill="#333">Fluff Attack: ${fluffAttack}</text>
  </g>
  <rect x="220" y="1450" width="640" height="140" rx="20" fill="#ff69b4"/>
  <text x="540" y="1500" text-anchor="middle" font-size="36" fill="#fff">
    Ready to fluff the world?
  </text>
  <text x="540" y="1558" text-anchor="middle" font-size="34" fill="#ffff00">
    <tspan font-weight="700">mybommel.com</tspan> by Bebetta with ❤️
  </text>
  <text x="540" y="1608" text-anchor="middle" font-size="28" fill="#888">
    Tag @bebetta_official on Instagram!
  </text>
</svg>`

    if (debug === '1') {
      res.setHeader('Content-Type', 'image/svg+xml')
      return res.send(svg)
    }

    const fontPath = path.join(process.cwd(), 'public/fonts/DejaVuSans.ttf')

    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1080 },
      font: {
        loadSystemFonts: false,
        fontFiles: [fontPath]
      }
    })

    const rawPng = resvg.render().asPng()

    const optimized = await sharp(Buffer.from(rawPng))
      .jpeg({ quality: 80 })
      .toBuffer()

    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Content-Disposition', `attachment; filename=bommel-${bommel.bommler_number}.jpg`)
    return res.send(optimized)

  } catch (e) {
    console.error("[share-image] Unerwarteter Fehler:", e)
    return res.status(500).send('Server error')
  }
}
