import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import nodemailer from 'nodemailer'
import sharp from 'sharp'

export const config = {
  api: { bodyParser: false },
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

type BommelData = {
  nickname: string
  name: string
  fluff_level: string
  type: string
  birthday: string
  email?: string
  about?: string
  country?: string
  postal_code?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const buffers = []
    for await (const chunk of req) {
      buffers.push(chunk)
    }
    const bodyStr = Buffer.concat(buffers).toString()
    const body = JSON.parse(bodyStr)

    const {
      bot_detector_3000,
      image_base64,
      image_name,
      country,
      postal_code,
      ...rest
    }: { bot_detector_3000?: string; image_base64?: string; image_name?: string } & BommelData = body

    if (bot_detector_3000) {
      return res.status(400).json({ error: 'Spam detected' })
    }

    if (!image_base64 || !image_name) {
      return res.status(400).json({ error: 'Missing image data' })
    }

    const base64data = image_base64.includes(',')
      ? image_base64.split(',').pop()!
      : image_base64
    const originalBuffer = Buffer.from(base64data, 'base64')

    // 🔧 Bild verkleinern und als WebP speichern
    const compressedBuffer = await sharp(originalBuffer)
      .resize({ width: 1000, withoutEnlargement: true })
      .webp({ quality: 70 })
      .toBuffer()

    const { count, error: countError } = await supabase
      .from('bommler')
      .select('id', { count: 'exact', head: true })
    if (countError) throw countError
    const nextNumber = String((count ?? 0) + 1).padStart(4, '0')
    const bommler_number = `BOM-${nextNumber}`

    const filename = `${bommler_number}-${Date.now()}.webp`
    const { error: uploadError } = await supabase
      .storage
      .from('bommel-images')
      .upload(filename, compressedBuffer, {
        contentType: 'image/webp',
        upsert: false,
      })
    if (uploadError) throw uploadError

    let coords: [number, number] | null = null
    if (postal_code && country) {
      coords = await geocode(postal_code, country)
    }

    const { data, error: insertError } = await supabase
      .from('bommler')
      .insert([
        {
          nickname: rest.nickname,
          name: rest.name,
          fluff_level: rest.fluff_level,
          type: rest.type,
          birthday: rest.birthday,
          email: rest.email ?? null,
          about: rest.about ?? null,
          location: country ?? null,
          postal_code: postal_code ?? null,
          coords,
          image_path: filename,
          bommler_number,
        },
      ])
      .select('*')
      .single()
    if (insertError) throw insertError

    if (rest.email) {
      try {
        console.log("🟡 Trying to send newsletter confirmation to:", rest.email)
        console.log("SMTP Config:", {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
        })

        await supabase
          .from('newsletter_candidate')
          .upsert({ email: rest.email }, { onConflict: 'email' })

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: { rejectUnauthorized: false, servername: 'kasserver.com' },
        })

        const confirmUrl = `http://${process.env.NEXT_PUBLIC_HOST}/api/newsletter/confirm?email=${encodeURIComponent(rest.email)}`

        await transporter.sendMail({
          from: `"Bommel & Bebetta" <${process.env.SMTP_USER}>`,
          to: rest.email,
          subject: 'Please confirm your newsletter signup',
          html: `
            <p>Hi ${rest.nickname},</p>
            <p>Thanks for registering your Bommel! To receive occasional news & giveaways, please confirm your email by clicking below:</p>
            <p><a href="${confirmUrl}">Confirm my subscription</a></p>
            <p>Welcome aboard the Bommelution! 🚀</p>
          `,
        })

        console.log("✅ Newsletter confirmation email sent to:", rest.email)
      } catch (newsletterErr: any) {
        console.error('❌ Newsletter error (non-blocking):', newsletterErr.message)
        console.error('Full error:', newsletterErr)
      }
    }

    return res.status(200).json(data)
  } catch (err: any) {
    console.error('❌ Error in register API:', err)
    if (err.message?.includes('Resource already exists')) {
      return res.status(409).json({ error: 'Resource already exists' })
    }
    return res.status(500).json({ error: err.message ?? 'Unexpected error' })
  }
}
