// File: next.config.mjs
import { join } from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ndyotwmnvtgriggchzri.supabase.co'],
  },
}

export default nextConfig
