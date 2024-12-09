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
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval';
              connect-src 'self' https://*.infura.io https://*.alchemyapi.io https://ethereum.metamask.io;
              frame-src 'self' 'unsafe-inline' https://connect.trezor.io https://verify.walletconnect.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              font-src 'self' data:;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;