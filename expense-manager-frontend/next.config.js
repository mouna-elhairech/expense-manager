/** @type {import('next').NextConfig} */
const nextConfig = {
  // completely skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // completely skip TS errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
