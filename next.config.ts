import type { NextConfig } from "next";
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  i18n,
};

module.exports = nextConfig;
