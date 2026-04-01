import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Turbopack configuration
  turbopack: {
    // Resolve extensions
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    // Module aliases
    resolveAlias: {
      '@': './src',
    },
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Disable image optimization in dev for faster builds
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Experimental features
  experimental: {
    // Enable faster refresh
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns', '@tanstack/react-query'],
  },

  // Compiler options for faster builds
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Strict mode for React 19
  reactStrictMode: true,

  // Powered by header
  poweredByHeader: false,
}

export default nextConfig
