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
    { key: 'dates' as const, label: t.categories.dates },
    { key: 'money' as const, label: t.categories.money },
    { key: 'health' as const, label: t.categories.health },
  ];

  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Start side: Logo + Zetawala desktop badge */}
        <div className="flex items-center gap-3">
          <Link
            href={homePath}
            className="flex items-center gap-2.5 group min-h-[44px] min-w-[44px]"
            aria-label={`${siteConfig.name[locale]} - ${t.common.home}`}
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center shrink-0">
              <Image
                src={siteConfig.logo}
                alt=""
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-brand-600 transition-colors">
              {siteConfig.name[locale]}
            </span>
          </Link>

          {/* Small Zetawala badge on desktop */}
          <a
            href={siteConfig.parent.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 ms-2 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-brand-500 hover:text-brand-700 transition-colors"
          >
            <Image
              src={siteConfig.parent.logo}
              alt=""
              width={14}
              height={14}
              className="object-contain shrink-0"
            />
            <span>{siteConfig.parent.badgeText[locale]}</span>
          </a>
        </div>

        {/* Center: Category Navigation on desktop */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2"
          aria-label={t.common.categories}
        >
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`${homePath}#${cat.key}`}
              className="px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] flex items-center"
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        {/* End side: Language switcher + Mobile menu trigger */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <Link
            href={targetLanguagePath}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all select-none"
            aria-label={`Switch to ${t.common.switchLanguageName}`}
          >
            <span aria-hidden="true">🌐</span>
            <span>{t.common.languageSwitchLabel}</span>
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px]"
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
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2">
          <div className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            {t.common.categories}
          </div>
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`${homePath}#${cat.key}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px]"
            >
              {cat.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <a
              href={siteConfig.parent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600"
            >
              <Image
                src={siteConfig.parent.logo}
                alt=""
                width={16}
                height={16}
                className="object-contain shrink-0"
              />
              <span>{siteConfig.parent.description[locale]}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
