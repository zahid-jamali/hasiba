import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { GoldPriceCountryPage } from '@/components/pages/GoldPriceCountryPage';
import { buildMetadata } from '@/components/seo';
import { GOLD_COUNTRIES, GoldCountryCode, PricesData } from '@/lib/gold';

interface PageProps {
  params: Promise<{ country: string }>;
}

export function generateStaticParams() {
  return (Object.keys(GOLD_COUNTRIES) as GoldCountryCode[]).map((country) => ({
    country,
  }));
}

interface HistoryRecord {
  date: string;
  xauUsdOz: number;
  xagUsdOz: number;
  fx: Record<string, number>;
}

function loadPricesData(): { prices: PricesData; history: HistoryRecord[] } {
  try {
    const dataDir = path.join(process.cwd(), 'public/data');
    const pricesRaw = fs.readFileSync(path.join(dataDir, 'prices.json'), 'utf-8');
    const historyRaw = fs.readFileSync(path.join(dataDir, 'prices-history.json'), 'utf-8');
    return {
      prices: JSON.parse(pricesRaw),
      history: JSON.parse(historyRaw),
    };
  } catch {
    return {
      prices: {
        updatedAt: new Date().toISOString(),
        xauUsdOz: 2685,
        xagUsdOz: 31.4,
        fx: { SAR: 3.75, AED: 3.67, EGP: 50.0, KWD: 0.31, QAR: 3.64, JOD: 0.709, IQD: 1310, OMR: 0.385, BHD: 0.376, MAD: 9.95 },
      },
      history: [],
    };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const config = GOLD_COUNTRIES[country as GoldCountryCode];
  if (!config) return {};

  return buildMetadata({
    lang: 'en',
    slug: `gold-price/${country}`,
    customTitle: `Gold Price Today in ${config.name.en} (${config.currency}) & Making Fees`,
    customDescription: `Live gold prices today in ${config.name.en} for 24K, 22K, 21K, 18K, ounce and silver with making charge calculator and 30-day price trend chart.`,
  });
}

export default async function EnglishGoldPriceCountryRoute({ params }: PageProps) {
  const { country } = await params;
  const config = GOLD_COUNTRIES[country as GoldCountryCode];
  if (!config) {
    notFound();
  }

  const { prices, history } = loadPricesData();

  return (
    <GoldPriceCountryPage
      countryCode={country as GoldCountryCode}
      initialPrices={prices}
      initialHistory={history}
      locale="en"
    />
  );
}
