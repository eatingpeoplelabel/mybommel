import ZodiacMobile from '@/components/ZodiacMobile'
import ZodiacDesktop from '@/components/ZodiacDesktop'
import useIsMobile from '@/lib/useIsMobile'

export default function ZodiacPage() {
  // viewport width < 768px considered mobile
  const isMobile = useIsMobile(767)

  return (
    <>
      {isMobile ? <ZodiacMobile /> : <ZodiacDesktop />}
    </>
  )
}