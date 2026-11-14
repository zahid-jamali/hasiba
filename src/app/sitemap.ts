import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { GOLD_COUNTRIES, GoldCountryCode } from '@/lib/gold';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.baseUrl;
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Helper to push paired ar/en route
  const addRoute = (
    pathWithoutSlashes: string,
    options: {
      priority: number;
      changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
      lastModified?: Date;
    }
  ) => {
    const clean = pathWithoutSlashes.replace(/^\/+|\/+$/g, '');
    const arUrl = clean ? `${baseUrl}/${clean}/` : `${baseUrl}/`;
    const enUrl = clean ? `${baseUrl}/en/${clean}/` : `${baseUrl}/en/`;
    const lastModified = options.lastModified || now;

    // Arabic entry
    entries.push({
      url: arUrl,
      lastModified,
      changeFrequency: options.changeFrequency,
      priority: options.priority,
      alternates: {
        languages: {
          ar: arUrl,
          en: enUrl,
          'x-default': arUrl,
        },
      },
    });

    // English entry
    entries.push({
      url: enUrl,
      lastModified,
      changeFrequency: options.changeFrequency,
      priority: options.priority,
      alternates: {
        languages: {
          ar: arUrl,
          en: enUrl,
          'x-default': arUrl,
        },
      },
    });
  };

  // 1. Home
  addRoute('', { priority: 1.0, changeFrequency: 'daily' });

  // 2. Main Tools
  for (const tool of siteConfig.tools) {
    const isDaily = tool.slug === 'gold-price' || tool.slug === 'hijri-date-today';
    addRoute(tool.slug, {
      priority: 0.9,
      changeFrequency: isDaily ? 'daily' : 'weekly',
    });
  }

  // 3. End of Service sub-pages
  addRoute('end-of-service/uae', { priority: 0.85, changeFrequency: 'weekly' });
  addRoute('end-of-service/saudi', { priority: 0.85, changeFrequency: 'weekly' });

  // 4. Gold country sub-pages (10 countries)
  const countryCodes = Object.keys(GOLD_COUNTRIES) as GoldCountryCode[];
  for (const country of countryCodes) {
    addRoute(`gold-price/${country}`, { priority: 0.85, changeFrequency: 'daily' });
  }

  // 5. Age Calculator born-year pages (1950 - 2015: 66 years)
  for (let year = 1950; year <= 2015; year++) {
    addRoute(`age-calculator/born-${year}`, { priority: 0.75, changeFrequency: 'monthly' });
  }

  // 6. Hijri Calendar year pages (1440 - 1455 AH: 16 years)
  for (let y = 1440; y <= 1455; y++) {
    addRoute(`hijri-calendar/${y}`, { priority: 0.75, changeFrequency: 'monthly' });
  }

  // 7. Non-tool site pages
  const staticPages = [
    'about',
    'methodology',
    'contact',
    'privacy-policy',
    'terms',
    'disclaimer',
  ];

  for (const page of staticPages) {
    addRoute(page, { priority: 0.5, changeFrequency: 'monthly' });
  }

  return entries;
}
