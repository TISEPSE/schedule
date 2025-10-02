import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  // Exclure les modules serveur du bundle client (nouvelle syntaxe Next.js 15)
  serverExternalPackages: ['better-sqlite3', 'drizzle-orm', 'puppeteer']
};

export default nextConfig;
