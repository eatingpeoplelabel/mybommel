import Head from "next/head";
import Link from "next/link";

export default function BetreutesBommelnLanding() {
  return (
    <>
      <Head>
        <title>Betreutes Bommeln – Retreat Presentation</title>
        <meta
          name="description"
          content="Interactive Bommel keynote presentations for the Betreutes Bommeln / Bommel Retreat."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-pink-100 via-amber-50 to-sky-100 flex items-center justify-center px-4 py-10">
        <div className="max-w-3xl w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100 px-6 py-8 sm:px-10 sm:py-10 relative overflow-hidden">

          {/* Bommel-Bubbles (Deko) */}
          <div className="pointer-events-none absolute -top-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-tr from-pink-300 via-orange-200 to-yellow-200 opacity-70 blur-sm" />
          <div className="pointer-events-none absolute -bottom-16 -right-4 w-44 h-44 rounded-full bg-gradient-to-tr from-sky-200 via-purple-200 to-pink-200 opacity-70 blur-sm" />

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.2em] text-pink-500 mb-3">
              Bommel Retreat
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-3">
              Betreutes&nbsp;
              <span className="text-pink-500">Bommeln</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-700 mb-6">
              Hier könnt ihr unsere{" "}
              <span className="font-medium">interaktive Retreat-Präsentation</span>{" "}
              öffnen – wahlweise auf Deutsch oder auf Englisch.  
              Mit Videos, Bommel-Vibes und sehr viel Liebe. 💖
            </p>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-xs sm:text-sm text-pink-700 border border-pink-100">
              <span className="inline-block w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              Beste Erfahrung auf Desktop, Ton an empfohlen 🎧
            </div>

            {/* Language Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

              {/* German */}
              <div className="rounded-2xl border border-pink-100 bg-white/80 px-4 py-5 sm:px-5 sm:py-6 shadow-md">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-1">
                  Version
                </p>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  🇩🇪 Deutsch
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                    Betreutes Bommeln
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mb-4">
                  Präsentation für deutschsprachige Teilnehmer:innen.
                  Fokus auf Workshop, Flow und Bommel-Magie.
                </p>
                <Link
                  href="/presentations/betreutesbommeln/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-pink-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-pink-200 hover:bg-pink-600 transition-colors"
                >
                  🌈 Deutsche Präsentation starten
                </Link>
              </div>

              {/* English */}
              <div className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-5 sm:px-5 sm:py-6 shadow-md">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-1">
                  Version
                </p>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  🇬🇧 English
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                    Bommel Retreat
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mb-4">
                  Presentation for international partners & guests.
                  Same fluff, same magic – just in English.
                </p>
                <Link
                  href="/presentations/bommelretreat/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-sky-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-sky-200 hover:bg-sky-600 transition-colors"
                >
                  ✨ Open English presentation
                </Link>
              </div>

            </div>

            <div className="mt-8 text-[11px] sm:text-xs text-slate-500 leading-relaxed">
              <p>
                Wenn etwas nicht lädt: Tab neu öffnen oder einen anderen Browser
                probieren. Manchmal tanzen die Bommels ein bisschen aus der Reihe.
              </p>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
