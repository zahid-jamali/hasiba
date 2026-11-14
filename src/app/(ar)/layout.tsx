import type { Metadata } from 'next';
import Script from 'next/script';
import '../globals.css';
import { ibmPlexArabic } from '@/config/fonts';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/config/site';
import { DigitsProvider } from '@/context/DigitsContext';
import { SiteJsonLd } from '@/components/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${siteConfig.name.ar} - ${siteConfig.description.ar}`,
    template: `%s | ${siteConfig.name.ar}`,
  },
  description: siteConfig.description.ar,
  alternates: {
    canonical: '/',
    languages: {
      ar: '/',
      en: '/en/',
    },
  },
};

export default function ArabicRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexArabic.variable}>
      <body className="antialiased font-sans min-h-screen flex flex-col bg-[#fafaf7] dark:bg-[#07150f] text-slate-900 dark:text-slate-100 transition-colors">
        <SiteJsonLd locale="ar" />
        <DigitsProvider locale="ar">
          <Header locale="ar" />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer locale="ar" />
        </DigitsProvider>

        {/* Google AdSense (Production only) */}
        {process.env.NODE_ENV === 'production' && siteConfig.adsenseId && (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseId}`}
          />
        )}

        {/* Cloudflare Web Analytics (Production only) */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
          <Script
            id="cf-beacon"
            strategy="afterInteractive"
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN })}
          />
        )}
      </body>
    </html>
  );
}
