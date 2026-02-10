import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/tasks", destination: "/admin/tasks", permanent: true },
      { source: "/research", destination: "/admin/research", permanent: true },
      { source: "/research/:slug", destination: "/admin/research/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
