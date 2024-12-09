/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['arweave.net'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)', // Apply headers to all routes
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' https://metamask.io https://walletconnect.com 'unsafe-inline';", // Replace with actual domains
              "connect-src 'self' https://mainnet.infura.io https://rpc.walletconnect.com;", // Replace with actual domains
              "style-src 'self' 'unsafe-inline';",
              "img-src 'self' data: blob:;",
            ].join(' '), // Join the policy into a single string
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;