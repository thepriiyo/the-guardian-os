import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/result/'],
    },
    sitemap: 'https://the-guardian-os.vercel.app/sitemap.xml',
  };
}
