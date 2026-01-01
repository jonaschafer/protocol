import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config) => {
    // Ignore cursor folder during build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/cursor/**', '**/node_modules/**'],
    };
    return config;
  },
};

// @ts-ignore - next-pwa doesn't have TypeScript types
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

export default withPWA(nextConfig);
