import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { HijriCalendarYearPage } from '@/components/pages/HijriCalendarYearPage';
import { buildMetadata } from '@/components/seo';

interface PageProps {
  params: Promise<{ year: string }>;
}

export function generateStaticParams() {
  return Array.from({ length: 16 }, (_, i) => ({
    year: String(1440 + i),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  const y = parseInt(year, 10);
  if (isNaN(y) || y < 1440 || y > 1455) {
    return {};
  }

  return buildMetadata({
    lang: 'en',
    slug: `hijri-calendar/${y}`,
    customTitle: `Hijri Calendar for ${y} AH with Gregorian Dates`,
    customDescription: `Complete Umm al-Qura Islamic calendar for the year ${y} AH, featuring all 12 lunar months and Ramadan and Eid Gregorian schedules.`,
  });
}

export default async function EnglishHijriCalendarYearRoute({ params }: PageProps) {
  const { year } = await params;
  const y = parseInt(year, 10);
  if (isNaN(y) || y < 1440 || y > 1455) {
    notFound();
  }

  return <HijriCalendarYearPage year={y} locale="en" />;
}
