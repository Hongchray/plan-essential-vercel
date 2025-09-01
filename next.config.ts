import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "theapka.com",
      },
      {
        protocol: "https",
        hostname: "focuzsolution.com",
      },
    ],
  },
};

export default nextConfig;
