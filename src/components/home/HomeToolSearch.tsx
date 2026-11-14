'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/types';
import { siteConfig, ToolConfig } from '@/config/site';
import { DigitsPreferenceToggle } from '@/components/ui/DigitsPreferenceToggle';

interface HomeToolSearchProps {
  locale: Locale;
}

export const HomeToolSearch: React.FC<HomeToolSearchProps> = ({ locale }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'dates' | 'money' | 'health'>('all');

  const isAr = locale === 'ar';

  const categoryLabels = {
    all: isAr ? 'جميع الأدوات' : 'All Tools',
    dates: isAr ? '📅 التقاويم والتواريخ' : '📅 Dates & Calendars',
    money: isAr ? '💰 المال والأعمال' : '💰 Money & Finance',
    health: isAr ? '🩺 الصحة والعائلة' : '🩺 Health & Family',
  };

  const quickPills = isAr
    ? [
        { label: '🎂 حساب العمر', slug: 'age-calculator' },
        { label: '🪙 أسعار الذهب اليوم', slug: 'gold-price' },
        { label: '💼 مكافأة نهاية الخدمة', slug: 'end-of-service' },
        { label: '⚖️ حاسبة الزكاة', slug: 'zakat-calculator' },
        { label: '📅 التاريخ الهجري اليوم', slug: 'hijri-date-today' },
        { label: '🤰 حاسبة موعد الولادة', slug: 'pregnancy-calculator' },
      ]
    : [
        { label: '🎂 Age Calculator', slug: 'age-calculator' },
        { label: '🪙 Live Gold Prices', slug: 'gold-price' },
        { label: '💼 Gratuity Calculator', slug: 'end-of-service' },
        { label: '⚖️ Zakat Calculator', slug: 'zakat-calculator' },
        { label: '📅 Hijri Date Today', slug: 'hijri-date-today' },
        { label: '🤰 Pregnancy Due Date', slug: 'pregnancy-calculator' },
      ];

  const filteredTools = useMemo(() => {
    return siteConfig.tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!query.trim()) return true;

      const q = query.toLowerCase().trim();
      const name = tool.name[locale].toLowerCase();
      const desc = tool.description[locale].toLowerCase();
      const slug = tool.slug.toLowerCase();

      // Additional search keywords for Arabic search
      const arKeywords: Record<string, string[]> = {
        'age-calculator': ['عمر', 'ميلاد', 'كم عمري', 'سنين', 'شهور', 'هجري وميلادي', 'يوم ميلادي'],
        'gold-price': ['ذهب', 'فضة', 'عيار 21', 'عيار 24', 'سعر الجرام', 'سبيكة', 'اونصة', 'دولار', 'ريال', 'درهم', 'جنيه'],
        'end-of-service': ['نهاية خدمة', 'مكافأة', 'استقالة', 'فصل', 'قانون العمل', 'السعودية', 'الإمارات', 'حقوق العامل'],
        'zakat-calculator': ['زكاة', 'نصاب', 'زكاة المال', 'حساب الزكاة', 'ذهب وفضة', 'أسهم', 'تجارة', 'حول'],
        'hijri-date-today': ['تاريخ اليوم', 'هجري اليوم', 'ام القرى', 'شعبان', 'رمضان', 'شوال', 'محرم'],
        'hijri-converter': ['تحويل تاريخ', 'هجري الى ميلادي', 'ميلادي الى هجري', 'تحويل التاريخ'],
        'pregnancy-calculator': ['حمل', 'ولادة', 'موعد الولادة', 'اسابيع الحمل', 'الدورة الشهرية', 'سونار', 'جنين'],
      };

      const extraMatch =
        isAr &&
        arKeywords[tool.slug]?.some((kw) => kw.includes(q) || q.includes(kw));

      return name.includes(q) || desc.includes(q) || slug.includes(q) || Boolean(extraMatch);
    });
  }, [selectedCategory, query, locale, isAr]);

  const getToolUrl = (slug: string) => {
    return locale === 'en' ? `/en/${slug}/` : `/${slug}/`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            isAr
              ? 'ابحث عن أي حاسبة... (مثال: عمر، ذهب، مكافأة نهاية الخدمة، زكاة، حمل)'
              : 'Search calculators... (e.g. age, gold rates, gratuity, zakat, pregnancy)'
          }
          className="w-full ps-11 pe-10 py-3.5 sm:py-4 rounded-2xl border-2 border-surface-200 dark:border-surface-800 bg-white dark:bg-[#0c1c15] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base font-medium shadow-sm focus:border-brand-600 dark:focus:border-emerald-500 focus:outline-none transition-all"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute inset-y-0 end-0 pe-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label={isAr ? 'مسح البحث' : 'Clear search'}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="6" />
            </svg>
          </button>
        )}
      </div>

      {/* Category Filter Chips & Digits Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'dates', 'money', 'health'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[38px] ${
                selectedCategory === cat
                  ? 'bg-brand-800 dark:bg-emerald-700 text-white shadow-sm'
                  : 'bg-surface-100 dark:bg-surface-900 text-slate-700 dark:text-slate-300 hover:bg-surface-200 dark:hover:bg-surface-800 border border-surface-200 dark:border-surface-800'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        <div className="shrink-0">
          <DigitsPreferenceToggle locale={locale} />
        </div>
      </div>

      {/* Quick Search Shortcut Pills */}
      {!query && (
        <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-semibold me-1">
            {isAr ? 'الأكثر بحثاً:' : 'Quick links:'}
          </span>
          {quickPills.map((pill) => (
            <Link
              key={pill.slug}
              href={getToolUrl(pill.slug)}
              className="px-2.5 py-1 rounded-lg bg-surface-50 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 text-slate-700 dark:text-slate-300 hover:border-gold-500 hover:text-gold-700 dark:hover:text-gold-400 hover:bg-gold-50/50 dark:hover:bg-gold-950/30 transition-all font-medium"
            >
              {pill.label}
            </Link>
          ))}
        </div>
      )}

      {/* Live Search Results Dropdown / Grid if user is querying */}
      {query.trim() && (
        <div className="pt-2 animate-in fade-in duration-150">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
            {isAr ? `نتائج البحث (${filteredTools.length})` : `Search Results (${filteredTools.length})`}
          </div>

          {filteredTools.length === 0 ? (
            <div className="p-6 text-center rounded-2xl border border-dashed border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/40">
              <span className="text-2xl block mb-2 select-none">🔍</span>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'لم نتمكن من العثور على حاسبة مطابقة لبحثك' : 'No matching calculators found'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isAr ? 'جرب البحث بكلمات أبسط كـ (عمر، ذهب، مكافأة، زكاة)' : 'Try searching for age, gold, gratuity, or zakat'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={getToolUrl(tool.slug)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-[#0c1c15] hover:border-brand-600 dark:hover:border-emerald-500 shadow-sm hover:shadow transition-all group"
                >
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-emerald-300 transition-colors block">
                      {tool.name[locale]}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {tool.description[locale]}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-brand-700 dark:text-emerald-400 shrink-0 ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    {isAr ? 'فتح ←' : 'Open →'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
