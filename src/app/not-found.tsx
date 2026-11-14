import React from 'react';
import Link from 'next/link';
import './globals.css';
import { ibmPlexArabic } from '@/config/fonts';

export default function GlobalNotFound() {
  const tools = [
    { ar: 'حساب العمر', en: 'Age Calculator', hrefAr: '/age-calculator/', hrefEn: '/en/age-calculator/', icon: '⏳' },
    { ar: 'التاريخ الهجري اليوم', en: 'Hijri Date Today', hrefAr: '/hijri-date-today/', hrefEn: '/en/hijri-date-today/', icon: '📅' },
    { ar: 'سعر الذهب اليوم', en: 'Gold Price Today', hrefAr: '/gold-price/', hrefEn: '/en/gold-price/', icon: '🪙' },
    { ar: 'حاسبة الزكاة', en: 'Zakat Calculator', hrefAr: '/zakat-calculator/', hrefEn: '/en/zakat-calculator/', icon: '⚖️' },
    { ar: 'مكافأة نهاية الخدمة', en: 'End of Service', hrefAr: '/end-of-service/', hrefEn: '/en/end-of-service/', icon: '💼' },
    { ar: 'حاسبة الحمل', en: 'Pregnancy Calculator', hrefAr: '/pregnancy-calculator/', hrefEn: '/en/pregnancy-calculator/', icon: '👶' },
  ];

  return (
    <html lang="ar" dir="rtl" className={ibmPlexArabic.variable}>
      <head>
        <title>404 - الصفحة غير موجودة · Page Not Found | Hasiba</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="antialiased font-sans min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <main className="flex-1 flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-black text-2xl border border-brand-200 dark:border-brand-800">
              404
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">
              الصفحة غير موجودة · Page Not Found
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              عذراً، الصفحة التي تبحث عنها غير متوفرة. يمكنك اختيار أحد الروابط أدناه للعودة إلى الصفحة الرئيسية أو إحدى حاسباتنا.
              <br />
              <span className="text-sm">Sorry, the page you requested cannot be found. Choose an option below.</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-sm bg-brand-700 hover:bg-brand-800 text-white transition-all shadow-sm active:scale-[0.99] min-h-[44px]"
              >
                الرئيسية (العربية)
              </Link>
              <Link
                href="/en/"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-all min-h-[44px]"
              >
                Home (English)
              </Link>
            </div>
          </div>

          <div className="w-full pt-8 border-t border-slate-200 dark:border-slate-800 text-start space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 text-center">
              الحاسبات الأكثر استخداماً · Popular Calculators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {tools.map((t, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{t.icon}</span>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{t.ar}</div>
                      <div className="text-xs text-slate-500">{t.en}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <Link href={t.hrefAr} className="text-brand-700 hover:underline">
                      عربي
                    </Link>
                    <span className="text-slate-300">|</span>
                    <Link href={t.hrefEn} className="text-brand-700 hover:underline">
                      EN
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
