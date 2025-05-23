import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const HowToMobile = dynamic(() => import('../components/HowToMobile'));
const HowToDesktop = dynamic(() => import('../components/HowToDesktop'));

export default function HowToBommel() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <HowToMobile /> : <HowToDesktop />;
}
