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
    lang: 'ar',
    slug: `hijri-calendar/${y}`,
    customTitle: `التقويم الهجري لعام ${y} هـ وجدول الأشهر بالميلادي`,
    customDescription: `جدول التقويم الهجري لعام ${y} هـ وفق تقويم أم القرى مع مواعيد بداية شهر رمضان وعيد الفطر وعيد الأضحى بالتقويم الميلادي.`,
  });
}

export default async function ArabicHijriCalendarYearRoute({ params }: PageProps) {
  const { year } = await params;
  const y = parseInt(year, 10);
  if (isNaN(y) || y < 1440 || y > 1455) {
    notFound();
  }

  return <HijriCalendarYearPage year={y} locale="ar" />;
}
