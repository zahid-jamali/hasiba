import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import fs from 'node:fs';
import path from 'node:path';
import { Locale } from '@/i18n/types';
import { getDictionary } from '@/i18n';
import { siteConfig, ToolConfig } from '@/config/site';
import { AdSlot } from '@/components/ui/AdSlot';
import { DigitsPreferenceToggle } from '@/components/ui/DigitsPreferenceToggle';
import { FaqAccordion, FaqItem } from '@/components/ui/FaqAccordion';
import {
  gregorianToHijri,
  getHijriMonthName,
  getWeekdayName,
  GREGORIAN_MONTH_NAMES_AR,
  GREGORIAN_MONTH_NAMES_EN,
} from '@/lib/hijri';
import { calculateGoldPrices, PricesData } from '@/lib/gold';

interface HomePageProps {
  locale: Locale;
}

function getBuildTimePrices(): PricesData {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), 'public/data/prices.json'),
      'utf-8'
    );
    return JSON.parse(raw);
  } catch {
    return {
      updatedAt: new Date().toISOString(),
      xauUsdOz: 2685.4,
      xagUsdOz: 31.42,
      fx: {
        SAR: 3.75,
        AED: 3.6725,
        EGP: 53.437,
        KWD: 0.3113,
        QAR: 3.64,
        JOD: 0.709,
        IQD: 1514.27,
        OMR: 0.3845,
        BHD: 0.376,
        MAD: 9.8884,
      },
    };
  }
}

function renderToolIcon(slug: string) {
  switch (slug) {
    case 'hijri-date-today':
      return (
        <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <circle cx="12" cy="15" r="2" />
        </svg>
      );
    case 'hijri-converter':
      return (
        <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 21h5v-5" />
        </svg>
      );
    case 'age-calculator':
      return (
        <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'gold-price':
      return (
        <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 3h12l4 6-10 12L2 9z" />
          <path d="M2 9h20" />
          <path d="M12 21 8.5 9 10 3" />
          <path d="m12 21 3.5-12L14 3" />
        </svg>
      );
    case 'zakat-calculator':
      return (
        <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10" />
          <path d="M12 3v18" />
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
      );
    case 'end-of-service':
      return (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case 'pregnancy-calculator':
      return (
        <svg className="w-6 h-6 text-rose-500 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <line x1="9" y1="9" x2="15" y2="15" />
          <line x1="15" y1="9" x2="9" y2="15" />
        </svg>
      );
  }
}

export const HomePage: React.FC<HomePageProps> = ({ locale }) => {
  const t = getDictionary(locale);
  const now = new Date();

  // 1. Calculate live today Hijri date
  const hijriToday = gregorianToHijri(now);
  const hijriMonthName = getHijriMonthName(hijriToday.month, locale);
  const weekdayName = getWeekdayName(hijriToday.weekday, locale);
  const gregorianDay = now.getUTCDate();
  const gregorianMonthName =
    locale === 'ar'
      ? GREGORIAN_MONTH_NAMES_AR[now.getUTCMonth()]
      : GREGORIAN_MONTH_NAMES_EN[now.getUTCMonth()];
  const gregorianYear = now.getUTCFullYear();

  // 2. Calculate live gold 21K prices for Saudi Arabia, UAE, and Egypt
  const pricesData = getBuildTimePrices();
  const saudiPrices = calculateGoldPrices(pricesData, 'SAR');
  const uaePrices = calculateGoldPrices(pricesData, 'AED');
  const egyptPrices = calculateGoldPrices(pricesData, 'EGP');

  const getToolUrl = (slug: string) => {
    return locale === 'en' ? `/en/${slug}/` : `/${slug}/`;
  };

  const getCategoryTitle = (category: ToolConfig['category']) => {
    return t.categories[category];
  };

  const groupedTools = {
    dates: siteConfig.tools.filter((t) => t.category === 'dates'),
    money: siteConfig.tools.filter((t) => t.category === 'money'),
    health: siteConfig.tools.filter((t) => t.category === 'health'),
  };

  // 5 FAQ items
  const faqItems: FaqItem[] =
    locale === 'ar'
      ? [
          {
            question: 'هل موقع حاسبة مجاني بنسبة 100%؟',
            answer:
              'نعم، جميع الأدوات والحاسبات في حاسبة مجانية بالكامل ومتاحة لجميع الزوار دون الحاجة إلى إنشاء حساب أو تسجيل دخول أو دفع أي رسوم اشتراك، ونعتمد على الإعلانات غير المزعجة لتغطية تكاليف التشغيل.',
          },
          {
            question: 'ما مدى دقة الحسابات والنتائج المقدمة؟',
            answer:
              'تمت مراجعة وبرمجة كافة المعادلات الرياضية بدقة متناهية وفقاً للمصادر واللوائح الرسمية؛ كأنظمة العمل الصادرة عن وزارة الموارد البشرية والتنمية الاجتماعية السعودية وقانون العمل الاتحادي الإماراتي، وأحكام الفقه الإسلامي المعتمدة لحساب أنصبة الزكاة، والمعايير السريرية العالمية للكلية الأمريكية لأطباء النساء والتوليد (ACOG) ومنظمة الصحة العالمية.',
          },
          {
            question: 'أي تقويم هجري يعتمده الموقع؟',
            answer:
              'يعتمد موقع حاسبة تقويم أم القرى الرسمي المعتمد في المملكة العربية السعودية، والمبني على حسابات فلكية ومعايير دولية دقيقة متطابقة مع الحسابات الشرعية المعتمدة في دول مجلس التعاون الخليجي.',
          },
          {
            question: 'هل يحفظ موقع حاسبة بياناتي المالية أو تاريخ ميلادي؟',
            answer:
              'إطلاقاً. تتم جميع العمليات الحسابية بنسبة 100% داخل متصفحك المحلي (Client-side execution)، ولا يتم إرسال أي تاريخ ميلاد أو أرقام رواتب أو مدخرات مالية إلى خوادمنا على الإطلاق، حفاظاً على أقصى درجات الخصوصية والأمان التام لبياناتك الشخصية.',
          },
          {
            question: 'من يقف وراء موقع حاسبة؟',
            answer:
              'موقع حاسبة هو أحد المشاريع الرقمية التابعة لشبكة زيتاوالا (Zetawala Network)، المتخصصة في بناء أدوات رقمية مجانية وموثوقة وعالية السرعة لخدمة المستخدم العربي والمقيمين في منطقة الخليج العربي والشرق الأوسط.',
          },
        ]
      : [
          {
            question: 'Is Hasiba 100% free to use?',
            answer:
              'Yes, every single calculator and tool on Hasiba is completely free with zero hidden fees. There is never any need to register, create an account, or pay subscription costs.',
          },
          {
            question: 'How accurate are the calculators and formulas?',
            answer:
              'All calculation formulas are audited against official regulatory sources, including UAE Federal Decree-Law No. 33 of 2021, the Saudi Labor Law (Articles 84, 85, 87), classical Islamic Fiqh standards and ZATCA guidelines for Zakat Nisab, and ACOG/WHO clinical protocols for obstetrics.',
          },
          {
            question: 'Which calendar standard is used for Hijri dates?',
            answer:
              'Hasiba uses the official Saudi Umm al-Qura calendar standard (via Intl.DateTimeFormat with en-u-ca-islamic-umalqura), ensuring precision and consistency with GCC civil and religious dates.',
          },
          {
            question: 'Does Hasiba store personal financial or birth data?',
            answer:
              'No. All calculations are executed 100% locally in your client web browser. No birthdates, salary amounts, or financial inputs are ever transmitted to or stored on remote servers.',
          },
          {
            question: 'Who runs and maintains Hasiba?',
            answer:
              'Hasiba is engineered and maintained as part of the Zetawala network of free digital utilities, dedicated to offering fast, private, and localized digital tools for the Arab world and Gulf region.',
          },
        ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
      {/* Hero section */}
      <header className="text-center max-w-3xl mx-auto pt-2 pb-2 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-xs font-bold text-brand-800 dark:text-brand-300">
          <span>{siteConfig.parent.badgeText[locale]}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
          {locale === 'ar'
            ? 'حاسبة – أدوات حساب مجانية بالعربية'
            : 'Hasiba – Free Arabic & Gulf Calculators'}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          {locale === 'ar'
            ? 'مجموعة متكاملة من الحاسبات الدقيقة والذكية للعالم العربي ودول الخليج: التاريخ الهجري، أسعار الذهب، مكافأة نهاية الخدمة، الزكاة، وحساب العمر بدقة وسرعة وبلا تسجيل.'
            : 'A comprehensive suite of accurate, fast online calculators for the Arab world and GCC: Hijri calendar, live gold prices, end of service gratuity, Zakat, age, and pregnancy with zero signup.'}
        </p>

        {/* Digits Toggle for Arabic users */}
        <div className="pt-2 flex justify-center">
          <DigitsPreferenceToggle locale={locale} />
        </div>
      </header>

      {/* Live Featured Widgets: Hijri Date & 21K Gold Prices */}
      <section
        aria-label={locale === 'ar' ? 'بيانات حية ومباشرة' : 'Live Daily Data'}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* Widget 1: Today's Hijri Date */}
        <div className="rounded-2xl border border-brand-200 dark:border-brand-900/60 bg-gradient-to-br from-white to-brand-50/40 dark:from-slate-900 dark:to-brand-950/20 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-200">
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
                {locale === 'ar' ? 'التاريخ الهجري اليوم' : 'Hijri Date Today'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {locale === 'ar' ? 'تقويم أم القرى' : 'Umm al-Qura Standard'}
              </span>
            </div>

            <div className="space-y-1 my-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {weekdayName}، {hijriToday.day} {hijriMonthName} {hijriToday.year} {locale === 'ar' ? 'هـ' : 'AH'}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {locale === 'ar' ? 'الموافق ميلادياً:' : 'Gregorian equivalent:'}{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {gregorianDay} {gregorianMonthName} {gregorianYear}
                </span>
              </div>
            </div>
          </div>

          <Link
            href={getToolUrl('hijri-date-today')}
            className="mt-4 inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-slate-700/60 transition-colors min-h-[44px]"
          >
            <span>{locale === 'ar' ? 'عرض التقويم الهجري والمناسبات الإسلامية' : 'View Full Hijri Calendar & Events'}</span>
            <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>
          </Link>
        </div>

        {/* Widget 2: Today's 21K Gold Prices */}
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-white to-amber-50/40 dark:from-slate-900 dark:to-amber-950/20 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                {locale === 'ar' ? 'سعر الذهب عيار 21 اليوم' : "Today's 21K Gold Prices"}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {locale === 'ar' ? 'تحديث دوري' : 'Live Spot Index'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 my-3">
              {/* Saudi Arabia */}
              <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1">
                  <span>🇸🇦</span>
                  <span className="truncate">{locale === 'ar' ? 'السعودية' : 'Saudi'}</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {saudiPrices['21K'].toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {locale === 'ar' ? 'ر.س' : 'SAR'}
                </div>
              </div>

              {/* UAE */}
              <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1">
                  <span>🇦🇪</span>
                  <span className="truncate">{locale === 'ar' ? 'الإمارات' : 'UAE'}</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {uaePrices['21K'].toLocaleString(locale === 'ar' ? 'ar-AE' : 'en-US')}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {locale === 'ar' ? 'د.إ' : 'AED'}
                </div>
              </div>

              {/* Egypt */}
              <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1">
                  <span>🇪🇬</span>
                  <span className="truncate">{locale === 'ar' ? 'مصر' : 'Egypt'}</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                  {egyptPrices['21K'].toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {locale === 'ar' ? 'ج.م' : 'EGP'}
                </div>
              </div>
            </div>
          </div>

          <Link
            href={getToolUrl('gold-price')}
            className="mt-4 inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-700/60 transition-colors min-h-[44px]"
          >
            <span>{locale === 'ar' ? 'استعراض أسعار كافة العيارات والبلدان' : 'Explore All Karats, Bullion & Countries'}</span>
            <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>
          </Link>
        </div>
      </section>

      {/* Ad slot below Hero */}
      <AdSlot minHeight={90} />

      {/* Categories and Tools Grid */}
      <div className="space-y-14">
        {(['dates', 'money', 'health'] as const).map((categoryKey) => {
          const categoryTools = groupedTools[categoryKey];
          if (categoryTools.length === 0) return null;

          return (
            <section key={categoryKey} id={categoryKey} className="scroll-mt-24 space-y-5">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                  <span className="w-2.5 h-6 rounded-full bg-brand-600"></span>
                  <span>{getCategoryTitle(categoryKey)}</span>
                </h2>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {categoryTools.length} {locale === 'ar' ? 'حاسبات متخصصة' : 'calculators'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryTools.map((tool) => {
                  const toolI18n = t.tools[tool.slug as keyof typeof t.tools];
                  return (
                    <Link
                      key={tool.slug}
                      href={getToolUrl(tool.slug)}
                      className="group flex flex-col justify-between p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-500 dark:hover:border-brand-500 transition-all min-h-[160px]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            {renderToolIcon(tool.slug)}
                          </div>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-100 dark:border-brand-900/40">
                            {toolI18n?.badge || tool.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {toolI18n?.title || tool.name[locale]}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {toolI18n?.description || tool.description[locale]}
                        </p>
                      </div>

                      <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-brand-700 dark:text-brand-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                        <span>{locale === 'ar' ? 'استخدم الحاسبة الآن' : 'Launch calculator'}</span>
                        <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Brand Identity & Zetawala Parent Block */}
      <section
        aria-label={locale === 'ar' ? 'عن شبكة زيتاوالا' : 'About Zetawala Network'}
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 flex items-center justify-center shrink-0 shadow-sm">
              <Image
                src={siteConfig.parent.logo}
                alt={siteConfig.parent.name[locale]}
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                <span>{siteConfig.parent.badgeText[locale]}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                {locale === 'ar'
                  ? 'حاسبة هي جزء من شبكة زيتاوالا للأدوات المجانية'
                  : 'Hasiba is part of the Zetawala Free Utilities Network'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {locale === 'ar'
                  ? 'تلتزم شبكة زيتاوالا (Zetawala) بتقديم أدوات رقمية وحسابية مجانية بالكامل، عالية السرعة، وبلا تسجيل دخول أو جمع للبيانات الشخصية، لخدمة الملايين من المستخدمين في المملكة العربية السعودية، والإمارات، ومصر، وسائر العالم العربي.'
                  : 'Zetawala is dedicated to developing zero-registration, privacy-first, ultra-fast online utilities that empower millions of users across Saudi Arabia, UAE, Egypt, and the wider Arab diaspora.'}
              </p>
            </div>
          </div>

          <a
            href={siteConfig.parent.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm bg-brand-700 hover:bg-brand-800 text-white transition-all shadow-sm active:scale-[0.99] shrink-0 min-h-[44px]"
          >
            {siteConfig.parent.visitText[locale]}
          </a>
        </div>
      </section>

      {/* 5 FAQ items about the site */}
      <section className="space-y-6">
        <FaqAccordion
          items={faqItems}
          title={
            locale === 'ar'
              ? 'الأسئلة الشائعة حول موقع حاسبة'
              : 'Frequently Asked Questions about Hasiba'
          }
        />
      </section>

      {/* Bottom Ad slot */}
      <AdSlot minHeight={250} />
    </div>
  );
};
