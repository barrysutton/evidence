/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['arweave.net', 'assets.coingecko.com', 'ipfs.io'], // Add additional image domains as needed
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
              "script-src 'self' https://metamask.io https://walletconnect.com 'unsafe-inline' 'unsafe-eval';", // Added 'unsafe-eval' for compatibility with Web3 libraries
              "connect-src 'self' https://mainnet.infura.io https://rpc.walletconnect.com https://*.infura.io;", // Allow all Infura RPC endpoints
              "style-src 'self' 'unsafe-inline';",
              "img-src 'self' data: blob: https://arweave.net https://assets.coingecko.com https://ipfs.io;", // Include whitelisted image domains
              "frame-src 'self';",
            ].join(' '), // Join the policy into a single string
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;