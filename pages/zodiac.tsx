import Head from 'next/head'
import ZodiacMobile from '@/components/ZodiacMobile'
import ZodiacDesktop from '@/components/ZodiacDesktop'
import useIsMobile from '@/lib/useIsMobile'

export default function ZodiacPage() {
  const isMobile = useIsMobile(767)

  return (
    <>
      <Head>
        <title>Bommel Horoscope – Discover Your Fluffy Zodiac</title>
        <meta
          name="description"
          content="Find out your Bommel zodiac sign and what it means for your fluffy life!"
        />
        <meta property="og:title" content="Bommel Horoscope – Discover Your Fluffy Zodiac" />
        <meta
          property="og:description"
          content="Find out your Bommel zodiac sign and what it means for your fluffy life!"
        />
        <meta property="og:url" content="https://mybommel.com/zodiac" />
        <meta property="og:image" content="https://mybommel.com/og-zodiac.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://mybommel.com/zodiac" />
      </Head>

      {isMobile ? <ZodiacMobile /> : <ZodiacDesktop />}
    </>
  )
}
