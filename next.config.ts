import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = withBundleAnalyzer({
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL || "http://localhost:3000", // Ensures environment variables like API_URL are available
  },
  // Define redirects
  async redirects() {
    return [
      {
        source: "/dashboard", // Redirect "/dashboard" to "/dashboard/student"
        destination: "/dashboard/student",
        permanent: true, // Use permanent redirect for SEO
      },
      {
        source: "/", // Redirect root "/" to "/dashboard/student"
        destination: "/dashboard/student",
        permanent: true, // Use permanent redirect for SEO
      },
    ];
  },
});

export default nextConfig;
