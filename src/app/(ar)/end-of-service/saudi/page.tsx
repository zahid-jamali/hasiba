import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo';
import { SaudiGratuitySubPage } from '@/components/pages/SaudiGratuitySubPage';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    lang: 'ar',
    slug: 'end-of-service/saudi',
    customTitle: 'حساب مكافأة نهاية الخدمة في السعودية (نظام العمل م/84 و85) | حاسبة',
    customDescription:
      'احسب مكافأة نهاية الخدمة في المملكة العربية السعودية بدقة وفق نظام العمل (المواد 84 و85 و87) مع احتساب الأجر الفعلي والبدلات وشرائح الاستقالة بالريال السعودي.',
  });
}

export default function ArabicSaudiGratuityRoute() {
  return <SaudiGratuitySubPage locale="ar" />;
}
