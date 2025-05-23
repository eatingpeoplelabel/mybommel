// scripts/generateCentroids.js
// Usage: node scripts/generateCentroids.js
// Extrahiert Ländermittelpunkte aus TopoJSON und schreibt lib/countryCentroids.json

import fs from 'fs'
import path from 'path'
import { feature } from 'topojson-client'
import * as d3 from 'd3-geo'

// Pfade anpassen, falls nötig
const topoPath   = path.resolve('public/world-110m.json')
const outputPath = path.resolve('lib/countryCentroids.json')

// TopoJSON laden
const worldTopo = JSON.parse(fs.readFileSync(topoPath, 'utf-8'))
const countries = feature(worldTopo, worldTopo.objects.countries).features

// Mapping aufbauen
const mapping = {}
countries.forEach(f => {
  const props = f.properties
  const name  = props.name || props.admin || props.NAME || props.NAME_LONG
  if (!name) return
  const [lng, lat] = d3.geoCentroid(f)
  mapping[name] = [parseFloat(lng.toFixed(4)), parseFloat(lat.toFixed(4))]
})

// Fantasieländer irgendwo ins Meer/Antarktis packen
const fantasyCoords = [
  ['Fantasia',    [-160.0, -55.0]],
  ['Narnia',      [  29.0,  52.0]],
  ['Middle-earth',[  20.0,  47.0]],
  ['Westeros',    [ -25.0,  55.0]],
  ['El Dorado',   [ -65.0, -10.0]],
]
fantasyCoords.forEach(([name, coords]) => {
  mapping[name] = coords
})

// Verzeichnis lib/ anlegen und JSON schreiben
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2), 'utf-8')

console.log(`✅ Wrote ${Object.keys(mapping).length} centroids to ${outputPath}`)
