'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/types';
import { UaeGratuityCalculator } from '@/components/calculators/UaeGratuityCalculator';
import { SaudiGratuityCalculator } from '@/components/calculators/SaudiGratuityCalculator';

interface EndOfServiceHubPageProps {
  locale: Locale;
}

export const EndOfServiceHubPage: React.FC<EndOfServiceHubPageProps> = ({ locale }) => {
  const isAr = locale === 'ar';
  const [activeTab, setActiveTab] = useState<'saudi' | 'uae'>('saudi');

  const saudiUrl = isAr ? '/end-of-service/saudi/' : '/en/end-of-service/saudi/';
  const uaeUrl = isAr ? '/end-of-service/uae/' : '/en/end-of-service/uae/';

  return (
    <div className="space-y-10 w-full">
      {/* 1. Country Selection Cards (Hero Banner) */}
      <section aria-labelledby="choose-country-title" className="space-y-4">
        <h2 id="choose-country-title" className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
          {isAr
            ? 'اختر الدولة لحساب مكافأة نهاية الخدمة بالتفصيل:'
            : 'Select Country to Calculate End of Service Gratuity:'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Saudi Arabia Card */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border-2 transition-all cursor-pointer ${
              activeTab === 'saudi'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
            onClick={() => setActiveTab('saudi')}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">🇸🇦</span>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                    {isAr ? 'نظام العمل السعودي' : 'Saudi Arabia Labor Law'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isAr ? 'المواد 84 و 85 و 87 (وزارة الموارد البشرية)' : 'Articles 84, 85, & 87 (HRSD)'}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                activeTab === 'saudi'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                {activeTab === 'saudi'
                  ? isAr ? 'المحدد حالياً' : 'Active Tab'
                  : isAr ? 'عرض الحاسبة' : 'View Tool'}
              </span>
            </div>

            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 mb-4">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>{isAr ? 'يُحسب على الأجر الفعلي الكامل (الأساسي + بدل السكن والنقل)' : 'Calculated on actual wage (Basic + Housing + Transport)'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>{isAr ? 'السنوات 1-5: نصف شهر/سنة | ما زاد: شهر كامل/سنة' : 'Years 1-5: 0.5 month/yr | Year 6+: 1.0 month/yr'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>{isAr ? 'تطبيق شرائح الاستقالة النظامية (المادة 85) واستثناءات المادة 87' : 'Article 85 resignation tiers & Article 87 exceptions'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>{isAr ? 'لا يوجد سقف أعلى للمكافأة في النظام السعودي' : 'No statutory monetary ceiling/cap'}</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {isAr ? 'صفحة مخصصة مع شروحات وأمثلة:' : 'Dedicated page & examples:'}
              </span>
              <Link
                href={saudiUrl}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{isAr ? 'فتح صفحة السعودية المخصصة' : 'Go to Saudi Calculator'}</span>
                <span aria-hidden="true" className="rtl:rotate-180">→</span>
              </Link>
            </div>
          </div>

          {/* UAE Card */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border-2 transition-all cursor-pointer ${
              activeTab === 'uae'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
            onClick={() => setActiveTab('uae')}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">🇦🇪</span>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                    {isAr ? 'قانون العمل الإماراتي الجديد' : 'UAE Labor Law (2021)'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isAr ? 'مرسوم بقانون 33 لسنة 2021 (وزارة الموارد البشرية والتوطين)' : 'Decree-Law 33/2021 (MOHRE)'}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                activeTab === 'uae'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                {activeTab === 'uae'
                  ? isAr ? 'المحدد حالياً' : 'Active Tab'
                  : isAr ? 'عرض الحاسبة' : 'View Tool'}
              </span>
            </div>

            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 mb-4">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>{isAr ? 'يُحسب على الراتب الأساسي فقط (دون البدلات)' : 'Strictly calculated on basic salary (no allowances)'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>{isAr ? 'السنوات 1-5: أجر 21 يوماً/سنة | ما زاد: أجر 30 يوماً/سنة' : 'Years 1-5: 21 days/yr | Year 6+: 30 days/yr'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>{isAr ? 'لا يوجد خصم عند الاستقالة (استحقاق كامل بعد إكمال سنة)' : 'No resignation penalty (100% full award after 1 year)'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>{isAr ? 'الحد الأقصى للمكافأة أجر سنتين كاملتين (24 شهراً)' : 'Capped at maximum of 2 years’ basic wage (24 months)'}</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {isAr ? 'صفحة مخصصة مع شروحات وأمثلة:' : 'Dedicated page & examples:'}
              </span>
              <Link
                href={uaeUrl}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{isAr ? 'فتح صفحة الإمارات المخصصة' : 'Go to UAE Calculator'}</span>
                <span aria-hidden="true" className="rtl:rotate-180">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Embedded Active Interactive Calculator */}
      <section aria-labelledby="active-calculator-title" className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 id="active-calculator-title" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{activeTab === 'saudi' ? '🇸🇦' : '🇦🇪'}</span>
            <span>
              {activeTab === 'saudi'
                ? isAr ? 'الحاسبة التفاعلية: نظام العمل السعودي' : 'Interactive Calculator: Saudi Labor Law'
                : isAr ? 'الحاسبة التفاعلية: قانون العمل الإماراتي' : 'Interactive Calculator: UAE Labor Law'}
            </span>
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('saudi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'saudi'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              🇸🇦 {isAr ? 'السعودية' : 'Saudi'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('uae')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'uae'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              🇦🇪 {isAr ? 'الإمارات' : 'UAE'}
            </button>
          </div>
        </div>

        {activeTab === 'saudi' ? (
          <SaudiGratuityCalculator locale={locale} showCountrySwitcher={false} />
        ) : (
          <UaeGratuityCalculator locale={locale} showCountrySwitcher={false} />
        )}
      </section>

      {/* 3. Deep Side-by-Side Statutory Comparison Table */}
      <section aria-labelledby="comparison-title" className="space-y-4">
        <h2 id="comparison-title" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
          {isAr
            ? 'مقارنة قانونية شاملة بين نظام مكافأة نهاية الخدمة في السعودية والإمارات'
            : 'Statutory Comparison: End of Service Gratuity in Saudi Arabia vs UAE'}
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5 text-start font-bold">{isAr ? 'وجه المقارنة' : 'Aspect'}</th>
                <th className="p-3.5 text-start font-bold text-emerald-800 dark:text-emerald-400">
                  🇸🇦 {isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
                </th>
                <th className="p-3.5 text-start font-bold text-blue-800 dark:text-blue-400">
                  🇦🇪 {isAr ? 'دولة الإمارات العربية المتحدة' : 'United Arab Emirates'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              <tr>
                <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                  {isAr ? 'السند التشريعي المنظم' : 'Governing Law'}
                </td>
                <td className="p-3.5">
                  {isAr ? 'نظام العمل السعودي (مرسوم ملكي م/51 وتعديلاته)' : 'Saudi Labor Law (Royal Decree M/51)'}
                </td>
                <td className="p-3.5">
                  {isAr ? 'مرسوم بقانون اتحادي رقم 33 لسنة 2021 ولائحته' : 'Federal Decree-Law No. 33 of 2021'}
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                  {isAr ? 'الراتب المعتمد في الحساب' : 'Salary Basis'}
                </td>
                <td className="p-3.5 font-medium text-emerald-700 dark:text-emerald-400">
                  {isAr
                    ? 'الأجر الفعلي الشامل (الأساسي + بدل السكن + النقل والبدلات الثابتة)'
                    : 'Total Actual Wage (Basic + Housing + Transport allowances)'}
                </td>
                <td className="p-3.5 font-medium text-blue-700 dark:text-blue-400">
                  {isAr
                    ? 'الراتب الأساسي فقط (تُستثنى كافة البدلات والمخصصات)'
                    : 'Basic Salary Only (all allowances strictly excluded)'}
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                  {isAr ? 'السنوات الخمس الأولى' : 'First 5 Years Rate'}
                </td>
                <td className="p-3.5">
                  {isAr ? 'أجر نصف شهر (15 يوماً) عن كل سنة' : 'Half month wage (15 days) per year'}
                </td>
                <td className="p-3.5">
                  {isAr ? 'أجر 21 يوماً من الراتب الأساسي عن كل سنة' : '21 days of basic wage per year'}
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                  {isAr ? 'السنوات التالية (السنة 6 وما بعدها)' : 'Years 6+ Rate'}
                </td>
                <td className="p-3.5">
                  {isAr ? 'أجر شهر كامل (30 يوماً) عن كل سنة' : 'Full month wage (30 days) per year'}
                </td>
                <td className="p-3.5">
                  {isAr ? 'أجر 30 يوماً من الراتب الأساسي عن كل سنة' : '30 days of basic wage per year'}
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                  {isAr ? 'أثر الاستقالة على المكافأة' : 'Resignation Impact'}
                </td>
                <td className="p-3.5">
                  {isAr
                    ? 'شرائح المادة 85: أقل من سنتين (0)، 2-5 سنوات (1/3)، 5-10 سنوات (2/3)، 10+ سنوات (كاملة)'
                    : 'Article 85 tiers: < 2 yrs (0%), 2-5 yrs (33.3%), 5-10 yrs (66.7%), 10+ yrs (100%)'}
                </td>
                <td className="p-3.5">
                  {isAr
                    ? 'لا يُخصم أي جزء عند الاستقالة؛ يستحق الموظف كامل مكافأته بعد إكمال سنة عمل'
                    : 'No reduction! Employee receives full 100% award after completing 1 year'}
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                  {isAr ? 'الحد الأقصى للمكافأة (السقف)' : 'Statutory Cap'}
                </td>
                <td className="p-3.5">
                  {isAr ? 'لا يوجد حد أقصى؛ تتراكم المكافأة بدون سقف مهما زادت سنوات الخدمة' : 'No cap; accumulates without limit regardless of tenure'}
                </td>
                <td className="p-3.5 font-semibold text-amber-700 dark:text-amber-400">
                  {isAr ? 'سقف إلزامي: لا تتجاوز المكافأة أجر سنتين كاملتين (24 شهراً)' : 'Mandatory Cap: Cannot exceed 2 years’ basic wage (24 months)'}
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                  {isAr ? 'استثناءات الاستقالة لكامل المكافأة' : 'Full Award Resignation Exceptions'}
                </td>
                <td className="p-3.5">
                  {isAr
                    ? 'المادة 87: استقالة المرأة خلال 6 أشهر من الزواج أو 3 أشهر من الوضع، أو القوة القاهرة'
                    : 'Article 87: Female resignation within 6 mos of marriage or 3 mos of childbirth, force majeure'}
                </td>
                <td className="p-3.5">
                  {isAr ? 'غير لازمة لأن الاستقالة تستحق 100% تلقائياً لكافة العمال' : 'Not required as 100% applies across all cases after 1 yr'}
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                  {isAr ? 'الجهة الرسمية المشرفة' : 'Official Ministry'}
                </td>
                <td className="p-3.5">
                  <a href="https://hrsd.gov.sa" target="_blank" rel="noopener noreferrer" className="text-emerald-700 dark:text-emerald-400 underline font-medium">
                    {isAr ? 'وزارة الموارد البشرية والتنمية الاجتماعية' : 'Ministry of Human Resources (HRSD)'}
                  </a>
                </td>
                <td className="p-3.5">
                  <a href="https://www.mohre.gov.ae" target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 underline font-medium">
                    {isAr ? 'وزارة الموارد البشرية والتوطين (MOHRE)' : 'Ministry of Human Resources (MOHRE)'}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
