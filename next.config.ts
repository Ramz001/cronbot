import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  cacheLife: {
    custom: {
      stale: 60, // 1 seconds
      revalidate: 360, // 5 minutes
      expire: 600, // 10 minutes
    },
  },
}

export default nextConfig
