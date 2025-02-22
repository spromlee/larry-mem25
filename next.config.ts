/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.firebasestorage.app',
        port: '',
        pathname: '/v0/b/**',
      },
    ],
    domains: [
      'firebasestorage.googleapis.com'
    ],
    unoptimized: true,
  },
}

export default config