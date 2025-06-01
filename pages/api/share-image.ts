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
    // 1) ID validieren
    const { id, debug } = req.query as { id?: string; debug?: string }
    if (!id) {
      console.error("[share-image] Fehlende ID")
      return res.status(400).send('Missing Bommel ID')
    }
    console.log("[share-image] ID:", id)

    // 2) Bommel-Daten holen (inklusive fluff_level)
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

    // 3) Hintergrundbild aus public/quartett-bg.webp laden
    const bgPath = path.join(process.cwd(), 'public/quartett-bg.webp')
    let bgBuf: Buffer
    try {
      bgBuf = await fs.readFile(bgPath)
      console.log("[share-image] Hintergrund-WebP geladen:", bgPath)
    } catch (e) {
      console.error("[share-image] Fehler beim Laden des Hintergrunds:", e)
      return res.status(500).send('Background image not found')
    }
    const backgroundDataUri = `data:image/webp;base64,${bgBuf.toString('base64')}`

    // 4) Avatar aus Supabase Storage holen
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

    // 5) Zufallswerte generieren
    const zodiac = getBommelZodiacEn(new Date(bommel.birthday))
    const fuzzDensity = Math.floor(Math.random() * 101)
    const dreaminessEmoji = ['☁️','☁️☁️','☁️☁️☁️','☁️☁️☁️☁️','☁️☁️☁️☁️☁️'][Math.floor(Math.random() * 5)]
    const bounceFactor = Math.floor(Math.random() * 10) + 1
    const fluffAttack = Math.floor(Math.random() * 10) + 1

    // 6) fluff_level auslesen und in Sterne umwandeln
    const rawFluff = bommel.fluff_level
    const fluffNum = typeof rawFluff === 'number'
      ? rawFluff
      : (typeof rawFluff === 'string' ? parseInt(rawFluff, 10) || 0 : 0)
    const fluffStars = fluffNum > 0 ? '★'.repeat(fluffNum) : '—'
    console.log("[share-image] fluff_level:", fluffNum, "→ fluffStars:", fluffStars)

    // 7) SVG bauen (Nutzung von Systemfont „DejaVu Sans“, da embedding per Base64 oft fehlschlägt)
    const svg = `
<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <style>
    /* Wir vertrauen darauf, dass „DejaVu Sans“ systemweit installiert ist */
    text { font-family: 'DejaVu Sans', sans-serif; }
  </style>

  <!-- Hintergrund -->
  <image href="${backgroundDataUri}" width="1080" height="1920"/>

  <!-- Avatar-Bereich mit Kreis-Maske -->
  <g transform="translate(0,288)">
    <defs>
      <clipPath id="clip">
        <circle cx="540" cy="270" r="250"/>
      </clipPath>
    </defs>
    <circle cx="540" cy="270" r="254" fill="none" stroke="#fff" stroke-width="4"/>
    <image href="${avatarDataUri}" x="290" y="20" width="500" height="500" clip-path="url(#clip)"/>

    <!-- Nummern-Overlay -->
    <rect x="390" y="425" width="300" height="54" rx="27" fill="#8e24aa"/>
    <text x="540" y="460" text-anchor="middle" font-weight="700" font-size="36" fill="#fff">
      No. ${bommel.bommler_number}
    </text>

    <!-- „I AM AN OFFICIAL BOMMLER“ -->
    <rect x="140" y="570" width="800" height="70" rx="35" fill="#fff8" stroke="#8e24aa" stroke-width="4"/>
    <text x="540" y="620" text-anchor="middle" font-size="52" fill="#8e24aa">
      I AM AN OFFICIAL BOMMLER
    </text>

    <!-- Info-Panel -->
    <rect x="135" y="750" width="810" height="265" rx="10" fill="#ffffffdd"/>
    <line x1="540" y1="770" x2="540" y2="995" stroke="#ccc" stroke-width="2" stroke-dasharray="4,4"/>

    <!-- Linke Spalte -->
    <text x="155" y="795" font-weight="700" font-size="32" fill="#333">Name: ${bommel.name}</text>
    <text x="155" y="840" font-size="32" fill="#333">Type: ${bommel.type}</text>
    <text x="155" y="885" font-size="32" fill="#333">Birthday: ${bommel.birthday}</text>
    <text x="155" y="930" font-size="32" fill="#333">Zodiac: ${zodiac.name}</text>
    <text x="155" y="975" font-size="32" fill="#333">Location: ${bommel.location || 'Unknown'}</text>

    <!-- Rechte Spalte -->
    <text x="575" y="795" font-size="32" fill="#333">Fluff Level: ${fluffStars}</text>
    <text x="575" y="840" font-size="32" fill="#333">Fuzz Density: ${fuzzDensity}%</text>
    <text x="575" y="885" font-size="32" fill="#333">Dreaminess: ${dreaminessEmoji}</text>
    <text x="575" y="930" font-size="32" fill="#333">Bounce Factor: ${bounceFactor}</text>
    <text x="575" y="975" font-size="32" fill="#333">Fluff Attack: ${fluffAttack}</text>
  </g>

  <!-- Footer / Call-to-Action -->
  <rect x="220" y="1380" width="640" height="140" rx="20" fill="#ff69b4"/>
  <text x="540" y="1430" text-anchor="middle" font-size="36" fill="#fff">
    Ready to fluff the world?
  </text>
  <text x="540" y="1490" text-anchor="middle" font-size="36" fill="#ffff00">
    <tspan font-weight="700">mybommel.com</tspan> by Bebetta with Love
  </text>
</svg>`

    console.log("[share-image] Generiertes SVG:\n", svg)

    // Debug-Modus: Nur SVG ausliefern
    if (debug === '1') {
      res.setHeader('Content-Type', 'image/svg+xml')
      return res.send(svg)
    }

    console.log("[share-image] Erstelle PNG mit Resvg (loadSystemFonts)…")

    // 8) SVG → 1080×1920 PNG (Resvg mit loadSystemFonts = true)
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1080 },
      font: { loadSystemFonts: true }
    })
    const rawPng = resvg.render().asPng()

    console.log("[share-image] Rohes PNG gerendert, starte Sharp-Kompression…")

    // 9) Sharp: Halbieren auf 540px Breite, als JPEG mit 80 % Qualität
    const optimized = await sharp(Buffer.from(rawPng))
      .resize({ width: 540 })    // skaliert auf 540×960
      .jpeg({ quality: 80 })
      .toBuffer()

    console.log("[share-image] Fertiges JPG erzeugt, sende Response…")

    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Content-Disposition', `attachment; filename=bommel-${bommel.bommler_number}.jpg`)
    return res.send(optimized)
  } catch (e) {
    console.error("[share-image] Unerwarteter Fehler:", e)
    return res.status(500).send('Server error')
  }
}
