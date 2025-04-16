/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
      {
        protocol: 'http',
        hostname: '*',
      },
    ],
    domains: ['images.unsplash.com', 'imgur.com', 'i.imgur.com'],
  },
};

module.exports = nextConfig;
