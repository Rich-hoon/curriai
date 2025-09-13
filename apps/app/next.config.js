import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@myapp/prisma'],
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
  env: {
    NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL: process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL,
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
  async redirects() {
    return [
      {
        source: '/',
        destination: '/app',
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
