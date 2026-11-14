import React from 'react';
import { JsonLd } from './JsonLd';
import { Locale } from '@/i18n/types';
import { siteConfig, ToolConfig } from '@/config/site';
import { FaqItem } from '@/content/types';

interface ToolJsonLdProps {
  slug: string;
  tool: ToolConfig;
  locale: Locale;
  title: string;
  description: string;
  faqs?: FaqItem[];
}

export const ToolJsonLd: React.FC<ToolJsonLdProps> = ({
  slug,
  tool,
  locale,
  title,
  description,
  faqs = [],
}) => {
  const pageUrl =
    locale === 'en'
      ? `${siteConfig.baseUrl}/en/${slug}/`
      : `${siteConfig.baseUrl}/${slug}/`;

  const homeUrl = locale === 'en' ? `${siteConfig.baseUrl}/en/` : `${siteConfig.baseUrl}/`;

  // Map category to Schema.org application category
  let appCategory = 'UtilitiesApplication';
  if (tool.category === 'money') appCategory = 'FinanceApplication';
  if (tool.category === 'health') appCategory = 'HealthApplication';

  // 1. WebApplication Schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    url: pageUrl,
    applicationCategory: appCategory,
    operatingSystem: 'Any',
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
    description: description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: siteConfig.name[locale],
      url: siteConfig.baseUrl,
      logo: `${siteConfig.baseUrl}${siteConfig.logo}`,
    },
  };

  // 2. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'ar' ? 'الرئيسية' : 'Home',
        item: homeUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.category,
        item: `${homeUrl}#${tool.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: pageUrl,
      },
    ],
  };

  // 3. FAQPage Schema (only if faqs exist)
  const schemas: Record<string, unknown>[] = [webAppSchema, breadcrumbSchema];

  if (faqs.length > 0) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    };
    schemas.push(faqSchema);
  }

  return <JsonLd data={schemas} />;
};
