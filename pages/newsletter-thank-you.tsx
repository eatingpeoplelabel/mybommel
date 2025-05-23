import React from 'react'
import Link from 'next/link'

export default function ThankYou() {
  return (
    <main className="relative min-h-screen bg-register bg-cover bg-center flex items-start justify-center pt-8 p-6 overflow-hidden">
      {/* Back to home button */}
      <Link href="/" className="fixed top-4 left-4 z-30">
        <img src="/back-to-home.png" alt="Back to Home" className="w-24 h-auto cursor-pointer" />
      </Link>

      {/* Decorative Bommels */}
      <div className="absolute top-16 left-8 w-48 h-48 animate-bounce-real-a">
        <img src="/Bommel1Register.png" alt="Bommel Left" className="w-full h-full object-contain" />
      </div>
      <div className="absolute top-16 right-8 w-48 h-48 animate-bounce-real-b">
        <img src="/Bommel2Register.png" alt="Bommel Right" className="w-full h-full object-contain" />
      </div>

      {/* Confirmation Box */}
      <div className="relative z-10 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg max-w-lg w-full p-8 space-y-6 border border-white/40 mt-16 text-center">
        <h1 className="text-4xl font-extrabold text-purple-700">🎉 Subscription Confirmed!</h1>
        <p className="text-lg text-gray-800 leading-relaxed">
          Thank you for joining our <span className="font-semibold">Bommel & Bebetta</span> newsletter.<br />
          Watch your inbox for fluffy updates and occasional giveaways!
        </p>
        <Link
          href="/"
          className="block bg-pink-400 hover:bg-pink-300 text-white font-bold py-3 rounded-full transition"
        >
          Back to Homepage
        </Link>
      </div>
    </main>
  )
}