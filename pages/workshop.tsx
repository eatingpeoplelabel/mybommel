// pages/zodiac.tsx
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const ZodiacMobile = dynamic(() => import('@/components/ZodiacMobile'), { ssr: false })
const ZodiacDesktop = dynamic(() => import('@/components/ZodiacDesktop'), { ssr: false })

export default function ZodiacPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile ? <ZodiacMobile /> : <ZodiacDesktop />
}
