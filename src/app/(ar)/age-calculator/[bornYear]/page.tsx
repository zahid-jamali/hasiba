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
    lang: 'ar',
    slug: `age-calculator/${bornYear}`,
    customTitle: `كم عمري إذا كنت مواليد ${year}؟ حساب العمر بالهجري والميلادي`,
    customDescription: `احسب عمر مواليد عام ${year} بالتفصيل بالسنوات والأشهر والأيام بالتقويمين الهجري والميلادي مع جدول الأعمار حسب شهر الميلاد وموعد يوم ميلادك القادم.`,
  });
}

export default async function ArabicAgeBornYearRoute({ params }: PageProps) {
  const { bornYear } = await params;
  const match = bornYear.match(/^born-(\d{4})$/);
  if (!match) {
    notFound();
  }
  const year = parseInt(match[1], 10);
  if (isNaN(year) || year < 1950 || year > 2015) {
    notFound();
  }

  return <AgeBornYearPage year={year} locale="ar" />;
}
