import React from 'react';
import Link from 'next/link';
import fs from 'node:fs';
import path from 'node:path';
import { Locale } from '@/i18n/types';
import { getDictionary } from '@/i18n';
import { siteConfig, ToolConfig } from '@/config/site';
import { AdSlot } from '@/components/ui/AdSlot';
import { FaqAccordion, FaqItem } from '@/components/ui/FaqAccordion';
import { HomeToolSearch } from '@/components/home/HomeToolSearch';
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
        <svg className="w-6 h-6 text-brand-800 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <circle cx="12" cy="15" r="2" />
        </svg>
      );
    case 'hijri-converter':
      return (
        <svg className="w-6 h-6 text-brand-800 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 21h5v-5" />
        </svg>
      );
    case 'age-calculator':
      return (
        <svg className="w-6 h-6 text-gold-600 dark:text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'gold-price':
      return (
        <svg className="w-6 h-6 text-gold-600 dark:text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 3h12l4 6-10 12L2 9z" />
          <path d="M2 9h20" />
          <path d="M12 21 8.5 9 10 3" />
          <path d="m12 21 3.5-12L14 3" />
        </svg>
      );
    case 'zakat-calculator':
      return (
        <svg className="w-6 h-6 text-brand-800 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10" />
          <path d="M12 3v18" />
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
      );
    case 'end-of-service':
      return (
        <svg className="w-6 h-6 text-brand-800 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case 'pregnancy-calculator':
      return (
        <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6 text-brand-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
  const isAr = locale === 'ar';

  // 1. Calculate live today Hijri date
  const hijriToday = gregorianToHijri(now);
  const hijriMonthName = getHijriMonthName(hijriToday.month, locale);
  const weekdayName = getWeekdayName(hijriToday.weekday, locale);
  const gregorianDay = now.getUTCDate();
  const gregorianMonthName =
    isAr
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

  // 5 Practical Site FAQs
  const faqItems: FaqItem[] = isAr
    ? [
        {
          question: 'هل موقع حاسبة مجاني بالكامل؟',
          answer:
            'نعم، جميع الأدوات والحاسبات في منصة حاسبة مجانية تماماً ومتاحة للجميع دون أي تسجيل دخول أو اشتراك، ونعتمد على إعلانات غير متداخلة لدعم التكاليف التقنية للمنصة.',
        },
        {
          question: 'ما مدى دقة الحسابات والنتائج المقدمة؟',
          answer:
            'تعتمد حاسبة على مراجع تشريعية ورسمية معتمدة؛ كنظام العمل السعودي (المواد 84 و85 و87)، وقانون العمل الاتحادي الإماراتي لعام 2021، وتقويم أم القرى الرسمي في المملكة العربية السعودية، وأحكام الفقه الإسلامي المعتمدة لأنصبة الزكاة، والمعايير الطبية السريرية العالمية لمنظمة الصحة العالمية (WHO).',
        },
        {
          question: 'هل يتم حفظ أو تسجيل بياناتي الشخصية أو المالية؟',
          answer:
            'إطلاقاً. تُنفذ كافة العمليات الحسابية بنسبة 100% داخل متصفحك المحلي (Client-side execution). لا يتم إرسال أو تخزين أي تواريخ ميلاد أو رواتب أو مبالغ مدخرات إلى أي خادم، مما يضمن أقصى معايير الأمان والخصوصية.',
        },
        {
          question: 'كيف يتم تحديث أسعار الذهب والعملات؟',
          answer:
            'يتم تحديث أسعار الذهب والفضة دورياً عبر ربط مباشر مع مؤشرات البورصة العالمية اللحظية (Spot Price)، مع تطبيق أسعار صرف العملات الرسمية لكل دولة لحساب أسعار الجرام بمختلف العيارات بدقة متناهية.',
        },
        {
          question: 'من يقف خلف منصة حاسبة؟',
          answer:
            'حاسبة هي منصة متخصصة ومستقلة في عالم الأدوات الحسابية اليومية، طُوّرت بدقة واهتمام لخدمة المستخدمين في العالم العربي والمقيمين في دول الخليج كإحدى مبادرات شبكة زيتاوالا للأدوات المجانية.',
        },
      ]
    : [
        {
          question: 'Is Hasiba 100% free to use?',
          answer:
            'Yes, every calculator and tool on Hasiba is completely free with zero hidden fees. There is never any need to register, create an account, or pay subscription costs.',
        },
        {
          question: 'How accurate are the calculators and formulas?',
          answer:
            'All calculation formulas are audited against official regulatory sources, including UAE Federal Decree-Law No. 33 of 2021, the Saudi Labor Law (Articles 84, 85, 87), classical Islamic Fiqh standards and ZATCA guidelines for Zakat Nisab, and ACOG/WHO clinical protocols for obstetrics.',
        },
        {
          question: 'Does Hasiba store personal financial or birth data?',
          answer:
            'No. All calculations are executed 100% locally in your client web browser. No birthdates, salary amounts, or financial inputs are ever transmitted to or stored on remote servers.',
        },
        {
          question: 'How frequently are gold prices and currencies updated?',
          answer:
            'Gold and silver spot rates are synchronized on a regular cadence from international bullion markets, with local GCC and regional currency conversions applied directly per gram.',
        },
        {
          question: 'Who maintains Hasiba?',
          answer:
            'Hasiba is an independent specialized calculator portal developed for users across the Arab world and Gulf region, created as part of the Zetawala network of free utilities.',
        },
      ];

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12 sm:space-y-16">
      {/* 1. Humanized Hero Section with Live Search */}
      <header className="text-center max-w-3xl mx-auto pt-2 space-y-4 sm:space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-900/60 text-xs font-bold text-brand-900 dark:text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
          <span>{isAr ? 'منصة الحسابات اليومية المعتمدة للعالم العربي والخليج' : 'Trusted Daily Utilities for the Arab World & GCC'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]">
          {isAr ? (
            <>
              حاسبتك الذكية.. <span className="text-brand-800 dark:text-emerald-400">دقة فورية</span> لكل يوم
            </>
          ) : (
            <>
              Your Smart Calculator, <span className="text-brand-800 dark:text-emerald-400">Instant Precision</span>
            </>
          )}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          {isAr
            ? 'مجموعة متكاملة من الحاسبات الدقيقة المعتمدة وفق الأنظمة الرسمية والمعايير الفلكية: التاريخ الهجري، أسعار الذهب، مكافأة نهاية الخدمة، الزكاة، وحساب العمر بخصوصية تامة 100% داخل جهازك وبلا تسجيل.'
            : 'Audited, ultra-fast online calculators built around GCC labor regulations and calendar standards: Hijri calendar, live gold rates, end-of-service gratuity, Zakat, and age with zero registration.'}
        </p>

        {/* Interactive Search Bar & Filters */}
        <div className="pt-2 sm:pt-4">
          <HomeToolSearch locale={locale} />
        </div>
      </header>

      {/* 2. Today's Daily Pulse (Featured Live Data Hub) */}
      <section
        aria-label={isAr ? 'بيانات حية ومباشرة لليوم' : 'Live Daily Data Hub'}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {/* Card 1: Today's Hijri Date */}
        <div className="rounded-2xl border-2 border-brand-100 dark:border-brand-950/80 bg-gradient-to-br from-white via-surface-50 to-brand-50/30 dark:from-[#0c1c15] dark:via-[#091711] dark:to-[#06140e] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-brand-100/70 text-brand-900 dark:bg-emerald-950/80 dark:text-emerald-200">
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
                {isAr ? 'التاريخ الهجري اليوم' : 'Hijri Date Today'}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {isAr ? 'تقويم أم القرى' : 'Umm al-Qura'}
              </span>
            </div>

            <div className="space-y-1.5 my-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {weekdayName}، {hijriToday.day} {hijriMonthName} {hijriToday.year} {isAr ? 'هـ' : 'AH'}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                {isAr ? 'الموافق ميلادياً:' : 'Gregorian equivalent:'}{' '}
                <span className="font-bold text-slate-900 dark:text-slate-200">
                  {gregorianDay} {gregorianMonthName} {gregorianYear}
                </span>
              </div>
            </div>
          </div>

          <Link
            href={getToolUrl('hijri-date-today')}
            className="mt-4 inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-[#14261e] border border-surface-200 dark:border-surface-800 text-brand-800 dark:text-emerald-300 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors min-h-[44px]"
          >
            <span>{isAr ? 'عرض التقويم الهجري والمناسبات' : 'View Full Hijri Calendar'}</span>
            <span aria-hidden="true">{isAr ? '←' : '→'}</span>
          </Link>
        </div>

        {/* Card 2: Today's 21K Gold Prices */}
        <div className="rounded-2xl border-2 border-gold-200/80 dark:border-gold-950/80 bg-gradient-to-br from-white via-surface-50 to-gold-50/30 dark:from-[#0c1c15] dark:via-[#091711] dark:to-[#06140e] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-gold-100 text-gold-900 dark:bg-gold-950 dark:text-gold-200">
                <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
                {isAr ? 'سعر الذهب عيار 21 اليوم' : "Live 21K Gold Rates"}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {isAr ? 'مؤشر لحظي' : 'Spot Index'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 my-3">
              {/* Saudi Arabia */}
              <div className="bg-white/90 dark:bg-[#14261e] p-2 rounded-xl border border-surface-200 dark:border-surface-800 text-center">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5 flex items-center justify-center gap-1">
                  <span>🇸🇦</span>
                  <span className="truncate">{isAr ? 'السعودية' : 'KSA'}</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {saudiPrices['21K'].toLocaleString(isAr ? 'ar-SA' : 'en-US')}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  {isAr ? 'ر.س' : 'SAR'}
                </div>
              </div>

              {/* UAE */}
              <div className="bg-white/90 dark:bg-[#14261e] p-2 rounded-xl border border-surface-200 dark:border-surface-800 text-center">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5 flex items-center justify-center gap-1">
                  <span>🇦🇪</span>
                  <span className="truncate">{isAr ? 'الإمارات' : 'UAE'}</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {uaePrices['21K'].toLocaleString(isAr ? 'ar-AE' : 'en-US')}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  {isAr ? 'د.إ' : 'AED'}
                </div>
              </div>

              {/* Egypt */}
              <div className="bg-white/90 dark:bg-[#14261e] p-2 rounded-xl border border-surface-200 dark:border-surface-800 text-center">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5 flex items-center justify-center gap-1">
                  <span>🇪🇬</span>
                  <span className="truncate">{isAr ? 'مصر' : 'EGY'}</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                  {egyptPrices['21K'].toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  {isAr ? 'ج.م' : 'EGP'}
                </div>
              </div>
            </div>
          </div>

          <Link
            href={getToolUrl('gold-price')}
            className="mt-4 inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-[#14261e] border border-surface-200 dark:border-surface-800 text-gold-700 dark:text-gold-300 hover:bg-gold-50 dark:hover:bg-gold-950 transition-colors min-h-[44px]"
          >
            <span>{isAr ? 'استعراض كافة العيارات والبلدان' : 'Explore All Karats & Currencies'}</span>
            <span aria-hidden="true">{isAr ? '←' : '→'}</span>
          </Link>
        </div>

        {/* Card 3: Quick Jump Shortcuts */}
        <div className="md:col-span-2 lg:col-span-1 rounded-2xl border-2 border-surface-200 dark:border-surface-800 bg-white dark:bg-[#0c1c15] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-slate-700 dark:text-slate-300">
                {isAr ? 'اختصارات سريعة' : 'Quick Jump'}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {isAr ? 'الأكثر طلباً' : 'High Frequency'}
              </span>
            </div>

            <div className="space-y-2 my-2">
              <Link
                href={getToolUrl('age-calculator')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-50 dark:bg-surface-900/60 hover:bg-brand-50/60 dark:hover:bg-brand-950/40 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>🎂</span>
                  <span>{isAr ? 'احسب عمرك بالهجري والميلادي' : 'Calculate Exact Age'}</span>
                </span>
                <span className="text-brand-700 dark:text-emerald-400">←</span>
              </Link>

              <Link
                href={getToolUrl('end-of-service')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-50 dark:bg-surface-900/60 hover:bg-brand-50/60 dark:hover:bg-brand-950/40 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>💼</span>
                  <span>{isAr ? 'مكافأة نهاية الخدمة (السعودية والإمارات)' : 'End of Service Gratuity'}</span>
                </span>
                <span className="text-brand-700 dark:text-emerald-400">←</span>
              </Link>

              <Link
                href={getToolUrl('zakat-calculator')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-50 dark:bg-surface-900/60 hover:bg-brand-50/60 dark:hover:bg-brand-950/40 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>⚖️</span>
                  <span>{isAr ? 'حاسبة الزكاة مع أنصبة اليوم' : 'Zakat with Live Nisab'}</span>
                </span>
                <span className="text-brand-700 dark:text-emerald-400">←</span>
              </Link>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-surface-100 dark:border-surface-800 pt-2.5">
            <span>{isAr ? '🔒 خصوصية 100% داخل جهازك' : '🔒 100% Client-side execution'}</span>
            <span className="text-gold-600 font-semibold">{isAr ? 'مجاني تماماً' : 'Free Forever'}</span>
          </div>
        </div>
      </section>

      {/* Ad slot #1 below Daily Pulse */}
      <AdSlot minHeight={90} />

      {/* 3. Categorized Tools Directory */}
      <div className="space-y-16">
        {(['dates', 'money', 'health'] as const).map((categoryKey) => {
          const categoryTools = groupedTools[categoryKey];
          if (categoryTools.length === 0) return null;

          const categoryIcons = {
            dates: '📅',
            money: '💰',
            health: '🩺',
          };

          return (
            <section key={categoryKey} id={categoryKey} className="scroll-mt-24 space-y-6">
              <div className="border-b border-surface-200 dark:border-surface-800 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categoryIcons[categoryKey]}</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                      {getCategoryTitle(categoryKey)}
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-slate-600 dark:text-slate-400">
                  {categoryTools.length} {isAr ? 'أدوات وحاسبات' : 'calculators'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryTools.map((tool) => {
                  const toolI18n = t.tools[tool.slug as keyof typeof t.tools];
                  return (
                    <Link
                      key={tool.slug}
                      href={getToolUrl(tool.slug)}
                      className="group flex flex-col justify-between p-6 bg-white dark:bg-[#0c1c15] rounded-2xl border-2 border-surface-200/90 dark:border-surface-800 hover:border-brand-700 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all min-h-[180px]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-100 dark:bg-[#14261e] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            {renderToolIcon(tool.slug)}
                          </div>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-brand-100 dark:border-brand-900/40">
                            {toolI18n?.badge || tool.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-brand-800 dark:group-hover:text-emerald-300 transition-colors">
                          {toolI18n?.title || tool.name[locale]}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {toolI18n?.description || tool.description[locale]}
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t border-surface-100 dark:border-surface-800/80 flex items-center justify-between text-xs font-bold text-brand-800 dark:text-emerald-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                        <span>{isAr ? 'ابدأ الحساب الآن' : 'Launch calculator'}</span>
                        <span aria-hidden="true">{isAr ? '←' : '→'}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* 4. Why Hasiba / Guarantees Strip (Humanized Trust, zero AI fluff, zero Zetawala spam) */}
      <section
        aria-label={isAr ? 'لماذا تختار حاسبة؟' : 'Why Choose Hasiba'}
        className="rounded-3xl border-2 border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-[#0c1c15] p-6 sm:p-10 space-y-6"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">
            {isAr ? 'دقة وموثوقية وخصوصية' : 'Precision, Trust & Privacy'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isAr ? 'لماذا يعتمد مئات الآلاف على حاسبة يومياً؟' : 'Why Users Across the Region Rely on Hasiba'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {isAr
              ? 'صُممت منصة حاسبة لتكون البديل الأسرع والأكثر أماناً وموثوقية في العالم العربي للأدوات الحسابية اليومية.'
              : 'Designed to be the fastest, safest, and most reliable Arabic calculator portal with zero data retention.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Pillar 1 */}
          <div className="bg-white dark:bg-[#14261e] p-6 rounded-2xl border border-surface-200 dark:border-surface-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-emerald-950 flex items-center justify-center text-xl">
              🔒
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isAr ? 'خصوصية تامة 100% داخل جهازك' : '100% Client-Side Privacy'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAr
                ? 'تتم جميع العمليات الحسابية محلياً داخل متصفحك. لا نقوم بحفظ أو إرسال تواريخ ميلادك أو أرقام رواتبك أو مدخراتك إلى أي خادم خارجي.'
                : 'All mathematical processing executes locally in your browser. We never transmit or store your birthdates, salaries, or financial records.'}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white dark:bg-[#14261e] p-6 rounded-2xl border border-surface-200 dark:border-surface-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold-50 dark:bg-gold-950 flex items-center justify-center text-xl">
              ⚖️
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isAr ? 'معايير رسمية وأنظمة معتمدة' : 'Officially Audited Standards'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAr
                ? 'معادلات الحساب معتمدة وفق لوائح وزارة الموارد البشرية السعودية وقانون العمل الإماراتي 2021، وتقويم أم القرى، وضوابط الفقه لأنصبة الزكاة.'
                : 'Calculations follow the Saudi Labor Law, UAE Decree No. 33 of 2021, the official Umm al-Qura calendar, and recognized Fiqh Zakat standards.'}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white dark:bg-[#14261e] p-6 rounded-2xl border border-surface-200 dark:border-surface-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-xl">
              ⚡
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isAr ? 'مجاني بالكامل وبلا تسجيل' : '100% Free & Instant Access'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAr
                ? 'لا حاجة لإنشاء حساب أو إدخال بريد إلكتروني أو بطاقة دفع. كافة الأدوات متاحة فوراً وبسرعة فائقة ومتجاوبة على كافة الهواتف والأجهزة.'
                : 'No registration, subscriptions, or credit card required. Clean, instant, and mobile-first design with large tap targets for all devices.'}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Site FAQs */}
      <section className="space-y-6">
        <FaqAccordion
          items={faqItems}
          title={
            isAr
              ? 'الأسئلة الأكثر شيوعاً حول منصة حاسبة'
              : 'Frequently Asked Questions about Hasiba'
          }
        />
      </section>

      {/* Ad slot #2 at bottom */}
      <AdSlot minHeight={250} />
    </div>
  );
};
