/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",   // Removed to support API routes for backend proxy
  reactStrictMode: true,
  images: {
    unoptimized: true // optional: needed if using <Image> without external domains
  },
};

module.exports = nextConfig;
