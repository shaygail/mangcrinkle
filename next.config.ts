import type { NextConfig } from "next";

function strapiRemotePattern() {
  const raw = process.env.STRAPI_URL?.replace(/\/+$/, "");
  if (!raw) return null;
  try {
    const { protocol, hostname, port } = new URL(raw);
    return {
      protocol: (protocol.replace(":", "") || "https") as "http" | "https",
      hostname,
      ...(port ? { port } : {}),
      pathname: "/uploads/**" as const,
    };
  } catch {
    return null;
  }
}

const strapiPattern = strapiRemotePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Railway-hosted Strapi media (covers current + future project URLs)
      {
        protocol: "https",
        hostname: "**.up.railway.app",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/uploads/**",
      },
      ...(strapiPattern ? [strapiPattern] : []),
    ],
  },
};

export default nextConfig;
