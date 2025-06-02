import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const GalleryMobile = dynamic(() => import('../components/GalleryMobile'))
const GalleryDesktop = dynamic(() => import('../components/GalleryDesktop'))

export default function GalleryPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (typeof window === 'undefined') return null

  return (
    <>
      <Head>
        <title>Bommel Gallery – Discover the Fluffiest Bommels</title>
        <meta
          name="description"
          content="Browse the gallery of all registered Bommels in the Grand Fluffdom. Explore unique fluffiness from around the world."
        />
        <meta name="keywords" content="bommel gallery, pompom gallery, fluffy bommel photos, bommel community" />
        <meta property="og:title" content="Bommel Gallery – Discover the Fluffiest Bommels" />
        <meta
          property="og:description"
          content="Browse the gallery of all registered Bommels in the Grand Fluffdom. Explore unique fluffiness from around the world."
        />
        <meta property="og:image" content="https://mybommel.com/og-gallery.jpg" />
        <meta property="og:url" content="https://mybommel.com/gallery" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://mybommel.com/gallery" />
      </Head>

      {isMobile ? <GalleryMobile /> : <GalleryDesktop />}
    </>
  )
}
