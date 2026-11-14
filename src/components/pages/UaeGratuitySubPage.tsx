'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/types';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { DigitsPreferenceToggle } from '@/components/ui/DigitsPreferenceToggle';
import { Card } from '@/components/ui/Card';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { AdSlot } from '@/components/ui/AdSlot';
import { UaeGratuityCalculator } from '@/components/calculators/UaeGratuityCalculator';

interface UaeGratuitySubPageProps {
  locale: Locale;
}

export const UaeGratuitySubPage: React.FC<UaeGratuitySubPageProps> = ({ locale }) => {
  const isAr = locale === 'ar';
  const homePath = isAr ? '/' : '/en/';
  const hubPath = isAr ? '/end-of-service/' : '/en/end-of-service/';
  const saudiPath = isAr ? '/end-of-service/saudi/' : '/en/end-of-service/saudi/';

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: homePath },
    { label: isAr ? 'المال والأعمال' : 'Money', href: `${homePath}#money` },
    { label: isAr ? 'مكافأة نهاية الخدمة' : 'End of Service', href: hubPath },
    { label: isAr ? 'الإمارات (قانون العمل 2021)' : 'UAE Gratuity' },
  ];

  const uaeFaqs = [
    {
      q: isAr
        ? 'كيف تُحسب مكافأة نهاية الخدمة في قانون العمل الإماراتي الجديد؟'
        : 'How is end of service gratuity calculated under UAE Decree-Law 33 of 2021?',
      a: isAr
        ? 'تُحسب استناداً إلى الراتب الأساسي الأخير بمعدل: 21 يوماً عن كل سنة من السنوات الخمس الأولى، و30 يوماً عن كل سنة تالية تزيد على الخمس سنوات، بشرط إكمال سنة خدمة مستمرة.'
        : 'Gratuity is calculated on the last basic salary at 21 calendar days per year for the first 5 years, and 30 calendar days per year thereafter, provided at least one continuous year of service is completed.',
    },
    {
      q: isAr
        ? 'هل تُخصم أي نسبة من المكافأة إذا استقال الموظف في الإمارات؟'
        : 'Is gratuity reduced if the employee voluntarily resigns in the UAE?',
      a: isAr
        ? 'كلا. بموجب المرسوم بقانون اتحادي رقم 33 لسنة 2021، أُلغيت الفروق القديمة ونسب الخصم؛ ويستحق الموظف المستقيل مكافأته كاملة (100%) متى تجاوزت خدمته سنة واحدة.'
        : 'No. Under Federal Decree-Law No. 33 of 2021, resignation does NOT reduce end of service gratuity in the private sector. The employee receives 100% of the entitlement after one year of service.',
    },
    {
      q: isAr
        ? 'ما هو السقف المالي الأقصى للمكافأة في الإمارات؟'
        : 'What is the statutory cap on end of service gratuity in the UAE?',
      a: isAr
        ? 'ينص القانون الإماراتي على ألا يتجاوز إجمالي المكافأة أجر سنتين كاملتين (24 شهراً من الراتب الأساسي الأخير)، مهما امتدت سنوات خدمة الموظف.'
        : 'UAE law explicitly caps the maximum cumulative gratuity at two years’ worth of basic wage (24 months of basic salary).',
    },
    {
      q: isAr
        ? 'هل يدخل بدل السكن والمواصلات في حساب المكافأة الإماراتية؟'
        : 'Are housing and transport allowances included in UAE gratuity calculations?',
      a: isAr
        ? 'لا، تُحسب المكافأة حصراً على الراتب الأساسي، وتُستثنى تماماً جميع البدلات كبدل السكن وبدل النقل وبدل السفر ومكافآت الأداء.'
        : 'No. UAE gratuity is strictly calculated on basic wage only. All recurring or discretionary allowances (housing, transport, utilities) are legally excluded.',
    },
    {
      q: isAr
        ? 'هل تنطبق هذه الحاسبة على موظفي مركز دبي المالي العالمي (DIFC)؟'
        : 'Does this calculator apply to DIFC or ADGM free zone employees?',
      a: isAr
        ? 'لا تنطبق؛ إذ يخضع مركز دبي المالي العالمي (DIFC) لنظام الادخار في مكان العمل (DEWS)، كما تطبق سوق أبوظبي العالمي (ADGM) لوائحها العمالية المستقلة.'
        : 'No. Free zones with independent employment jurisdictions like DIFC (which operates the DEWS savings plan) and ADGM follow separate workplace regulations.',
    },
    {
      q: isAr
        ? 'ما هي المهلة المحددة لصاحب العمل لتسليم مستحقات نهاية الخدمة؟'
        : 'What is the statutory timeframe for paying end-of-service dues in the UAE?',
      a: isAr
        ? 'يُلزم قانون العمل الإماراتي صاحب العمل بتسوية وسداد كافة مستحقات نهاية الخدمة والأجور خلال مدة لا تتجاوز 14 يوماً من تاريخ انتهاء عقد العمل.'
        : 'Under Article 53 of the UAE Labour Law, employers must settle all terminal dues and wages within 14 calendar days from the employment end date.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8">
      {/* 1. Breadcrumbs & Digits Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <Breadcrumbs items={breadcrumbs} locale={locale} />
        <DigitsPreferenceToggle locale={locale} />
      </div>

      {/* 2. Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
          <span>🇦🇪</span>
          <span>{isAr ? 'مرسوم بقانون اتحادي رقم 33 لسنة 2021' : 'Federal Decree-Law No. 33 of 2021'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
          {isAr
            ? 'حساب مكافأة نهاية الخدمة في دولة الإمارات (القطاع الخاص)'
            : 'UAE End of Service Gratuity Calculator (Private Sector)'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {isAr
            ? 'احسب مستحقات مكافأة نهاية الخدمة بدقة بالدرهم الإماراتي وفق قانون تنظيم علاقات العمل الإماراتي الجديد، مع احتساب فترات الخدمة بدقة اليوم، وقاعدة أجر اليوم (الأساسي ÷ 30)، وتطبيق سقف السنتين.'
            : 'Accurately calculate your UAE end-of-service gratuity entitlement in AED according to the unified labour framework with exact daily pro-rata accrual, statutory daily wage formula, and the 2-year salary cap.'}
        </p>
      </div>

      {/* 3. Interactive Calculator */}
      <UaeGratuityCalculator locale={locale} showCountrySwitcher={true} />

      {/* 4. Detailed Guide Section */}
      <Card className="p-6 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          {isAr ? 'قواعد حساب مكافأة نهاية الخدمة في قانون العمل الإماراتي' : 'Core Rules of UAE End of Service Gratuity'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base">21 يوماً / سنة</span>
            <p className="text-slate-600 dark:text-slate-400">
              {isAr
                ? 'عن كل سنة من السنوات الخمس الأولى من الخدمة المستمرة بعد إكمال السنة الأولى.'
                : 'For each year of continuous service during the first five years.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base">30 يوماً / سنة</span>
            <p className="text-slate-600 dark:text-slate-400">
              {isAr
                ? 'عن كل سنة تالية تزيد على السنوات الخمس الأولى (السنة السادسة فما بعدها).'
                : 'For each subsequent year beyond the first five years of service.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base">{isAr ? 'سقف سنتين' : '2-Year Cap'}</span>
            <p className="text-slate-600 dark:text-slate-400">
              {isAr
                ? 'لا يجوز أن يتجاوز إجمالي المكافأة المستحقة أجر سنتين كاملتين (24 شهراً من الأساسي).'
                : 'Total gratuity cannot exceed two years’ worth of basic salary.'}
            </p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3 pt-2">
          <p>
            {isAr
              ? 'تُحسب المكافأة حصراً على **الراتب الأساسي** الوارد في عقد العمل المعتمد لدى وزارة الموارد البشرية والتوطين (MOHRE). وتُستثنى تماماً بدلات السكن والمواصلات ونفقات السفر وسائر العلاوات.'
              : 'End of service benefits in the UAE are strictly pegged to the **Basic Salary** stipulated in the MOHRE-registered employment contract. Allowances such as housing, conveyance, utilities, and performance bonuses are excluded.'}
          </p>
          <p>
            {isAr
              ? 'لأي جزء من السنة بعد السنة الأولى، تُحسب المكافأة بنظام التناسب الدقيق (Pro-rata)؛ حيث يُقسم عدد الأيام المتبقية على 365 يوماً وتُضرب في الأجر السنوي للشريحة المطبقة.'
              : 'Fractional years following the initial qualifying year are pro-rated down to the exact day by dividing the remaining days by 365.'}
          </p>
        </div>
      </Card>

      {/* Ad slot */}
      <AdSlot slotId="eos-uae-middle" />

      {/* 5. FAQs Accordion */}
      <section aria-labelledby="uae-faq-title" className="space-y-4">
        <h2 id="uae-faq-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          {isAr ? 'الأسئلة الشائعة حول مكافأة نهاية الخدمة في الإمارات' : 'Frequently Asked Questions (UAE EOSG)'}
        </h2>
        <FaqAccordion items={uaeFaqs} />
      </section>

      {/* 6. Switcher Banner to Saudi */}
      <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🇸🇦</span>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              {isAr ? 'هل تبحث عن حساب المكافأة في السعودية؟' : 'Looking for the Saudi Arabia Gratuity Calculator?'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isAr
                ? 'تعرف على استحقاق المكافأة وفق نظام العمل السعودي والمادتين 84 و 85 مع احتساب الأجر الفعلي والبدلات.'
                : 'Calculate end of service benefits under Saudi Labor Law Articles 84 and 85 with actual wages.'}
            </p>
          </div>
        </div>
        <Link
          href={saudiPath}
          className="text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-colors shrink-0"
        >
          {isAr ? 'فتح حاسبة السعودية ←' : 'Open Saudi Calculator →'}
        </Link>
      </div>

      {/* Related tools */}
      <RelatedTools currentSlug="end-of-service" locale={locale} />
    </div>
  );
};
