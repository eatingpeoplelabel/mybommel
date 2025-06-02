import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Head from 'next/head'

const RegisterMobile = dynamic(() => import('@/components/RegisterMobile'))
const RegisterDesktop = dynamic(() => import('@/components/RegisterDesktop'))

export default function RegisterPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(/iPhone|Android|Mobile/i.test(navigator.userAgent))
  }, [])

  return (
    <>
      <Head>
        <title>Register Your Bommel – Join the Grand Fluffdom</title>
        <meta
          name="description"
          content="Create and register your very own Bommel! Join our fluffy community and get a unique Bommel number."
        />
        <meta name="keywords" content="register bommel, pompom registration, fluffy community, bommel number" />
        <meta property="og:title" content="Register Your Bommel – Join the Grand Fluffdom" />
        <meta
          property="og:description"
          content="Create and register your very own Bommel! Join our fluffy community and get a unique Bommel number."
        />
        <meta property="og:image" content="https://mybommel.com/og-register.jpg" />
        <meta property="og:url" content="https://mybommel.com/register" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://mybommel.com/register" />
      </Head>

      {isMobile ? <RegisterMobile /> : <RegisterDesktop />}
    </>
  )
}
