/** @type {import('next').NextConfig} */
const nextConfig = {
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
  },
}

module.exports = nextConfig