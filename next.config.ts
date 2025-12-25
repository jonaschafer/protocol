import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {},
};

// @ts-ignore - next-pwa doesn't have TypeScript types
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

export default withPWA(nextConfig);
