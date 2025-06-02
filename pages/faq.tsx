'use client'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function FAQ() {
  const router = useRouter()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleBack = () => router.push('/')

  const colors = [
    'bg-pink-100',
    'bg-purple-100',
    'bg-blue-100',
    'bg-yellow-100',
    'bg-green-100',
    'bg-rose-100',
    'bg-indigo-100',
    'bg-orange-100',
  ]

  const questions = [
    { q: 'What do I do if I don’t have a Bommel?', a: 'A life without a Bommel is possible, but pointless! Join our Bommel Workshops or visit the How to Make a Bommel page to get started and never miss out on fluffy fun again.' },
    { q: 'How do I wash my Bommel?', a: 'Gently hand wash your pom-pom in cool water with mild soap. Squeeze out excess water and let it air dry fluffed up for maximum fluffiness!' },
    { q: 'How many Bommels are too many Bommels?', a: 'There’s no such thing as too many! But if they start taking over your living room, it might be time to gift a few to friends 😉.' },
    { q: 'Help, my Bommel talks to me – am I pom-puzzled?', a: 'Only if it starts giving you advice on life choices. Enjoy the fluffy conversations, but remember: you’re the boss of your Bommel! 😜' },
    { q: 'Does my Bommel need a seat on the airplane?', a: 'Absolutely! Secure your fluffy companion in a cozy pillowcase and let them ride shotgun – they deserve first-class fluff treatment.' },
    { q: 'Help, I lost my Bommel!', a: 'Check under the couch cushions, behind the curtains, and inside your heart – that’s where lost feelings (and lost Bommels) hide. Then register a new one! 📜' },
    { q: 'Can I add glitter to my Bommel?', a: 'Of course! A sprinkle of sparkle makes every Bommel shine brighter. Just make sure it’s eco-friendly glitter to keep your fluff planet-safe.' },
    { q: 'Do Bommels get sunburn?', a: 'Not really, but prolonged exposure to direct sunlight can fade their colors. A shady spot is best for long-lasting fluff.' },
    { q: 'My Bommel shrunk after laundry – help!', a: 'Use cold water and lay flat to dry next time. For now, give it a gentle fluff with a comb to restore its volume.' },
    { q: 'Can Bommels compete in the Olympics?', a: 'In the Fluff Olympics, they certainly can! Events include the 100m Fluff Dash and Synchronized Pom-Pom Twirl. 🏅' },
    { q: 'Do Bommels dream about yarn forests?', a: 'Legend says they dream of endless yarn forests and infinite cuddles. Sweet fluff-filled dreams! 🌳✨' },
    { q: 'How to de-tangle a matted Bommel?', a: 'Gently use a wide-tooth comb and a few drops of fabric softener. Patience is key—slow strokes bring back that puffy perfection.' },
    { q: 'Can Bommels communicate telepathically?', a: 'Some say yes! If you’re especially in tune, you might feel a soft nudge guiding your crafting hand.' },
    { q: 'Should I tip my Bommel after a spa day?', a: 'A gentle pat and a whisper of thanks is all they need to feel appreciated. No tipping required! 💕' },
    { q: 'Is it weird to hug my Bommel in public?', a: 'Never! Fluff is a universal comfort object—hugs are a sign of style and fluff solidarity. 🤗' },
    { q: 'Can a Bommel replace my therapist?', a: 'They offer endless fluffy support, but for deep feelings, a human therapist might help untangle tough knots. Bommel hugs heal, but they don’t bill insurance! 🛋️' },
    { q: 'Why do Bommels never tell me their secrets?', a: 'They guard the mysteries of yarn and fluff—some secrets are woven in silence. Respect the fluff code! 🤫' },
    { q: 'If I eat a Bommel, will I become fluffy?', a: 'We don’t recommend snacking on plush art. Instead, cuddle and create more Bommels for maximum fluff without tummy troubles.' },
    { q: 'What’s the meaning of life according to my Bommel?', a: 'To fluff every moment with joy, color, and connection. Life is yarn—make beautiful loops! 🌀' },
    { q: 'Can Bommels weather my emotions?', a: 'They’re the ultimate comfort buddy—sharing your highs and lows one fluff at a time. Cry, laugh, snuggle—Bommel is there.' },
    { q: 'How do I unlock the sacred Bommel God? 👁️', a: 'First, you must complete the ancient ritual: register your very first Bommel. Upon completion, a secret code shall appear – whispered by the fluff itself. Enter it on the homepage, and the Bommel God may open the gates of pom-pom eternity. Fluff wisely, chosen one. 🌀' },
  ]

  return (
    <>
      <Head>
        <title>FAQ - Grand Fluffdom of Bommlers</title>
        <meta name="description" content="Fun FAQs about your pom-pom life" />
      </Head>

      <main className="min-h-screen bg-memphis bg-cover bg-center px-4 pt-6 pb-20 flex flex-col items-center relative">

        {/* Hamburger Menu for Mobile */}
        {isMobile && (
          <button
            onClick={() => setShowMenu(prev => !prev)}
            className="absolute top-2 left-2 p-2 z-50 bg-purple-600 rounded-full shadow"
            aria-label="Toggle menu"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Menu Drawer */}
        {isMobile && showMenu && (
          <div className="fixed inset-0 z-40 flex">
            <div className="w-3/4 max-w-xs h-full bg-white shadow-2xl p-4 overflow-y-auto border-r-4 border-purple-200">
              <button onClick={() => setShowMenu(false)} aria-label="Close menu" className="mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <nav className="flex flex-col space-y-3 text-lg">
                <Link href="/" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">Home</Link>
                <Link href="/register" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">Register Your Bommel</Link>
                <Link href="/gallery" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">Bommel-Gallery</Link>
                <Link href="/workshop" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">Bommel Workshop</Link>
                <Link href="/how-to-bommel" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">How-To-Bommel</Link>
                <Link href="/zodiac" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">Bommel-Horoscope</Link>
                <Link href="/faq" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">FABQ</Link>
                <a href="https://bebetta.de/shop/" target="_blank" rel="noopener" className="font-medium hover:text-purple-700">Shop</a>
                <Link href="/contact" onClick={() => setShowMenu(false)} className="font-medium hover:text-purple-700">Contact</Link>
              </nav>
            </div>
            <div className="flex-1 bg-black bg-opacity-50" onClick={() => setShowMenu(false)} />
          </div>
        )}

        {/* Desktop: Back Icon */}
        {!isMobile && (
          <button onClick={handleBack} className="fixed top-4 left-4 z-50">
            <Image
              src="/back-to-home.webp"
              alt="Back to Home"
              width={96}
              height={96}
              priority
              className="w-24 h-auto cursor-pointer"
            />
          </button>
        )}

        {/* Header */}
        <div className="bg-white/30 backdrop-blur-md rounded-3xl px-6 py-4 shadow-lg max-w-3xl text-center animate-fade-in-slow mb-6 mt-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 tracking-wide">
            Frequently Asked Bommel Questions
          </h1>
        </div>

        {/* Mobile: Back Button */}
        {isMobile && (
          <button
            onClick={handleBack}
            className="mb-4 px-6 py-2 bg-white/50 backdrop-blur-sm text-purple-800 font-bold rounded-full shadow"
          >
            ⬅ Back to Home
          </button>
        )}

        {/* FAQ Cards */}
        <div className="w-full max-w-2xl space-y-4">
          {questions.map((item, idx) => {
            const color = colors[idx % colors.length]
            return (
              <div key={idx} className={`${color} bg-opacity-80 rounded-xl shadow-md`}>
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex justify-between items-center px-6 py-4 text-lg text-gray-800 font-semibold rounded-t-xl"
                >
                  {item.q}
                  <span className="text-2xl select-none">{openIndex === idx ? '−' : '+'}</span>
                </button>
                {openIndex === idx && (
                  <div className="px-6 pb-4 text-gray-700">{item.a}</div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
