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

const config = {
  canvas: { width: 1080, height: 1920 },
  shiftDown: 0.15,
  shiftUp: 0,
  avatar: { x: 290, y: 20, size: 500, border: 4 },
  title: { x: 540, y: 570, width: 800, height: 70, fontSize: 50 },
  badge: { x: 390, y: 425, width: 300, height: 54, fontSize: 37 },
  attrPanel: { x: 135, y: 750, width: 810, height: 265, fontSize: 30, lineHeight: 45 },
  cta: { x: 220, y: 1380, width: 640, height: 140, fontSize: 30 }
}

export default async function handler(req, res) {
  try {
    const { id, preview } = req.query
    if (!id) return res.status(400).send('Missing Bommel ID')

    const { data: bommel, error } = await supabase
      .from('bommler')
      .select('*')
      .eq('id', id)
      .single()
    if (error || !bommel) return res.status(404).send('Bommel not found')

    console.log('✅ bommel:', JSON.stringify(bommel, null, 2))

    const zodiac = getBommelZodiacEn(new Date(bommel.birthday))
    const fuzzDensity = Math.floor(Math.random() * 101)
    const dreaminessEmoji = ['☁️','☁️☁️','☁️☁️☁️','☁️☁️☁️☁️','☁️☁️☁️☁️☁️'][Math.floor(Math.random() * 5)]
    const bounceFactor = Math.floor(Math.random() * 10) + 1
    const fluffAttack = Math.floor(Math.random() * 10) + 1

    const imageUrl = bommel.image_path
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bommel-images/${bommel.image_path}`
      : `${req.headers.origin}/Bommel1Register.png`

    console.log('🧪 imageUrl:', imageUrl)

    const framePath = path.join(process.cwd(), 'assets', 'sharepic', 'quartett-bg.png')
    const frameBufPromise = fs.readFile(framePath)

    let rawImageBuffer
    try {
      const res = await fetch(imageUrl)
      if (!res.ok) throw new Error('Image fetch failed')
      rawImageBuffer = await res.arrayBuffer()
    } catch (err) {
      console.error('❌ Failed to fetch image:', imageUrl, err)
      rawImageBuffer = Buffer.alloc(0)
    }

    const imgBufPromise = sharp(Buffer.from(rawImageBuffer)).resize({ width: 512 }).toBuffer()
    const [frameBuf, imgBuf] = await Promise.all([frameBufPromise, imgBufPromise])

    const frameUri = `data:image/png;base64,${frameBuf.toString('base64')}`
    const imgUri = imgBuf.length > 0 ? `data:image/png;base64,${imgBuf.toString('base64')}` : ''
    console.log('🧪 imgUri prefix:', imgUri?.substring?.(0, 100) || 'no image')

    const shiftDownPx = config.canvas.height * config.shiftDown
    const shiftUpPx = config.canvas.height * config.shiftUp

    const fluffStars = typeof bommel.fluff_level === 'string' || typeof bommel.fluff_level === 'number'
      ? '★'.repeat(Number(bommel.fluff_level))
      : '—'

    const svg = `
<svg width="${config.canvas.width}" height="${config.canvas.height}" xmlns="http://www.w3.org/2000/svg">
  <image href="${frameUri}" width="${config.canvas.width}" height="${config.canvas.height}"/>
  <g transform="translate(0,${shiftDownPx})">
    <defs>
      <clipPath id="clip"><circle cx="${config.avatar.x + config.avatar.size/2}" cy="${config.avatar.y + config.avatar.size/2}" r="${config.avatar.size/2}"/></clipPath>
    </defs>
    <circle cx="${config.avatar.x + config.avatar.size/2}" cy="${config.avatar.y + config.avatar.size/2}" r="${config.avatar.size/2 + config.avatar.border}" fill="none" stroke="#fff" stroke-width="${config.avatar.border}"/>
    <image href="${imgUri}" x="${config.avatar.x}" y="${config.avatar.y}" width="${config.avatar.size}" height="${config.avatar.size}" clip-path="url(#clip)"/>
    <rect x="${config.title.x - config.title.width/2}" y="${config.title.y}" width="${config.title.width}" height="${config.title.height}" rx="${config.title.height/2}" fill="#ffffffcc" stroke="#8e24aa" stroke-width="4"/>
    <text x="${config.title.x}" y="${config.title.y + config.title.height/2 + config.title.fontSize/3}" text-anchor="middle" font-family="Bangers, cursive" font-size="${config.title.fontSize}" fill="#8e24aa">I AM AN OFFICIAL BOMMLER</text>
    <rect x="${config.badge.x}" y="${config.badge.y}" width="${config.badge.width}" height="${config.badge.height}" rx="${config.badge.height/2}" fill="#8e24aa"/>
    <text x="${config.badge.x + config.badge.width/2}" y="${config.badge.y + config.badge.height/2 + config.badge.fontSize/3}" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="${config.badge.fontSize}" fill="#fff">No. ${bommel.bommler_number}</text>
    <rect x="${config.attrPanel.x}" y="${config.attrPanel.y}" width="${config.attrPanel.width}" height="${config.attrPanel.height}" rx="10" fill="#ffffffdd"/>
    <line x1="${config.attrPanel.x + config.attrPanel.width/2}" y1="${config.attrPanel.y + 20}" x2="${config.attrPanel.x + config.attrPanel.width/2}" y2="${config.attrPanel.y + config.attrPanel.height - 20}" stroke="#ccc" stroke-width="2" stroke-dasharray="4,4"/>
    <text x="${config.attrPanel.x + 20}" y="${config.attrPanel.y + config.attrPanel.lineHeight}" font-family="Montserrat, sans-serif" font-size="${config.attrPanel.fontSize}" fill="#333">Name: ${bommel.name}</text>
    <text x="${config.attrPanel.x + 20}" y="${config.attrPanel.y + config.attrPanel.lineHeight * 2}" font-family="Montserrat, sans-serif" font-size="${config.attrPanel.fontSize}" fill="#333">Type: ${bommel.type}</text>
    <text x="${config.attrPanel.x + 20}" y="${config.attrPanel.y + config.attrPanel.lineHeight * 3}" font-family="Montserrat, sans-serif" font-size="${config.attrPanel.fontSize}" fill="#333">Birthday: ${bommel.birthday}</text>
    <text x="${config.attrPanel.x + 20}" y="${config.attrPanel.y + config.attrPanel.lineHeight * 4}" font-family="Montserrat, sans-serif" font-size="${config.attrPanel.fontSize}" fill="#333">Zodiac: ${zodiac.name}</text>
    <text x="${config.attrPanel.x + 20}" y="${config.attrPanel.y + config.attrPanel.lineHeight * 5}" font-family="Montserrat, sans-serif" font-size="${config.attrPanel.fontSize}" fill="#333">Location: ${bommel.location || 'Unknown'}</text>
    <text x="${config.attrPanel.x + config.attrPanel.width/2 + 20}" y="${config.attrPanel.y + config.attrPanel.lineHeight}" font-family="Montserrat, sans-serif" font-size="${config.attrPanel.fontSize}" fill="#333">Fluff Level: ${fluffStars}</text>
    <text x="${config.attrPanel.x + config.attrPanel.width/2 + 20}" y="${config.attrPanel.y + config.attrPanel.lineHeight * 2}" font-family="Montserrat, sans-serif" font-size="${config.attrPanel.fontSize}" fill="#333">Fuzz Density: ${fuzzDensity}%</text>
    <text x="${config.attrPanel.x + config.attrPanel.width/2 + 20}" y="${config.attrPanel.y + config.attrPanel.lineHeight * 3}" font-family="Montserrat, sans-serif" font-size="${config.attrPanel.fontSize}" fill="#333">Dreaminess: ${dreaminessEmoji}</text>
    <text x="${config.attrPanel.x + config.attrPanel.width/2 + 20}" y="${config.attrPanel.y + config.attrPanel.lineHeight * 4}" font-family="Montserrat, sans-serif" font-size="${config.attrPanel.fontSize}" fill="#333">Bounce Factor: ${bounceFactor}</text>
    <text x="${config.attrPanel.x + config.attrPanel.width/2 + 20}" y="${config.attrPanel.y + config.attrPanel.lineHeight * 5}" font-family="Montserrat, sans-serif" font-size="${config.attrPanel.fontSize}" fill="#333">Fluff Attack: ${fluffAttack}</text>
  </g>
  <g transform="translate(0,${shiftUpPx})">
    <rect x="${config.cta.x}" y="${config.cta.y}" width="${config.cta.width}" height="${config.cta.height}" rx="20" fill="#ff69b4"/>
    <text x="${config.canvas.width/2}" y="${config.cta.y + config.cta.height/2 - config.cta.fontSize}" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="${config.cta.fontSize}" fill="#fff">Ready to fluff the world?</text>
    <text x="${config.canvas.width/2}" y="${config.cta.y + config.cta.height/2 + config.cta.fontSize}" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="${config.cta.fontSize}" fill="#ffff00"><tspan font-weight="700">mybommel.com</tspan> by Bebetta with Love</text>
  </g>
</svg>`

    if (preview === 'svg') {
      res.setHeader('Content-Type', 'image/svg+xml')
      return res.send(svg)
    }

    const resvgInstance = new Resvg(svg, {
      fitTo: { mode: 'width', value: 720 }
    })

    const png = resvgInstance.render().asPng()

    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Content-Disposition', 'inline; filename=bommel-story.png')
    res.setHeader('Cache-Control', 'public, max-age=3600, immutable')
    res.send(png)

  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
}