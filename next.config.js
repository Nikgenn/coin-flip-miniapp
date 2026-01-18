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
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.base.org https://*.coinbase.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
