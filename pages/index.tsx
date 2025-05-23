import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

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

  return isMobile ? <MobileHome /> : <DesktopHome />
}
