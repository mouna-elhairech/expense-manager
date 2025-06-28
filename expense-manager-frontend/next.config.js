/** @type {import('next').NextConfig} */
const nextConfig = {
  // ignore ESLint errors during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ignore TypeScript type errors during production builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // vos autres options ici…
};

module.exports = nextConfig;
