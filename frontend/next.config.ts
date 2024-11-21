import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        // protocol: "https",
        // hostname: "api.xgpt.io.vn",
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**/*",
      },
    ],
  },
};

export default nextConfig;
