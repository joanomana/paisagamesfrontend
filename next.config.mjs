const BACKEND = process.env.BACKEND_ORIGIN || 'http://localhost:4000';

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
        { source: '/api/:path*', destination: `${BACKEND}/api/:path*` },
        { source: '/health', destination: `${BACKEND}/health` },
        { source: '/docs', destination: `${BACKEND}/docs` },
        ];
    },
};

export default nextConfig;
