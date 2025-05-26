import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import nodemailer from 'nodemailer'

export const config = {
  api: { bodyParser: true },
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
  image_path?: string
  bot_detector_3000?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body as BommelData

    if (body.bot_detector_3000) {
      return res.status(400).json({ error: 'Spam detected' })
    }

    if (!body.image_path) {
      return res.status(400).json({ error: 'No image path provided' })
    }

    const { count, error: countError } = await supabase
      .from('bommler')
      .select('id', { count: 'exact', head: true })
    if (countError) throw countError
    const nextNumber = String((count ?? 0) + 1).padStart(4, '0')
    const bommler_number = `BOM-${nextNumber}`

    let coords: [number, number] | null = null
    if (body.postal_code && body.country) {
      coords = await geocode(body.postal_code, body.country)
    }

    const { data, error: insertError } = await supabase
      .from('bommler')
      .insert([
        {
          nickname: body.nickname,
          name: body.name,
          fluff_level: body.fluff_level,
          type: body.type,
          birthday: body.birthday,
          email: body.email ?? null,
          about: body.about ?? null,
          location: body.country ?? null,
          postal_code: body.postal_code ?? null,
          coords,
          image_path: body.image_path,
          bommler_number,
        },
      ])
      .select('*')
      .single()
    if (insertError) throw insertError

    if (body.email) {
      try {
        console.log("🟡 Trying to send newsletter confirmation to:", body.email)

        await supabase
          .from('newsletter_candidate')
          .upsert({ email: body.email }, { onConflict: 'email' })

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

        const confirmUrl = `${process.env.NEXT_PUBLIC_HOST}/api/newsletter/confirm?email=${encodeURIComponent(body.email)}`

        await transporter.sendMail({
          from: `"Bommel & Bebetta" <${process.env.SMTP_USER}>`,
          to: body.email,
          subject: 'Please confirm your newsletter signup',
          html: `
            <p>Hi ${body.nickname},</p>
            <p>Thanks for registering your Bommel! To receive occasional news & giveaways, please confirm your email by clicking below:</p>
            <p><a href="${confirmUrl}">Confirm my subscription</a></p>
            <p>Welcome aboard the Bommelution! 🚀</p>
          `,
        })

        console.log("✅ Newsletter confirmation email sent to:", body.email)
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
