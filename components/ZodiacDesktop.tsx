// ZodiacDesktop.tsx – final optimized version with horoscope fix
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { BOMMEL_ZODIAC_EN } from '@/lib/zodiac-en'

const DESKTOP_ORDER = [
  'Zerflirra', 'Flinxa', 'Blubborant', 'Schlummermoon', 'Drizzlor',
  'Wirrwind', 'Flusora', 'Murmla', 'Fuzzflare', 'Nebbelin', 'Wuselunk', 'Knödelux'
]

function getMysticColor() {
  const MYSTIC_COLORS = [
    '#a78bfa', '#c084fc', '#f472b6', '#f9a8d4',
    '#93c5fd', '#38bdf8', '#67e8f9', '#a5f3fc'
  ]
  return MYSTIC_COLORS[Math.floor(Math.random() * MYSTIC_COLORS.length)]
}

export default function ZodiacDesktop() {
  const router = useRouter()
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPrediction, setShowPrediction] = useState(false)
  const [connections, setConnections] = useState([])
  const [ripples, setRipples] = useState<number[]>([])
  const [isAborting, setIsAborting] = useState(false)
  const radius = 274
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const signs = DESKTOP_ORDER.map(name => BOMMEL_ZODIAC_EN.find(z => z.name === name)).filter(Boolean)

  const generateConnections = () => {
    if (isAborting || loading || selected || showPrediction) return

    const container = document.querySelector('#zodiac-center')
    const rect = container?.getBoundingClientRect()
    const centerX = rect ? rect.width / 2 : 375
    const centerY = rect ? rect.height / 2 : 375

    const angles = Array.from({ length: signs.length }, (_, i) => ((360 / signs.length) * i - 90) * (Math.PI / 180))
    const positions = angles.map(a => ({
      x: centerX + radius * Math.cos(a),
      y: centerY + radius * Math.sin(a)
    }))

    const conns = Array.from({ length: 8 }, () => {
      let a = Math.floor(Math.random() * positions.length)
      let b = Math.floor(Math.random() * positions.length)
      while (b === a) b = Math.floor(Math.random() * positions.length)
      return {
        x1: positions[a].x,
        y1: positions[a].y,
        x2: positions[b].x,
        y2: positions[b].y,
        stroke: getMysticColor()
      }
    })

    setConnections(conns)
  }

  const triggerRippleReveal = (sign) => {
    if (isAborting) return
    const audio = new Audio('/magic-sound.mp3')
    audio.play()

    if (intervalRef.current) clearInterval(intervalRef.current)

    // Always reset before new ripple
    setSelected(null)
    setLoading(true)
    setShowPrediction(false)
    setRipples([...Array(40).keys()])

    timeoutRef.current = setTimeout(() => {
      if (!isAborting) {
        setRipples([])
        setSelected(sign)
        setLoading(false)
        setShowPrediction(true)
      }
    }, 4000)

    timeoutRef.current = setTimeout(() => {
      if (!isAborting) {
        setRipples([])
        setSelected(sign)
        setLoading(false)
        setShowPrediction(true)
      }
    }, 4000)
  }

  useEffect(() => {
    generateConnections()
    intervalRef.current = setInterval(generateConnections, 4000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [selected, showPrediction, loading, isAborting])

  const handleImmediateBack = () => {
    setIsAborting(true)
    setRipples([])
    setConnections([])
    setLoading(false)
    setShowPrediction(false)
    setSelected(null)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)

    setTimeout(() => {
      router.push('/')
    }, 50)
  }

  return (
    <main className="relative min-h-screen bg-zodiac bg-cover bg-center overflow-hidden">
      <button
        onClick={handleImmediateBack}
        className="fixed top-4 left-4 z-[9999] cursor-pointer"
      >
        <img src="/back-to-home.png" alt="Back to Home" className="w-20 h-auto" />
      </button>

      {isAborting && (
        <div className="fixed inset-0 bg-black/50 z-[9998] flex items-center justify-center text-white text-xl">
          Leaving the Stars...
        </div>
      )}

      <div id="zodiac-center" className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto">
        {!selected && !showPrediction && !isAborting && (
          <svg className="absolute w-full h-full transition-all duration-1000 ease-in-out">
            {connections.map((c, i) => (
              <line
                key={i}
                x1={c.x1}
                y1={c.y1}
                x2={c.x2}
                y2={c.y2}
                stroke={c.stroke}
                strokeOpacity="0.4"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        )}

        {!isAborting && ripples.map((_, i) => {
          const size = 80 + i * 20
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full border-2 opacity-0 animate-[fadeRipple_4s_ease-in-out_forwards]"
              style={{
                animationDelay: `${i * 60}ms`,
                width: `${size}px`,
                height: `${size}px`,
                marginLeft: `${-size / 2}px`,
                marginTop: `${-size / 2}px`,
                borderColor: getMysticColor()
              }}
            />
          )
        })}

        {!isAborting && signs.map((sign, i) => {
          const angle = ((360 / signs.length) * i - 90) * (Math.PI / 180)
          const x = (radius + 10) * Math.cos(angle)
          const y = (radius + 10) * Math.sin(angle)
          const delay = i * 0.2

          const from = new Date(2000, sign.from[0] - 1, sign.from[1])
          const to = new Date(2000, sign.to[0] - 1, sign.to[1])

          return (
            <div
              key={sign.name}
              className="absolute hover:z-50"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <button
                onClick={() => triggerRippleReveal(sign)}
                className="pointer-events-auto w-44 h-44 rounded-full flex flex-col items-center justify-center text-center bg-white/10 backdrop-blur hover:scale-105 transition shadow-md border border-white/20 animate-[magicpulse_4s_ease-in-out_infinite]"
                style={{ animationDelay: `${delay}s` }}
              >
                <div className="w-24 h-24 relative rounded-full overflow-hidden flex items-center justify-center mb-1">
                  <Image
                    src={`/zodiac/thumbs/${sign.image.replace(/\.(png|jpe?g|webp)/i, '')}.webp`}
                    alt={sign.name}
                    width={96}
                    height={96}
                    className="object-contain transition-opacity duration-500 opacity-0 animate-fade-in"
                    onLoadingComplete={img => img.classList.remove('opacity-0')}
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                </div>
                <div className="text-white text-sm font-bold drop-shadow-sm whitespace-nowrap leading-none">
                  {sign.name}
                </div>
                <div className="text-xs text-white/80 drop-shadow-sm leading-none">
                  {from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </button>
            </div>
          )
        })}

        {!isAborting && selected && showPrediction && !loading && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="rounded-full w-80 h-80 bg-white/10 border border-white/30 backdrop-blur-lg shadow-xl flex flex-col items-center justify-center text-white text-center p-6 animate-[magicpulse_4s_ease-in-out_infinite] relative">
              <button
                onClick={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                if (intervalRef.current) clearInterval(intervalRef.current);
                setRipples([]);
                setConnections([]);
                setSelected(null);
                setShowPrediction(false);
                setLoading(false);
                intervalRef.current = setInterval(generateConnections, 4000);
              }}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-xs font-bold z-10"
              >
                ×
              </button>
              <div className="text-2xl font-bold mb-1">{selected.name}</div>
              <div className="italic text-white/80 mb-2">{selected.element}</div>
              <div className="text-sm px-4 leading-snug">{selected.description}</div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
