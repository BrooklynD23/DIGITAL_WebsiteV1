import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/data/siteConfig';

// Next 15+: metadata routes need this under output: 'export'.
export const dynamic = 'force-static';

const base = (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url).replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
