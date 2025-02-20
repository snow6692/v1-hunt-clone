import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
     
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      
      },
    ],
  },
};

export default nextConfig;
