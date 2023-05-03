/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["*", "gateway.ipfs.io", "ipfs.moralis.io"],
  },
};

module.exports = nextConfig;
