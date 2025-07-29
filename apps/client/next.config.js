/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
      return [
        {
          source: '/api/v1/:path*',
          destination: 'http://localhost:5003/api/v1/:path*',
        },
      ];
    },
  }

module.exports = nextConfig
