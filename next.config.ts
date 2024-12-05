/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['arweave.net'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
