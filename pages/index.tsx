import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Head from 'next/head'

const DesktopHome = dynamic(() => import('@/components/DesktopHome'), { ssr: false })
const MobileHome = dynamic(() => import('@/components/MobileHome'), { ssr: false })
import useIsMobile from '@/lib/useIsMobile'

export default function Home() {
  const isMobile = useIsMobile(767)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <Head>
        <title>Bommel.com – Join the Fluffdom</title>
        <meta name="description" content="The official home of all Bommels! Register your fluff, explore the gallery, and meet the divine Bommel God." />
        <meta name="keywords" content="bommel, pompom, gallery, workshop, bebetta, zodiac, register your bommel, fluff" />
        <meta property="og:title" content="Bommel.com – The Fluffiest Place on the Web" />
        <meta property="og:description" content="Create and register your own Bommel, discover others, and receive a majestic certificate from the Bommel God." />
        <meta property="og:image" content="https://mybommel.com/og-preview.jpg" />
        <meta property="og:url" content="https://mybommel.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://mybommel.com/" />
      </Head>

      {isMobile ? <MobileHome /> : <DesktopHome />}
    </>
  )
}
