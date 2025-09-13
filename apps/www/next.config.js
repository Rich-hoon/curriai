import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.clerk.dev', 'img.clerk.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: '**.clerk.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/app/:path*',
        destination: '/app/:path*',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
