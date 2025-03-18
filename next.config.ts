import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow images from any HTTPS source
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Explicitly set the React configuration to use webpack
  serverExternalPackages: [],
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
