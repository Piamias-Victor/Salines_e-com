import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    unoptimized: true, // Allow all external image URLs
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'praden.s3.eu-west-3.amazonaws.com',
        pathname: '/public/**',
      },
    ],
  },
};

export default nextConfig;
