/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["firebasestorage.googleapis.com", "embedsocial.com"],
  },
};

module.exports = nextConfig;
