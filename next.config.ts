import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdns.rexsoftware.com",
      },
    ],
  },
};

export default nextConfig;
