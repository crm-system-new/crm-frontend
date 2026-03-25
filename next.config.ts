import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        // Proxy all /bff/* requests to the BFF service
        // Local: http://localhost:8085, Docker: http://bff:8085, Production: your BFF URL
        source: "/bff/:path*",
        destination: `${process.env.BFF_INTERNAL_URL || "http://localhost:8085"}/bff/:path*`,
      },
    ];
  },
};

export default nextConfig;
