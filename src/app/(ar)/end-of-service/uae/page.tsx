import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo';
import { UaeGratuitySubPage } from '@/components/pages/UaeGratuitySubPage';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    lang: 'ar',
    slug: 'end-of-service/uae',
    customTitle: 'حساب مكافأة نهاية الخدمة في الإمارات وفق قانون العمل 2021 | حاسبة',
    customDescription:
      'احسب مكافأة نهاية الخدمة في دولة الإمارات بدقة للقطاع الخاص وفق المرسوم بقانون 33 لسنة 2021 (21/30 يوماً، بدون خصم استقالة، وسقف السنتين) بالدرهم الإماراتي.',
  });
}

export default function ArabicUaeGratuityRoute() {
  return <UaeGratuitySubPage locale="ar" />;
}
