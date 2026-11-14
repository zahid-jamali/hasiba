import { IBM_Plex_Sans_Arabic, Inter } from 'next/font/google';

export const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  weight: ['400', '600', '700'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
