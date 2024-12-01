import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    API_URL: process.env.API_URL || "https://e-learning-dashboard-pied.vercel.app",
  }
};

export default nextConfig;
