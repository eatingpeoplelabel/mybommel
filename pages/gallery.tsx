// pages/gallery.tsx
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

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

  return isMobile ? <GalleryMobile /> : <GalleryDesktop />
}
