// lib/useIsMobile.ts
import { useEffect, useState } from 'react'

export default function useIsMobile(breakpoint = 767) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    setIsMobile(mq.matches)
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [breakpoint])

  return isMobile
}
