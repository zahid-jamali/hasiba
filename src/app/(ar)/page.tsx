import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';
import { buildMetadata } from '@/components/seo';

export const metadata: Metadata = buildMetadata({
  lang: 'ar',
  customTitle: 'حاسبة – أدوات حساب مجانية بالعربية',
  customDescription: 'موقع حاسبة - أدوات وحسابات مجانية دقيقة وسريعة للعالم العربي ودول الخليج',
});

export default function ArabicHomePage() {
  return <HomePage locale="ar" />;
}
