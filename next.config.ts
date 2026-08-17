import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["reheat-varmint-dupe.ngrok-free.dev", "*.ngrok-free.dev"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "ngrok-skip-browser-warning", value: "true" },
        ],
      },
    ];
  },
};

export default nextConfig;
