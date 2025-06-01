import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const RegisterMobile = dynamic(() => import('@/components/RegisterMobile'))
const RegisterDesktop = dynamic(() => import('@/components/RegisterDesktop'))

export default function RegisterPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(/iPhone|Android|Mobile/i.test(navigator.userAgent))
  }, [])

  return isMobile ? <RegisterMobile /> : <RegisterDesktop />
}
