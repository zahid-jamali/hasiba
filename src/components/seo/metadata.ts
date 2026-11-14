import type { Metadata } from 'next';
import { Locale } from '@/i18n/types';
import { siteConfig } from '@/config/site';

interface BuildMetadataOptions {
  slug?: string;
  lang: Locale;
  customTitle?: string;
  customDescription?: string;
  noindex?: boolean;
}

const KNOWN_OG_SLUGS = new Set([
  'hijri-date-today',
  'hijri-converter',
  'age-calculator',
  'gold-price',
  'zakat-calculator',
  'end-of-service',
  'pregnancy-calculator',
]);

export function buildMetadata({
  slug,
  lang,
  customTitle,
  customDescription,
  noindex = false,
}: BuildMetadataOptions): Metadata {
  const isHome = !slug;

  // Resolve base tool config if slug exists
  const tool = slug ? siteConfig.tools.find((t) => t.slug === slug) : undefined;

  let rawTitle =
    customTitle ||
    (tool ? tool.name[lang] : siteConfig.name[lang]);

  const rawDescription =
    customDescription ||
    (tool ? tool.description[lang] : siteConfig.description[lang]);

  // Append site name if not home and under limit
  if (!isHome && !rawTitle.includes(siteConfig.name[lang])) {
    const combined = `${rawTitle} | ${siteConfig.name[lang]}`;
    if (combined.length <= 60) {
      rawTitle = combined;
    }
  }

  // Ensure title <= 60 chars
  const title =
    rawTitle.length > 60 ? `${rawTitle.substring(0, 57)}...` : rawTitle;

  // Ensure description <= 155 chars
  const description =
    rawDescription.length > 155
      ? `${rawDescription.substring(0, 152)}...`
      : rawDescription;

  // Build absolute canonical and mirrored hreflang URLs with trailing slash
  const cleanSlug = slug ? slug.replace(/^\/+|\/+$/g, '') : '';
  const arUrl = cleanSlug
    ? `${siteConfig.baseUrl}/${cleanSlug}/`
    : `${siteConfig.baseUrl}/`;

  const enUrl = cleanSlug
    ? `${siteConfig.baseUrl}/en/${cleanSlug}/`
    : `${siteConfig.baseUrl}/en/`;

  const canonicalUrl = lang === 'en' ? enUrl : arUrl;
  const ogLocale = lang === 'ar' ? 'ar_SA' : 'en_US';

  // Determine tool OG image
  const baseSlug = cleanSlug ? cleanSlug.split('/')[0] : 'default';
  const ogFile = KNOWN_OG_SLUGS.has(baseSlug) ? baseSlug : 'default';
  const ogImageUrl = `${siteConfig.baseUrl}/og/${ogFile}.png`;

  // Google Search Console verification meta tag (only if set)
  const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
  const verification = gscVerification ? { google: gscVerification } : undefined;

  return {
    title,
    description,
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: arUrl,
        en: enUrl,
        'x-default': arUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name[lang],
      locale: ogLocale,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    verification,
  };
}
