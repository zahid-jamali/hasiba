import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/HomePage';
import { buildMetadata } from '@/components/seo';

export const metadata: Metadata = buildMetadata({
  lang: 'en',
  customTitle: 'Hasiba – Free Arabic & Gulf Calculators',
  customDescription: 'Free, fast, and accurate online calculators for the Arab world and Gulf region',
});

export default function EnglishHomePage() {
  return <HomePage locale="en" />;
}
