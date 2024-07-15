/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", '@repo/bff'],
  rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: `http://localhost:3001/:path*`,
        },
      ]
    }

    return []
  },
};

module.exports = nextConfig