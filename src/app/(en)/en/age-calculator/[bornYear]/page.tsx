import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AgeBornYearPage } from '@/components/pages/AgeBornYearPage';
import { buildMetadata } from '@/components/seo';

interface PageProps {
  params: Promise<{ bornYear: string }>;
}

export function generateStaticParams() {
  return Array.from({ length: 66 }, (_, i) => ({
    bornYear: `born-${1950 + i}`,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { bornYear } = await params;
  const match = bornYear.match(/^born-(\d{4})$/);
  if (!match) return {};
  const year = parseInt(match[1], 10);
  if (isNaN(year) || year < 1950 || year > 2015) {
    return {};
  }

  return buildMetadata({
    lang: 'en',
    slug: `age-calculator/${bornYear}`,
    customTitle: `How Old Am I If Born in ${year}? Exact Age & Hijri Age`,
    customDescription: `Calculate your exact age if born in ${year} in Gregorian and Hijri years, months, and days with a monthly breakdown table and birthday countdown.`,
  });
}

export default async function EnglishAgeBornYearRoute({ params }: PageProps) {
  const { bornYear } = await params;
  const match = bornYear.match(/^born-(\d{4})$/);
  if (!match) {
    notFound();
  }
  const year = parseInt(match[1], 10);
  if (isNaN(year) || year < 1950 || year > 2015) {
    notFound();
  }

  return <AgeBornYearPage year={year} locale="en" />;
}
