import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { getToolContent } from '@/content';
import { buildMetadata } from '@/components/seo';
import { ToolPageTemplate } from '@/components/templates/ToolPageTemplate';
import { HijriDateTodayCalculator } from '@/components/calculators/HijriDateTodayCalculator';
import { HijriConverterCalculator } from '@/components/calculators/HijriConverterCalculator';
import { AgeCalculator } from '@/components/calculators/AgeCalculator';
import { GoldPriceHubPage } from '@/components/pages/GoldPriceHubPage';
import { ZakatCalculator } from '@/components/calculators/ZakatCalculator';
import { PregnancyCalculator } from '@/components/calculators/PregnancyCalculator';
import { EndOfServiceHubPage } from '@/components/pages/EndOfServiceHubPage';
import { PricesData } from '@/lib/gold';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return siteConfig.tools.map((tool) => ({
    slug: tool.slug,
  }));
}

function getBuildTimePrices(): PricesData {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public/data/prices.json'), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {
      updatedAt: new Date().toISOString(),
      xauUsdOz: 2685,
      xagUsdOz: 31.4,
      fx: { SAR: 3.75, AED: 3.67, EGP: 50.0, KWD: 0.31, QAR: 3.64, JOD: 0.709, IQD: 1310, OMR: 0.385, BHD: 0.376, MAD: 9.95 },
    };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = siteConfig.tools.find((t) => t.slug === slug);
  if (!tool) return {};

  const content = getToolContent(slug, 'en');
  return buildMetadata({
    slug,
    lang: 'en',
    customTitle: content?.metaTitle,
    customDescription: content?.metaDescription,
  });
}

export default async function EnglishToolPage({ params }: PageProps) {
  const { slug } = await params;
  const toolExists = siteConfig.tools.some((t) => t.slug === slug);
  if (!toolExists) {
    notFound();
  }

  // Mount specific interactive calculators
  let calculatorNode: React.ReactNode = undefined;
  if (slug === 'hijri-date-today') {
    calculatorNode = (
      <HijriDateTodayCalculator
        locale="en"
        initialBuildTimeDateIso={new Date().toISOString()}
      />
    );
  } else if (slug === 'hijri-converter') {
    calculatorNode = <HijriConverterCalculator locale="en" />;
  } else if (slug === 'age-calculator') {
    calculatorNode = <AgeCalculator locale="en" />;
  } else if (slug === 'gold-price') {
    calculatorNode = <GoldPriceHubPage initialPrices={getBuildTimePrices()} locale="en" />;
  } else if (slug === 'zakat-calculator') {
    calculatorNode = <ZakatCalculator locale="en" />;
  } else if (slug === 'pregnancy-calculator') {
    calculatorNode = <PregnancyCalculator locale="en" />;
  } else if (slug === 'end-of-service') {
    calculatorNode = <EndOfServiceHubPage locale="en" />;
  }

  return (
    <ToolPageTemplate
      slug={slug}
      locale="en"
      calculatorNode={calculatorNode}
    />
  );
}
