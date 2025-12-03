import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Capacitor builds
  // Use `npm run build:native` for iOS/Android builds
  output: process.env.BUILD_TARGET === 'native' ? 'export' : undefined,

  // Images need to be unoptimized for static export
  images: {
    unoptimized: process.env.BUILD_TARGET === 'native',
  },

  // Trailing slash helps with static file routing
  trailingSlash: process.env.BUILD_TARGET === 'native',
};

export default nextConfig;
