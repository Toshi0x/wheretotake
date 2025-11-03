/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'example.com',
    ],
  },
  async redirects() {
    return [
      { source: '/collections', destination: '/reviews', permanent: true },
      { source: '/collections/:slug*', destination: '/reviews?q=:slug', permanent: true },
    ]
  }
};

module.exports = nextConfig;
