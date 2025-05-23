// File: next.config.js
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ndyotwmnvtgriggchzri.supabase.co'],
  },
}

module.exports = nextConfig
