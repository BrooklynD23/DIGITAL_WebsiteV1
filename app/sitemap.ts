import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/data/siteConfig';

const base = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;

const routes = [
  '/',
  '/about',
  '/pillars',
  '/projects',
  '/projects/modular-smartphone',
  '/projects/smart-reading',
  '/team',
  '/contact',
  '/get-involved',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));
}
