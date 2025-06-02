'use client'

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

const BommelGodPage: React.FC = () => {
  const router = useRouter();
  const handleBack = () => router.push("/");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const submit = async (): Promise<void> => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/api/bommel-god", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setShowAnimation(true);
      audioRef.current?.play();
      setTimeout(() => {
        setAnswer(data.answer);
        setShowAnimation(false);
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      setAnswer("Oops, something went wrong. Please try again!");
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <main className="relative min-h-screen flex items-end justify-center pb-[5vh] text-gray-800 overflow-hidden">

      {/* Desktop: Back to Home */}
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

      {/* Mobile: Hamburger Menu */}
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

      {/* Mobile: Drawer Menu */}
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

      {/* Background */}
      <div className="absolute inset-0 bg-godbg bg-cover bg-center bg-fixed filter brightness-110" />

      {/* Audio */}
      <audio ref={audioRef} src="/Hallelujah.mp3" preload="auto" />

      {/* Main Box */}
      <div className="relative z-10 px-12 py-4 bg-white bg-opacity-70 backdrop-blur-lg border-4 border-yellow-300 rounded-2xl shadow-2xl max-w-2xl w-11/12 transform scale-95 hover:scale-100 transition-all">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-yellow-800">Ask the Bommel God 🧶✨</h1>

        <textarea
          rows={2}
          className="w-full p-4 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-yellow-200 mb-6 text-gray-700 h-24"
          placeholder="Your question to the mighty Bommel God..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          className="w-full py-3 bg-yellow-400 text-white font-semibold rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-colors"
          onClick={submit}
          disabled={loading || showAnimation}
        >
          {loading ? 'Bommel God is pondering...' : showAnimation ? 'Revealing...' : 'Ask!'}
        </button>

        {showAnimation && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-5xl animate-pulse">✧ The Divine Word Arrives ✧</div>
          </div>
        )}

        {answer && (
          <div className="mt-8 p-6 bg-yellow-50 rounded-lg whitespace-pre-wrap animate-fade-in border-2 border-yellow-200">
            {answer}
          </div>
        )}
      </div>
    </main>
  );
};

export default BommelGodPage;
