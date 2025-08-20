import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    // Exclure better-sqlite3 du bundle client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
      };
    }
    
    return config;
  },
  // Exclure les modules serveur du bundle client
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3', 'drizzle-orm']
  }
};

export default nextConfig;
