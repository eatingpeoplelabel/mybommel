import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const HowToMobile = dynamic(() => import('../components/HowToMobile'))
const HowToDesktop = dynamic(() => import('../components/HowToDesktop'))

export default function HowToBommel() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      <Head>
        <title>How to Make a Bommel – Pom-Pom Crafting Guide</title>
        <meta name="description" content="Learn how to make your very own Bommel with our step-by-step guide and video tutorial. Get fluffy and creative today!" />
        <meta name="keywords" content="bommel, pompom, how to make bommel, crafting, fluffy pompom" />
        <meta property="og:title" content="How to Make a Bommel – Pom-Pom Crafting Guide" />
        <meta property="og:description" content="Learn how to make your very own Bommel with our step-by-step guide and video tutorial. Get fluffy and creative today!" />
        <meta property="og:image" content="https://mybommel.com/og-how-to-bommel.jpg" />
        <meta property="og:url" content="https://mybommel.com/how-to-bommel" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://mybommel.com/how-to-bommel" />
      </Head>
      {isMobile ? <HowToMobile /> : <HowToDesktop />}
    </>
  )
}
