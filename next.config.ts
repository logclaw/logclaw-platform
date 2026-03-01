import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Cloudflare Workers has no image optimizer
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Node.js 24's Edge Runtime V8 context blocks eval() calls.
      // Next.js dev mode defaults to eval-source-map which wraps every module
      // in eval() — switching to cheap-module-source-map avoids this.
      config.devtool = "cheap-module-source-map";
    }
    return config;
  },
};

export default nextConfig;
