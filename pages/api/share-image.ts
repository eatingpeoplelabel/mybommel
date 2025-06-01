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
  try {
    const { id } = req.query
    if (!id) return res.status(400).send('Missing Bommel ID')

    const { data: bommel, error } = await supabase
      .from('bommler')
      .select('*')
      .eq('id', id)
      .single()
    if (error || !bommel) return res.status(404).send('Bommel not found')

    const zodiac = getBommelZodiacEn(new Date(bommel.birthday))
    const fuzzDensity = Math.floor(Math.random() * 101)
    const dreaminessEmoji = ['☁️','☁️☁️','☁️☁️☁️','☁️☁️☁️☁️','☁️☁️☁️☁️☁️'][Math.floor(Math.random()*5)]
    const bounceFactor = Math.floor(Math.random() * 10) + 1
    const fluffAttack = Math.floor(Math.random() * 10) + 1
    const fluffStars = typeof bommel.fluff_level === 'number'
      ? '★'.repeat(bommel.fluff_level)
      : '—'

    const framePath = path.join(process.cwd(), 'assets/sharepic/quartett-bg.png')
    const frameBuf = await fs.readFile(framePath)
    const frameUri = `data:image/png;base64,${frameBuf.toString('base64')}`

    const imageUrl = bommel.image_path
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bommel-images/${bommel.image_path}`
      : `${req.headers.origin}/Bommel1Register.png`
    let rawAvatar = Buffer.alloc(0)
    try {
      const r = await fetch(imageUrl)
      if (r.ok) rawAvatar = Buffer.from(await r.arrayBuffer())
    } catch {}

    const avatarBuf = await sharp(rawAvatar).resize(500, 500).png().toBuffer()
    const avatarUri = `data:image/png;base64,${avatarBuf.toString('base64')}`

    // FONT einbetten
    const fontPath = path.join(process.cwd(), 'assets/fonts/DejaVuSans.ttf')
    const fontBuf = await fs.readFile(fontPath)
    const fontBase64 = fontBuf.toString('base64')

    const svg = `
<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <style>
    @font-face {
      font-family: 'DejaVuSans';
      src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
    }
    text {
      font-family: 'DejaVuSans', sans-serif;
    }
  </style>
  <image href="${frameUri}" width="1080" height="1920"/>
  <g transform="translate(0,288)">
    <defs><clipPath id="clip"><circle cx="540" cy="270" r="250"/></clipPath></defs>
    <circle cx="540" cy="270" r="254" fill="none" stroke="#fff" stroke-width="4"/>
    <image href="${avatarUri}" x="290" y="20" width="500" height="500" clip-path="url(#clip)"/>
    <rect x="390" y="425" width="300" height="54" rx="27" fill="#8e24aa"/>
    <text x="540" y="460" text-anchor="middle" font-weight="700" font-size="36" fill="#fff">No. ${bommel.bommler_number}</text>
    <rect x="140" y="570" width="800" height="70" rx="35" fill="#fff8" stroke="#8e24aa" stroke-width="4"/>
    <text x="540" y="620" text-anchor="middle" font-size="52" fill="#8e24aa">I AM AN OFFICIAL BOMMLER</text>
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
  <text x="540" y="1430" text-anchor="middle" font-size="36" fill="#fff">Ready to fluff the world?</text>
  <text x="540" y="1490" text-anchor="middle" font-size="36" fill="#ffff00">
    <tspan font-weight="700">mybommel.com</tspan> by Bebetta with Love
  </text>
</svg>`

    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1080 } })
    const png = resvg.render().asPng()

    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Content-Disposition', `attachment; filename=bommel-${bommel.bommler_number}.png`)
    return res.send(png)
  } catch (e) {
    console.error(e)
    res.status(500).send('Server error')
  }
}
