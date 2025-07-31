/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:5003/api/v1/:path*',
      },
    ];
  },
  // Bundle analyzer for optimization
  ...(process.env.ANALYZE === 'true' && {
    experimental: {
      bundleAnalyzer: true,
    },
  }),
}

module.exports = nextConfig
