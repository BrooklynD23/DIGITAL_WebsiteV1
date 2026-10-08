import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/data/siteConfig';

const base = (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url).replace(/\/$/, '');

// Exactly the indexable pages. Redirect stubs (/pillars/, /projects/, the old project and lab URLs) are noindex
// and stay out. Trailing slashes match `trailingSlash: true` in next.config.js.
const routes = [
  '/',
  '/projects/sidekick/',
  '/projects/shades/',
  '/projects/brain/',
  '/about/',
  '/team/',
  '/community/',
  '/get-involved/',
  '/contact/',
  '/privacy/',
  '/terms/',
  '/cookies/',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));
}
