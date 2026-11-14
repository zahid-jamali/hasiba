'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Locale } from '@/i18n/types';
import { getDictionary } from '@/i18n';
import { siteConfig } from '@/config/site';

export interface HeaderProps {
  locale: Locale;
  currentSlug?: string;
  customPath?: string;
}

export const Header: React.FC<HeaderProps> = ({
  locale,
  currentSlug,
  customPath,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = getDictionary(locale);
  const homePath = locale === 'en' ? '/en/' : '/';

  const pathname = usePathname();
  const currentPath = customPath || pathname || '/';

  // Compute mirrored URL for language switch
  let targetLanguagePath = '/';
  if (currentSlug) {
    targetLanguagePath =
      locale === 'en' ? `/${currentSlug}/` : `/en/${currentSlug}/`;
  } else if (currentPath && currentPath !== '/') {
    targetLanguagePath =
      locale === 'en'
        ? currentPath.replace(/^\/en(\/|$)/, '/') || '/'
        : `/en${currentPath.startsWith('/') ? '' : '/'}${currentPath}`;
  } else {
    targetLanguagePath = locale === 'en' ? '/' : '/en/';
  }

  // Ensure trailing slash
  if (!targetLanguagePath.endsWith('/')) {
    targetLanguagePath += '/';
  }

  const categories = [
    { key: 'dates' as const, label: t.categories.dates, icon: '📅' },
    { key: 'money' as const, label: t.categories.money, icon: '💰' },
    { key: 'health' as const, label: t.categories.health, icon: '🩺' },
  ];

  return (
    <header className="w-full border-b border-surface-200 dark:border-surface-800 bg-white/95 dark:bg-[#07150f]/95 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Start side: Hasiba Logo & Brand Name */}
        <div className="flex items-center gap-3">
          <Link
            href={homePath}
            className="flex items-center gap-3 group min-h-[44px] min-w-[44px] py-1"
            aria-label={`${siteConfig.name[locale]} - ${t.common.home}`}
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
              <Image
                src={siteConfig.logo}
                alt=""
                width={40}
                height={40}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-brand-900 dark:text-emerald-100 group-hover:text-brand-700 dark:group-hover:text-emerald-300 transition-colors leading-none">
                {siteConfig.name[locale]}
              </span>
              <span className="text-[10px] font-semibold text-gold-600 dark:text-gold-400 tracking-wide mt-1">
                {locale === 'ar' ? 'حاسبات دقيقة ومجانية' : 'Smart Daily Calculators'}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Category Navigation on desktop */}
        <nav
          className="hidden md:flex items-center gap-1.5 lg:gap-2"
          aria-label={t.common.categories}
        >
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`${homePath}#${cat.key}`}
              className="px-3.5 py-2 text-sm font-bold rounded-xl text-slate-700 dark:text-slate-200 hover:text-brand-800 dark:hover:text-emerald-300 hover:bg-brand-50/70 dark:hover:bg-brand-950/40 transition-all min-h-[44px] flex items-center gap-1.5"
            >
              <span className="text-sm opacity-80" aria-hidden="true">{cat.icon}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </nav>

        {/* End side: Language switcher + Mobile menu trigger */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <Link
            href={targetLanguagePath}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 min-h-[44px] rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/80 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 hover:border-gold-500 hover:text-gold-700 dark:hover:text-gold-400 hover:bg-gold-50/50 dark:hover:bg-gold-950/30 transition-all select-none shadow-sm"
            aria-label={`Switch to ${t.common.switchLanguageName}`}
          >
            <span aria-hidden="true" className="text-sm">🌐</span>
            <span>{t.common.languageSwitchLabel}</span>
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-brand-800 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-900 min-h-[44px] min-w-[44px]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6 fill-none stroke-current"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-[#0c1c15] px-4 py-5 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
            {t.common.categories}
          </div>
          <div className="grid grid-cols-1 gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`${homePath}#${cat.key}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-base font-bold text-slate-800 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-800 dark:hover:text-emerald-300 min-h-[44px] transition-colors"
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-surface-200 dark:border-surface-800/80">
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 px-2 mb-2">
              {locale === 'ar' ? 'أشهر الأدوات' : 'Popular Tools'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link
                href={locale === 'en' ? '/en/age-calculator/' : '/age-calculator/'}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-surface-50 dark:bg-surface-900/60 text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-emerald-400 block"
              >
                {locale === 'ar' ? '🎂 حساب العمر' : '🎂 Age Calculator'}
              </Link>
              <Link
                href={locale === 'en' ? '/en/gold-price/' : '/gold-price/'}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-surface-50 dark:bg-surface-900/60 text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-emerald-400 block"
              >
                {locale === 'ar' ? '🪙 أسعار الذهب' : '🪙 Gold Prices'}
              </Link>
              <Link
                href={locale === 'en' ? '/en/end-of-service/' : '/end-of-service/'}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-surface-50 dark:bg-surface-900/60 text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-emerald-400 block"
              >
                {locale === 'ar' ? '💼 نهاية الخدمة' : '💼 Gratuity'}
              </Link>
              <Link
                href={locale === 'en' ? '/en/zakat-calculator/' : '/zakat-calculator/'}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-surface-50 dark:bg-surface-900/60 text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-emerald-400 block"
              >
                {locale === 'ar' ? '⚖️ حاسبة الزكاة' : '⚖️ Zakat Calculator'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
