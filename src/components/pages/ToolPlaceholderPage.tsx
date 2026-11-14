import React from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/types';
import { getDictionary } from '@/i18n';
import { siteConfig } from '@/config/site';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { AdSlot } from '@/components/ui/AdSlot';
import { DigitsPreferenceToggle } from '@/components/ui/DigitsPreferenceToggle';

interface ToolPlaceholderPageProps {
  slug: string;
  locale: Locale;
}

export const ToolPlaceholderPage: React.FC<ToolPlaceholderPageProps> = ({
  slug,
  locale,
}) => {
  const t = getDictionary(locale);
  const toolConfig = siteConfig.tools.find((tool) => tool.slug === slug);
  const toolI18n = t.tools[slug as keyof typeof t.tools];

  const title = toolI18n?.title || toolConfig?.name[locale] || slug;
  const description = toolI18n?.description || toolConfig?.description[locale] || '';
  const homePath = locale === 'en' ? '/en/' : '/';

  const breadcrumbs = [
    { label: t.common.home, href: homePath },
    {
      label: toolConfig ? t.categories[toolConfig.category] : t.common.tools,
      href: `${homePath}#${toolConfig?.category || ''}`,
    },
    { label: title },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Breadcrumbs and Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Breadcrumbs items={breadcrumbs} locale={locale} />
        <DigitsPreferenceToggle locale={locale} />
      </div>

      {/* Main Container Card */}
      <Card className="p-6 sm:p-10 shadow-sm">
        <div className="mb-8">
          <div className="inline-block mb-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {toolI18n?.badge || (toolConfig ? t.categories[toolConfig.category] : '')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
            {title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
            {description}
          </p>
        </div>

        {/* Ad Slot before calculator */}
        <AdSlot minHeight={90} className="my-6" />

        {/* Placeholder container */}
        <div className="p-8 sm:p-12 bg-slate-50 dark:bg-slate-950/60 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-center">
          <div className="text-4xl mb-4 select-none">⚙️</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {t.common.placeholderHeading}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
            {t.common.placeholderDescription}
          </p>
          <div className="flex justify-center">
            <Link
              href={homePath}
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-sm transition-all"
            >
              {t.common.backToHome}
            </Link>
          </div>
        </div>
      </Card>

      {/* Related Tools */}
      <RelatedTools
        currentSlug={slug}
        category={toolConfig?.category}
        locale={locale}
        limit={3}
      />

      {/* Bottom Ad Slot */}
      <AdSlot minHeight={250} />
    </div>
  );
};
