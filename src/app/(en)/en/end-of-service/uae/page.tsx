import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo';
import { UaeGratuitySubPage } from '@/components/pages/UaeGratuitySubPage';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    lang: 'en',
    slug: 'end-of-service/uae',
    customTitle: 'UAE End of Service Gratuity Calculator (Decree-Law 33/2021) | Hasiba',
    customDescription:
      'Calculate UAE private sector end of service gratuity accurately in AED under Federal Decree-Law No. 33 of 2021 with 21/30 day tiers, 0% resignation reduction, and 2-year cap.',
  });
}

export default function EnglishUaeGratuityRoute() {
  return <UaeGratuitySubPage locale="en" />;
}
