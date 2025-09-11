import type { NextConfig } from "next";

// Production-ready configuration with React Strict Mode
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Server-side packages
  serverExternalPackages: ['better-sqlite3', 'drizzle-orm', 'puppeteer'],
  
  // Enable strict mode for production
  reactStrictMode: true,
  
  // Development indicators
  devIndicators: {
    position: 'bottom-right',
  },
  
  // Enhanced error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  
  // Webpack configuration for production
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Enable source maps in production mode
      config.devtool = 'source-map';
    }
    return config;
  },
};

export default nextConfig;