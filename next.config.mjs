// next.config.mjs (ESM)
const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://34.45.41.209:4000/api/:path*' },
      { source: '/health', destination: 'http://34.45.41.209:4000/health' },
      { source: '/docs', destination: 'http://34.45.41.209:4000/docs' },
    ];
  },
};

export default nextConfig;
