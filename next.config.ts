import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/tasks", destination: "/admin/tasks", permanent: true },
      { source: "/research", destination: "/admin/projects", permanent: true },
      { source: "/research/:slug", destination: "/admin/research/:slug", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
      { source: "/admin/documents", destination: "/admin/files", permanent: true },
      { source: "/admin/documents/:slug", destination: "/admin/files/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
