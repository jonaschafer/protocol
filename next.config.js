/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Exclude archive and local directories from webpack compilation
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/protocol-archive/**',
        '**/protocol-archive-old/**',
        '**/protocol-local/**',
        '**/swoletron-archive/**',
      ],
    }
    return config
  },
}

module.exports = nextConfig



