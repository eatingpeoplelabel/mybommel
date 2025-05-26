import Head from 'next/head';
import Link from 'next/link';

export default function HowToMobile() {
  return (
    <div
      className="min-h-screen bg-cover bg-center px-4 pt-8 pb-16 flex flex-col items-center"
      style={{ backgroundImage: "url('/how-to-bommel-bg.webp')" }}
    >
      <Head>
        <title>How to Bommel</title>
      </Head>

      <img
        src="/header-how-to-bommel.webp"
        alt="How to Bommel Header"
        className="w-72 drop-shadow-lg mb-4"
      />

      <Link
        href="/"
        className="mb-6 bg-white text-blue-600 px-4 py-2 rounded-xl text-sm shadow-md"
      >
        ⬅ Back to Home
      </Link>

      <p className="text-center text-blue-400 font-semibold text-base mb-2">
        Watch my quick tutorial and make your very own Bommel today.
      </p>

      <div className="w-full aspect-video bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
        <span className="text-gray-500 italic text-sm">Video Placeholder (Coming Soon)</span>
      </div>
    </div>
  );
}
