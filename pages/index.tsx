// pages/index.tsx

import DesktopHome from '@/components/DesktopHome'
import MobileHome  from '@/components/MobileHome'
import useIsMobile from '@/lib/useIsMobile'

export default function Home() {
  const isMobile = useIsMobile(767)

  return isMobile
    ? <MobileHome />
    : <DesktopHome />
}
