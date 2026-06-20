import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/data/siteConfig';

const base = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
