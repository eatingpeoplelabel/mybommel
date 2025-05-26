// pages/api/certificate.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import PDFDocument from 'pdfkit'
import path from 'path'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const rawId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
  const bommlerId = rawId ? parseInt(rawId, 10) : NaN
  if (isNaN(bommlerId)) return res.status(400).json({ error: 'Invalid ID' })

  const { data, error } = await supabaseAdmin
    .from('bommler')
    .select('*')
    .eq('id', bommlerId)
    .single()
  if (error || !data) return res.status(404).json({ error: 'Bommler not found' })

  // Prepare PDF
  const margin = 50
  const doc = new PDFDocument({ size: 'A4', margin })

  // Background
  try {
    doc.image(path.resolve('./public/background.png'), 0, 0, { width: doc.page.width, height: doc.page.height })
  } catch {}

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename=certificate-${data.bommler_number}.pdf`)
  doc.pipe(res)

  // Load fonts
  const fp = path.resolve('./fonts')
  doc.registerFont('BaskervilleBold', path.join(fp, 'LibreBaskerville-Bold.ttf'))
  doc.registerFont('Arno', path.join(fp, 'ArnoPro-Regular.otf'))
  doc.registerFont('MonteCarlo', path.join(fp, 'MonteCarlo-Regular.ttf'))

  // Move header further down
  doc.moveDown(13)

  // Title
  doc.fillColor('#5A189A')
     .font('BaskervilleBold').fontSize(28)
     .text('The Grand Fluffdom of Bommlers', margin, doc.y, { align: 'center' })
     .moveDown(0.3)
  doc.fillColor('#D4AF37')
     .fontSize(18)
     .text('OFFICIAL CERTIFICATE OF BOMMLIFICATION', margin, doc.y, { align: 'center' })
     .moveDown(0.5)

  // Divider
  doc.moveTo(margin, doc.y)
     .lineTo(doc.page.width - margin, doc.y)
     .strokeColor('#D4AF37').lineWidth(1.5).stroke()
     .moveDown(0.5)

  // Intro line in MonteCarlo
  doc.font('MonteCarlo').fontSize(20).fillColor('black')
     .text('Let it be known across all fuzzy realms that', { align: 'center' })
     .moveDown(0.3)

  // Owner nickname
  doc.font('BaskervilleBold').fontSize(20).fillColor('#000')
     .text(data.nickname, { align: 'center' })
     .moveDown(0.0)

  // Registration statement in MonteCarlo
  doc.font('MonteCarlo').fontSize(20).fillColor('black')
     .text('has officially registered their noble Bommel', { align: 'center' })
     .moveDown(0.3)

  // Bommel name in header color
  doc.font('BaskervilleBold').fontSize(20).fillColor('#5A189A')
     .text(data.name, { align: 'center' })
     .moveDown(0.2)

  // Official Bommler Number
  doc.font('Arno').fontSize(14).fillColor('#000')
     .text(`Official Bommler Number: ${data.bommler_number}`, { align: 'center' })
     .moveDown(0.3)

  // Oath paragraph in MonteCarlo
  const oathWidth = doc.page.width - margin * 2
  doc.font('MonteCarlo').fontSize(15).fillColor('black')
     .text(
       'By the power vested in fluff, sparkle, and unwavering silliness, this Bommel is now and forevermore part of the sacred archive. May its fluff never flatten, its threads never tangle, and its bounce forever brighten the lives of all.',
       margin, doc.y, { align: 'center', width: oathWidth, lineGap: 0 }
     )
     .moveDown(0.3)

  // Seal
  const sealPath = path.resolve('./public/seal.webp')
  const sealSize = 150
  const sealX = doc.page.width / 2 - sealSize / 2
  const sealY = doc.page.height - margin - sealSize - 65
  try {
    doc.image(sealPath, sealX, sealY, { width: sealSize })
  } catch {}

  doc.end()
}
