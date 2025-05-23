// lib/zodiac-en.ts

// Translated & enhanced version of the legendary Bommel Zodiac
export const BOMMEL_ZODIAC_EN = [
  {
    name: 'Zerflirra',
    image: 'zerflirra.png',
    from: [3, 21], to: [4, 19],
    element: 'Glitter Mind',
    description: 'Tangles thoughts like fairy lights. Believes in charming chaos and inspires others without knowing how.'
  },
  {
    name: 'Blubborant',
    image: 'blubborant.png',
    from: [4, 20], to: [5, 20],
    element: 'Bubble Sense',
    description: 'Ideas fizz like soda. Speaks in metaphors nobody understands—but everyone feels them anyway.'
  },
  {
    name: 'Schlummermoon',
    image: 'schlummermoon.png',
    from: [5, 21], to: [6, 20],
    element: 'Half-Nap Energy',
    description: 'Chronically cozy. Best thoughts come between two naps. Wisdom often appears during tooth brushing.'
  },
  {
    name: 'Drizzlor',
    image: 'drizzlor.png',
    from: [6, 21], to: [7, 22],
    element: 'Droplet Logic',
    description: 'Slow, deep, and delightfully stubborn. Philosophical like a slowly melting candle.'
  },
  {
    name: 'Wirrwind',
    image: 'wirrwind.png',
    from: [7, 23], to: [8, 22],
    element: 'Breezy Focus',
    description: 'Jumps around like a caffeinated idea. 100 tabs open in the brain, two actually read.'
  },
  {
    name: 'Flusora',
    image: 'flusora.png',
    from: [8, 23], to: [9, 22],
    element: 'Mind Drift',
    description: 'Floats through life like a leaf on a stream. Late to react, but always in style.'
  },
  {
    name: 'Murmla',
    image: 'murmla.png',
    from: [9, 23], to: [10, 21],
    element: 'Inner Echo',
    description: 'Talks to themselves—or the universe. Sometimes wise, sometimes just... there.'
  },
  {
    name: 'Fuzzflare',
    image: 'fuzzflare.png',
    from: [10, 22], to: [11, 21],
    element: 'Comfort Chaos',
    description: 'Loves drama in pastel tones. Emotionally caffeinated. Cries at commercials, says "I’m fine."'
  },
  {
    name: 'Nebbelin',
    image: 'nebbelin.png',
    from: [11, 22], to: [12, 21],
    element: 'In-Between Realms',
    description: 'Never fully here nor there. Lives in maybes and ellipses. Mysterious like a forgotten password.'
  },
  {
    name: 'Wuselunk',
    image: 'wuselunk.png',
    from: [12, 22], to: [1, 19],
    element: 'Everyday Jungle',
    description: 'Walking creative chaos. Makes magic from trash. Always out and about—with a picnic blanket.'
  },
  {
    name: 'Knödelux',
    image: 'knoedelux.png',
    from: [1, 20], to: [2, 18],
    element: 'Gut Feeling',
    description: 'Does things without knowing why. Talks to fridges. Kind, chaotic, and a bit round around the edges.'
  },
  {
    name: 'Flinxa',
    image: 'flinxa.png',
    from: [2, 19], to: [3, 20],
    element: 'Day Spark',
    description: 'Pops up like a shower thought. Loves spontaneous insights and finishes sentences with eye sparkles.'
  }
]

// Get English zodiac info for a birthday
export function getBommelZodiacEn(date: Date) {
  const m = date.getMonth() + 1, d = date.getDate()
  return BOMMEL_ZODIAC_EN.find(z =>
    (m === z.from[0] && d >= z.from[1]) ||
    (m === z.to[0]   && d <= z.to[1]) ||
    (z.from[0] > z.to[0] && ((m === z.from[0] && d >= z.from[1]) || (m === z.to[0] && d <= z.to[1])))
  )!
}
