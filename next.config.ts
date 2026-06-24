import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdns.rexsoftware.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  // pdfkit loads its standard PDF fonts (Helvetica, Times etc.) as `.afm`
  // files via `fs` at runtime; Next's bundler rewrites those paths and the
  // server bundle 500s with ENOENT. Opt out of bundling and let Node `require`
  // it natively — the auto-traced node_modules copy then resolves correctly.
  serverExternalPackages: ["pdfkit"],
  async redirects() {
    return [
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/properties", destination: "/buy", permanent: true },
    ];
  },
};

export default nextConfig;
