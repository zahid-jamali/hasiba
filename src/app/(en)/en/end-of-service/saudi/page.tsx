import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo';
import { SaudiGratuitySubPage } from '@/components/pages/SaudiGratuitySubPage';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    lang: 'en',
    slug: 'end-of-service/saudi',
    customTitle: 'Saudi Arabia End of Service Calculator (Labor Law Art. 84/85) | Hasiba',
    customDescription:
      'Calculate Saudi end of service award in SAR according to Saudi Labor Law Articles 84, 85, and 87 with actual wages, housing/transport allowances, and resignation sliding scales.',
  });
}

export default function EnglishSaudiGratuityRoute() {
  return <SaudiGratuitySubPage locale="en" />;
}
