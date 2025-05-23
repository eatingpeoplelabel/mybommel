import { useState } from 'react'
import { BOMMEL_ZODIAC_EN, getBommelZodiacEn } from '@/lib/zodiac-en'
import Image from 'next/image'
import Link from 'next/link'

type ZodiacSign = typeof BOMMEL_ZODIAC_EN[0]

export default function ZodiacMobile() {
  const [birthday, setBirthday] = useState<string>('')
  const [result, setResult] = useState<ZodiacSign | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const date = new Date(birthday)
    if (!isNaN(date.getTime())) {
      const zodiac = getBommelZodiacEn(date)
      setResult(zodiac)
    }
  }

  const handleReset = () => {
    setBirthday('')
    setResult(null)
  }

  return (
    <main className="min-h-screen bg-zodiac bg-cover bg-center p-6 flex flex-col items-center text-white text-center">
      <h1 className="text-3xl font-bold mt-4 mb-4">🔮 Bommel Horoscope</h1>
      <Link href="/">
        <button className="mb-6 px-4 py-2 bg-white/20 rounded-full border border-white/30 text-sm hover:bg-white/30">
          ← Back to Home
        </button>
      </Link>

      {!result && (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <p className="mb-4 text-sm text-white/80">
            Enter your birthday and discover your mystical Bommel sign…
          </p>
          <input
            type="date"
            required
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-full text-black border border-white/30 shadow-inner"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-full bg-white/10 backdrop-blur border border-white/30 hover:bg-white/20 transition"
          >
            Reveal my Bommel Sign ✨
          </button>
        </form>
      )}

      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white/10 p-6 rounded-2xl border border-white/30 backdrop-blur w-full max-w-xs text-center text-white animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">{result.name}</h2>
            <div className="mb-4 italic text-white/80">{result.element}</div>
            <Image
              src={`/zodiac/thumbs/${result.image
                .replace(/\.(png|jpe?g)/i, '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '')}.webp`}
              alt={result.name}
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
            <p className="text-sm px-2 leading-snug mb-4">
              {result.description}
            </p>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm rounded-full bg-white/10 border border-white/30 hover:bg-white/20 transition"
            >
              Try another birthday
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
