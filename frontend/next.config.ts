import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  // Add this transpilePackages option to fix the "export *" error
  transpilePackages: ['framer-motion']
};

export default nextConfig;