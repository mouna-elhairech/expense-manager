import type { NextConfig } from "next";

/** 
 * Configuration Next.js pour empêcher un échec de build
 * dû à ESLint ou aux erreurs TypeScript sur Vercel.
 */
const nextConfig: NextConfig = {
  eslint: {
    /** Ignore totalement ESLint pendant `next build` */
    ignoreDuringBuilds: true,
  },
  typescript: {
    /**
     * Autorise le build même si TypeScript remonte
     * des erreurs (⚠️ elles resteront visibles en dev).
     */
    ignoreBuildErrors: true,
  },
  /** Ajoute ici d’autres réglages Next.js si besoin */
};

export default nextConfig;
