/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      // Writing-section cover images come from the startaitools RSS feed.
      { protocol: 'https', hostname: 'startaitools.com' },
      { protocol: 'https', hostname: 'www.startaitools.com' },
    ],
  },
};

export default nextConfig;
