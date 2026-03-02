/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "w-img.b-cdn.net",
        port: "",
      },
    ],
  },
  headers: async () => [
    {
      source: "/shop/:path*",
      headers: [{ key: "CDN-Cache-Control", value: "max-age=60" }],
    },
    {
      source: "/music/:path*",
      headers: [{ key: "CDN-Cache-Control", value: "max-age=60" }],
    },
    {
      source: "/tour",
      headers: [{ key: "CDN-Cache-Control", value: "max-age=30" }],
    },
  ],
};

export default nextConfig;
