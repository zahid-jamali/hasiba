import type { Metadata } from 'next';
import { UiPreviewPage } from '@/components/pages/UiPreviewPage';

export const metadata: Metadata = {
  title: 'UI Components Preview | Hasiba',
  robots: {
    index: false,
    follow: false,
  },
};

export default function EnglishUiPreviewRoute() {
  return <UiPreviewPage locale="en" />;
}
