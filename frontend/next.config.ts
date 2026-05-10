import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: '30mb',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kilbigroztzhceqbnbxj.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*', // Assume Backend runs on 3000
      },
    ];
  },
};

export default nextConfig;
