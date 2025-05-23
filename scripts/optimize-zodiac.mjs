import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

// Hilfsfunktionen für ES Module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const inputDir = path.join(__dirname, '../public/zodiac/originals')
const outputDir = path.join(__dirname, '../public/zodiac/thumbs')

// Funktion zur Namensbereinigung
const sanitizeName = (name) => name
  .normalize('NFD')                      // z. B. "ö" → "ö"
  .replace(/[\u0300-\u036f]/g, '')      // diakritische Zeichen entfernen
  .toLowerCase()
  .replace(/[^a-z0-9]/g, '')            // nur Buchstaben/Ziffern behalten

// Zielordner anlegen
await fs.mkdir(outputDir, { recursive: true })

const files = await fs.readdir(inputDir)

for (const file of files) {
  const inputPath = path.join(inputDir, file)
  const nameWithoutExt = path.parse(file).name
  const safeName = sanitizeName(nameWithoutExt)
  const outputPath = path.join(outputDir, `${safeName}.webp`)

  try {
    await sharp(inputPath)
      .resize(150, 150)
      .toFormat('webp')
      .toFile(outputPath)
    console.log(`✅ ${file} → ${safeName}.webp`)
  } catch (err) {
    console.error(`❌ Fehler bei ${file}:`, err)
  }
}
