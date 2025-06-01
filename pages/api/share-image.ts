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
  console.log("[share-image] handler aufgerufen, query:", req.query)

  try {
    // 1) ID validieren
    const { id, debug } = req.query as { id?: string; debug?: string }
    if (!id) {
      console.error("[share-image] Fehlende ID")
      return res.status(400).send('Missing Bommel ID')
    }
    console.log("[share-image] ID:", id)

    // 2) Bommel-Daten von Supabase holen
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

    // 3) DejaVuSans.ttf aus public/fonts laden
    const fontPath = path.join(process.cwd(), 'public/fonts/DejaVuSans.ttf')
    let fontBuf: Buffer
    try {
      fontBuf = await fs.readFile(fontPath)
      console.log("[share-image] Font geladen:", fontPath)
    } catch (e) {
      console.error("[share-image] Fehler beim Laden der Font:", e)
      return res.status(500).send('Font not found on server')
    }
    const fontBase64 = fontBuf.toString('base64')

    // 4) Hintergrundbild aus public/quartett-bg.webp laden
    const framePath = path.join(process.cwd(), 'public/quartett-bg.webp')
    let frameBuf: Buffer
    try {
      frameBuf = await fs.readFile(framePath)
      console.log("[share-image] Hintergrund geladen:", framePath)
    } catch (e) {
      console.error("[share-image] Fehler beim Laden des Hintergrunds:", e)
      return res.status(500).send('Background image not found')
    }
    const frameUri = `data:image/webp;base64,${frameBuf.toString('base64')}`

    // 5) Avatar aus Supabase Storage holen
    const imageUrl = bommel.image_path
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bommel-images/${bommel.image_path}`
      : `${req.headers.origin}/Bommel1Register.png`

    let rawAvatar = Buffer.alloc(0)
    try {
      const r = await fetch(imageUrl)
      if (r.ok) rawAvatar = Buffer.from(await r.arrayBuffer())
      console.log("[share-image] Avatar geladen von:", imageUrl)
    } catch (e) {
      console.warn("[share-image] Avatar konnte nicht geladen werden, benutze Platzhalter:", e)
    }
    const avatarBuf = await sharp(rawAvatar).resize(500, 500).png().toBuffer()
    const avatarUri = `data:image/png;base64,${avatarBuf.toString('base64')}`

    // 6) Weitere zufällige Werte
    const zodiac = getBommelZodiacEn(new Date(bommel.birthday))
    const fuzzDensity = Math.floor(Math.random() * 101)
    const dreaminessEmoji = ['☁️','☁️☁️','☁️☁️☁️','☁️☁️☁️☁️','☁️☁️☁️☁️☁️'][Math.floor(Math.random() * 5)]
    const bounceFactor = Math.floor(Math.random() * 10) + 1
    const fluffAttack = Math.floor(Math.random() * 10) + 1
    const fluffStars = typeof bommel.fluff_level === 'number'
      ? '★'.repeat(bommel.fluff_level)
      : '—'

    // 7) SVG-String mit eingebetteter DejaVuSans-Font, ohne xlink-Präfix
    const svg = `
<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <font id="DejaVuSans">
      <font-face font-family="DejaVuSans" />
      <font-face-src>
        <font-face-uri href="data:font/ttf;base64,${fontBase64}" />
      </font-face-src>
    </font>
  </defs>
  <style>
    text { font-family: 'DejaVuSans'; }
  </style>
  <image href="${frameUri}" width="1080" height="1920"/>
  <g transform="translate(0,288)">
    <defs><clipPath id="clip"><circle cx="540" cy="270" r="250"/></clipPath></defs>
    <circle cx="540" cy="270" r="254" fill="none" stroke="#fff" stroke-width="4"/>
    <image href="${avatarUri}" x="290" y="20" width="500" height="500" clip-path="url(#clip)"/>
    <rect x="390" y="425" width="300" height="54" rx="27" fill="#8e24aa"/>
    <text x="540" y="460" text-anchor="middle" font-weight="700" font-size="36" fill="#fff">
      No. ${bommel.bommler_number}
    </text>
    <rect x="140" y="570" width="800" height="70" rx="35" fill="#fff8" stroke="#8e24aa" stroke-width="4"/>
    <text x="540" y="620" text-anchor="middle" font-size="52" fill="#8e24aa">
      I AM AN OFFICIAL BOMMLER
    </text>
    <rect x="135" y="750" width="810" height="265" rx="10" fill="#ffffffdd"/>
    <line x1="540" y1="770" x2="540" y2="995" stroke="#ccc" stroke-width="2" stroke-dasharray="4,4"/>
    <text x="155" y="795" font-weight="700" font-size="32" fill="#333">Name: ${bommel.name}</text>
    <text x="155" y="840" font-size="32" fill="#333">Type: ${bommel.type}</text>
    <text x="155" y="885" font-size="32" fill="#333">Birthday: ${bommel.birthday}</text>
    <text x="155" y="930" font-size="32" fill="#333">Zodiac: ${zodiac.name}</text>
    <text x="155" y="975" font-size="32" fill="#333">Location: ${bommel.location || 'Unknown'}</text>
    <text x="575" y="795" font-size="32" fill="#333">Fluff Level: ${fluffStars}</text>
    <text x="575" y="840" font-size="32" fill="#333">Fuzz Density: ${fuzzDensity}%</text>
    <text x="575" y="885" font-size="32" fill="#333">Dreaminess: ${dreaminessEmoji}</text>
    <text x="575" y="930" font-size="32" fill="#333">Bounce Factor: ${bounceFactor}</text>
    <text x="575" y="975" font-size="32" fill="#333">Fluff Attack: ${fluffAttack}</text>
  </g>
  <rect x="220" y="1380" width="640" height="140" rx="20" fill="#ff69b4"/>
  <text x="540" y="1430" text-anchor="middle" font-size="36" fill="#fff">
    Ready to fluff the world?
  </text>
  <text x="540" y="1490" text-anchor="middle" font-size="36" fill="#ffff00">
    <tspan font-weight="700">mybommel.com</tspan> by Bebetta with Love
  </text>
</svg>`

    console.log("[share-image] SVG-Inhalt:\n", svg)

    // Wenn ?debug=1 angehängt, liefern wir nur das rohe SVG
    if (debug === '1') {
      res.setHeader('Content-Type', 'image/svg+xml')
      return res.send(svg)
    }

    console.log("[share-image] Starte Resvg…")

    // 8) Aus dem SVG ein 1080×1920-PNG erstellen
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1080 },
      font: { loadSystemFonts: false }
    })
    const rawPng = resvg.render().asPng()

    console.log("[share-image] Rohes PNG gerendert, starte Sharp-Kompression…")

    // 9) Mit Sharp halbieren und als JPEG komprimieren
    const optimized = await sharp(Buffer.from(rawPng))
      .resize({ width: 540 })      // 540×960 statt 1080×1920
      .jpeg({ quality: 80 })       // 80 % Qualität → kleinere Datei
      .toBuffer()

    console.log("[share-image] Fertiges JPG erzeugt – sende Response…")

    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Content-Disposition', `attachment; filename=bommel-${bommel.bommler_number}.jpg`)
    return res.send(optimized)

  } catch (e) {
    console.error("[share-image] Unerwarteter Fehler:", e)
    return res.status(500).send('Server error')
  }
}
