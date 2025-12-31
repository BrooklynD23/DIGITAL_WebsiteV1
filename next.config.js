/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use 'export' for static builds (npm run build), but allow dev server to work
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  trailingSlash: true,
  images: {
    // Note: Static export requires unoptimized images.
    // For optimized images in production, consider:
    // 1. Using a CDN with image optimization (Cloudinary, imgix, Vercel)
    // 2. Pre-optimizing images at build time with tools like sharp
    // 3. Deploying to Vercel which handles image optimization automatically
    unoptimized: true,
    // Define allowed image sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Define allowed image formats
    formats: ['image/webp', 'image/avif'],
  },
  // Improve performance with strict mode
  reactStrictMode: true,
  // Optimize production builds
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
