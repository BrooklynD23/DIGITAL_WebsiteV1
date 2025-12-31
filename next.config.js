/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use 'export' for static builds (npm run build), but allow dev server to work
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
