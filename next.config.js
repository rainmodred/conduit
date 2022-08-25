/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.imgur.com', 'api.realworld.io', 'cloudflare-ipfs.com'],
  },
};

module.exports = nextConfig;
