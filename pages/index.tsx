import { useEffect, useState } from 'react'
import DesktopHome from '@/components/DesktopHome'
import MobileHome from '@/components/MobileHome'
import useIsMobile from '@/lib/useIsMobile'

export default function Home() {
  const [show, setShow] = useState(false)
  const isMobile = useIsMobile(767)

  useEffect(() => {
    setShow(true)
  }, [])

  if (!show) return null

  return isMobile ? <MobileHome /> : <DesktopHome />
}
