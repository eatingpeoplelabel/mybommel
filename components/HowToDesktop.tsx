import Head from 'next/head';
import Link from 'next/link';

export default function HowToDesktop() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/how-to-bommel-bg.webp')" }}
    >
      <Head>
        <title>How to Bommel</title>
      </Head>

      <Link
        href="/"
        className="fixed top-4 left-4 z-50"
      >
        <img
          src="/back-to-home.webp"
          alt="Back to Home"
          className="w-24 h-auto cursor-pointer"
        />
      </Link>

      <div
        className="absolute z-20"
        style={{ top: '2%', left: '65%', transform: 'translate(-50%, 0)' }}
      >
        <img
          src="/header-how-to-bommel.webp"
          alt="How to Bommel Header"
          className="w-auto max-w-xs scale-130 drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
        />
      </div>

      <div
        className="absolute z-10 pointer-events-none"
        style={{ bottom: '-5%', left: '5%' }}
      >
        <img
          src="/Bebettawirftbommel.webp"
          alt="Bebetta wirft Bommel"
          className="w-[500px] h-auto animate-wiggle-slow"
        />
      </div>

      <div
        className="absolute z-20 pointer-events-none"
        style={{ bottom: '58%', left: '5%' }}
      >
        <img
          src="/bommeliam.webp"
          alt="I bommel, therefore I am."
          className="w-64 h-auto scale-50 drop-shadow-[0_8px_10px_rgba(0,0,0,0.6)]"
        />
      </div>

      <main className="container mx-auto px-4 py-12">
        <section
          className="absolute z-20 text-center bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-2 inline-block"
          style={{ top: '26%', left: '65%', transform: 'translateX(-50%)' }}
        >
          <p className="text-blue-300 text-lg md:text-xl font-semibold drop-shadow-lg whitespace-nowrap">
            Watch my quick tutorial and make your very own Bommel today.
          </p>
          <p className="text-lg md:text-xl font-semibold text-pink-500 drop-shadow-lg">
            Ready to fluff?
          </p>
        </section>

        <div
          className="absolute z-20"
          style={{ top: '40%', left: '65%', transform: 'translate(-50%, 0)', width: '40%' }}
        >
          <div className="w-full aspect-video bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
            <span className="text-gray-500 italic">Video Placeholder (Coming Soon)</span>
          </div>
        </div>
      </main>
    </div>
  );
}
