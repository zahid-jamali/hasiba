import type { Metadata } from 'next';
import { UiPreviewPage } from '@/components/pages/UiPreviewPage';

export const metadata: Metadata = {
  title: 'معاينة مكونات الواجهة | حاسبة',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ArabicUiPreviewRoute() {
  return <UiPreviewPage locale="ar" />;
}
