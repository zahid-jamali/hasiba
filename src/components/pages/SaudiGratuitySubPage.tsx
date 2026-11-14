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
import { SaudiGratuityCalculator } from '@/components/calculators/SaudiGratuityCalculator';

interface SaudiGratuitySubPageProps {
  locale: Locale;
}

export const SaudiGratuitySubPage: React.FC<SaudiGratuitySubPageProps> = ({ locale }) => {
  const isAr = locale === 'ar';
  const homePath = isAr ? '/' : '/en/';
  const hubPath = isAr ? '/end-of-service/' : '/en/end-of-service/';
  const uaePath = isAr ? '/end-of-service/uae/' : '/en/end-of-service/uae/';

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: homePath },
    { label: isAr ? 'المال والأعمال' : 'Money', href: `${homePath}#money` },
    { label: isAr ? 'مكافأة نهاية الخدمة' : 'End of Service', href: hubPath },
    { label: isAr ? 'السعودية (نظام العمل)' : 'Saudi Arabia Gratuity' },
  ];

  const saudiFaqs = [
    {
      q: isAr
        ? 'كيف تُحسب مكافأة نهاية الخدمة في نظام العمل السعودي؟'
        : 'How is end of service gratuity calculated under Saudi Labor Law?',
      a: isAr
        ? 'وفق المادة 84، يستحق العامل أجر نصف شهر (15 يوماً) عن كل سنة من السنوات الخمس الأولى، وأجر شهر كامل (30 يوماً) عن كل سنة تالية، محسوبة على الأجر الفعلي الأخير (الأساسي + بدل السكن والنقل).'
        : 'Under Article 84, the award equals half a month wage (15 days) per year for the first 5 years, and a full month wage (30 days) per year thereafter, calculated on the last actual wage (basic salary plus housing and transport allowances).',
    },
    {
      q: isAr
        ? 'ما هي نسب استحقاق المكافأة عند الاستقالة في السعودية (المادة 85)؟'
        : 'What are the Article 85 resignation sliding scales in Saudi Arabia?',
      a: isAr
        ? 'أقل من سنتين خدمة: 0% (لا يستحق مكافأة)؛ من سنتين إلى أقل من 5 سنوات: ثلث المكافأة (33.33%)؛ من 5 سنوات إلى أقل من 10 سنوات: ثلثا المكافأة (66.67%)؛ 10 سنوات فأكثر: كامل المكافأة (100%).'
        : 'Under Article 85: Less than 2 years: 0%; 2 to < 5 years: 1/3 (33.33%); 5 to < 10 years: 2/3 (66.67%); 10 years or more: 100% full award.',
    },
    {
      q: isAr
        ? 'ما هي استثناءات المادة 87 التي تمنح كامل المكافأة عند الاستقالة؟'
        : 'What are the Article 87 exceptions granting full gratuity upon resignation?',
      a: isAr
        ? 'تستحق المرأة العاملة كامل المكافأة (100%) إذا استقالت خلال 6 أشهر من عقد زواجها أو 3 أشهر من وضعها (الولادة)، وكذلك عند ترك العمل بسبب قوة قاهرة.'
        : 'Article 87 grants 100% full award upon resignation if a female worker terminates employment within 6 months of marriage or 3 months of giving birth, or if termination is due to force majeure.',
    },
    {
      q: isAr
        ? 'هل يدخل بدل السكن والمواصلات في احتساب المكافأة بالسعودية؟'
        : 'Are housing and transport allowances included in the Saudi calculation?',
      a: isAr
        ? 'نعم، تنص المادة الثانية من نظام العمل على أن المكافأة تُحسب على "الأجر الفعلي" الذي يشمل الراتب الأساسي وجميع البدلات الثابتة كبدل السكن وبدل النقل.'
        : 'Yes. Saudi Labor Law mandates calculation on the total actual wage, which includes base salary and all permanent recurring allowances such as housing and transport.',
    },
    {
      q: isAr
        ? 'هل يوجد سقف أقصى للمكافأة في النظام السعودي؟'
        : 'Is there a ceiling/cap on Saudi end of service benefits?',
      a: isAr
        ? 'لا، بخلاف بعض الأنظمة الإقليمية، لا يضع نظام العمل السعودي أي حد أقصى للمكافأة؛ وتتراكم المستحقات بنسبتها النظامية مهما بلغت سنوات الخدمة.'
        : 'No. Unlike some regional jurisdictions, Saudi Labor Law imposes no statutory cap on end of service awards; they accumulate indefinitely with tenure.',
    },
    {
      q: isAr
        ? 'ما هي المهلة القانونية لإيداع مستحقات نهاية الخدمة في السعودية؟'
        : 'What is the statutory deadline for paying end of service dues in Saudi Arabia?',
      a: isAr
        ? 'يُلزم نظام العمل صاحب العمل بدفع كامل المستحقات خلال أسبوع واحد عند إنهاء العقد من صاحب العمل، أو خلال أسبوعين إذا كان انتهاء العقد بسبب استقالة العامل.'
        : 'Employers must pay all severance entitlements within 1 week of termination if initiated by the employer, or within 2 weeks if the employee resigned.',
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
          <span>🇸🇦</span>
          <span>{isAr ? 'نظام العمل السعودي (المواد 84 و 85 و 87)' : 'Saudi Labor Law (Articles 84, 85, & 87)'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
          {isAr
            ? 'حساب مكافأة نهاية الخدمة في السعودية (نظام العمل)'
            : 'Saudi Arabia End of Service Gratuity Calculator'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {isAr
            ? 'احسب مستحقات نهاية الخدمة بالريال السعودي بدقة وفق نظام العمل السعودي المعتمد من وزارة الموارد البشرية والتنمية الاجتماعية، شاملاً احتساب البدلات (السكن والنقل)، ونسب شرائح الاستقالة، واستثناءات المادة 87.'
            : 'Accurately calculate your Saudi end-of-service award in SAR under Saudi Labor Law with actual wage allowances, Article 85 resignation sliding tiers, and Article 87 statutory exceptions.'}
        </p>
      </div>

      {/* 3. Interactive Calculator */}
      <SaudiGratuityCalculator locale={locale} showCountrySwitcher={true} />

      {/* 4. Detailed Guide Section */}
      <Card className="p-6 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          {isAr ? 'القواعد والأحكام النظامية لحساب المكافأة في السعودية' : 'Key Statutory Provisions of Saudi End of Service Benefits'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base">{isAr ? 'المادة 84 (المكافأة)' : 'Article 84'}</span>
            <p className="text-slate-600 dark:text-slate-400">
              {isAr
                ? 'أجر نصف شهر عن كل سنة من السنوات الخمس الأولى، وأجر شهر كامل عن كل سنة تالية.'
                : 'Half month wage for first 5 years; full month wage per year thereafter.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base">{isAr ? 'المادة 85 (الاستقالة)' : 'Article 85'}</span>
            <p className="text-slate-600 dark:text-slate-400">
              {isAr
                ? 'أقل من سنتين (0%)، 2-5 سنوات (1/3)، 5-10 سنوات (2/3)، 10 سنوات فأكثر (100%).'
                : 'Resignation tiers: <2 yrs (0%), 2-5 yrs (1/3), 5-10 yrs (2/3), 10+ yrs (100%).'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base">{isAr ? 'المادة 87 (الاستثناء)' : 'Article 87'}</span>
            <p className="text-slate-600 dark:text-slate-400">
              {isAr
                ? 'استحقاق كامل 100% للمرأة خلال 6 أشهر من الزواج أو 3 أشهر من الوضع، أو القوة القاهرة.'
                : '100% full award for women resigning within 6 mos of marriage or 3 mos of childbirth.'}
            </p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3 pt-2">
          <p>
            {isAr
              ? 'يُعتمد في احتساب المكافأة **الأجر الفعلي الشامل الأخير**، والذي يتضمن الراتب الأساسي والبدلات الثابتة المستمرة (مثل بدل السكن وبدل النقل). هذا الفارق الجوهري يرفع قيمة المكافأة في السعودية مقارنة بالأنظمة التي تعتمد على الراتب الأساسي فقط.'
              : 'End of service gratuity in Saudi Arabia is computed on the **Total Actual Wage**, which aggregates the basic salary and fixed recurrent allowances (housing and transport). This key distinction significantly increases entitlement amounts.'}
          </p>
          <p>
            {isAr
              ? 'تُحسب كسور السنة بنظام التناسب الدقيق (Pro-rata)؛ وتُستبعد أيام الإجازة بدون راتب من مدة الخدمة المتصلة، كما تُخصم أي ديون لصاحب العمل من المبلغ النهائي.'
              : 'Fractional years are pro-rated down to the exact day on a 365-day basis. Periods of unpaid leave are excluded from continuous service time, and employer debts are deducted from the final payout.'}
          </p>
        </div>
      </Card>

      {/* Ad slot */}
      <AdSlot slotId="eos-ksa-middle" />

      {/* 5. FAQs Accordion */}
      <section aria-labelledby="ksa-faq-title" className="space-y-4">
        <h2 id="ksa-faq-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          {isAr ? 'الأسئلة الشائعة حول مكافأة نهاية الخدمة في السعودية' : 'Frequently Asked Questions (Saudi EOSB)'}
        </h2>
        <FaqAccordion items={saudiFaqs} />
      </section>

      {/* 6. Switcher Banner to UAE */}
      <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🇦🇪</span>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              {isAr ? 'هل تبحث عن حساب المكافأة في الإمارات؟' : 'Looking for the UAE Gratuity Calculator?'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isAr
                ? 'تعرف على استحقاق المكافأة وفق قانون العمل الإماراتي الجديد (21/30 يوماً، بدون خصم استقالة، وسقف السنتين).'
                : 'Calculate gratuity under UAE Decree-Law 33/2021 with 21/30 day tiers, no resignation deduction, and 2-year cap.'}
            </p>
          </div>
        </div>
        <Link
          href={uaePath}
          className="text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors shrink-0"
        >
          {isAr ? 'فتح حاسبة الإمارات ←' : 'Open UAE Calculator →'}
        </Link>
      </div>

      {/* Related tools */}
      <RelatedTools currentSlug="end-of-service" locale={locale} />
    </div>
  );
};
