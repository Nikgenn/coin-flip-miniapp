/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Разрешаем загрузку изображений с внешних источников
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Настройки для безопасности iframe (Base Mini App загружается в iframe)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Allow embedding in Base App, Farcaster clients, and preview tools
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.base.org https://*.base.dev https://*.coinbase.com https://*.farcaster.xyz https://farcaster.xyz https://warpcast.com https://*.warpcast.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
