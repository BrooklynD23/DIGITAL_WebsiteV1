import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/data/siteConfig';

const base = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Internal stakeholder hub — already noindex and absent from the sitemap.
      disallow: ['/review'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
