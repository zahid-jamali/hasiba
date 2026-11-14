import React from 'react';
import { JsonLd } from './JsonLd';
import { Locale } from '@/i18n/types';
import { siteConfig } from '@/config/site';

interface SiteJsonLdProps {
  locale: Locale;
}

export const SiteJsonLd: React.FC<SiteJsonLdProps> = ({ locale }) => {
  const url = locale === 'en' ? `${siteConfig.baseUrl}/en/` : `${siteConfig.baseUrl}/`;

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name[locale],
    url: url,
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
    description: siteConfig.description[locale],
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name[locale],
      url: siteConfig.baseUrl,
      logo: `${siteConfig.baseUrl}${siteConfig.logo}`,
      parentOrganization: {
        '@type': 'Organization',
        name: siteConfig.parent.name[locale],
        url: siteConfig.parent.url,
        logo: `${siteConfig.baseUrl}${siteConfig.parent.logo}`,
      },
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name[locale],
    url: siteConfig.baseUrl,
    logo: `${siteConfig.baseUrl}${siteConfig.logo}`,
    parentOrganization: {
      '@type': 'Organization',
      name: siteConfig.parent.name[locale],
      url: siteConfig.parent.url,
      logo: `${siteConfig.baseUrl}${siteConfig.parent.logo}`,
    },
  };

  return <JsonLd data={[websiteSchema, organizationSchema]} />;
};
