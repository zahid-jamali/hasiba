import React from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/types';
import { getDictionary } from '@/i18n';
import { siteConfig } from '@/config/site';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AdSlot } from '@/components/ui/AdSlot';

export interface ContentPageLayoutProps {
  locale: Locale;
  title: string;
  description?: string;
  badge?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export const ContentPageLayout: React.FC<ContentPageLayoutProps> = ({
  locale,
  title,
  description,
  badge,
  lastUpdated,
  children,
}) => {
  const t = getDictionary(locale);
  const homeUrl = locale === 'en' ? '/en/' : '/';

  const breadcrumbs = [
    { label: t.common.home, href: homeUrl },
    { label: title },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} locale={locale} />

      {/* Page Header */}
      <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          {badge ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {badge}
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-surface-100 text-slate-700 dark:bg-surface-800 dark:text-slate-300 border border-surface-200 dark:border-surface-800">
              {siteConfig.name[locale]}
            </span>
          )}

          {lastUpdated && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {locale === 'ar' ? `آخر تحديث: ${lastUpdated}` : `Last updated: ${lastUpdated}`}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
          {title}
        </h1>

        {description && (
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>
        )}
      </header>

      {/* Top Ad Slot */}
      <AdSlot minHeight={90} />

      {/* Article Body */}
      <article className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-800 dark:text-slate-200 text-base leading-relaxed">
        {children}
      </article>

      {/* Bottom Ad Slot */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <AdSlot minHeight={250} />
      </div>

      {/* Return home link */}
      <div className="pt-4 flex justify-between items-center text-sm">
        <Link
          href={homeUrl}
          className="inline-flex items-center gap-2 font-bold text-brand-700 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 transition-colors min-h-[44px]"
        >
          <span>{locale === 'ar' ? '← العودة إلى الصفحة الرئيسية' : '← Back to Homepage'}</span>
        </Link>

        <a
          href={siteConfig.parent.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-500 hover:text-brand-600 dark:text-slate-400 transition-colors"
        >
          {siteConfig.parent.name[locale]}
        </a>
      </div>
    </div>
  );
};
