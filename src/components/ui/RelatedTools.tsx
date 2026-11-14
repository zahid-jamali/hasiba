import React from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/types';
import { getDictionary } from '@/i18n';
import { siteConfig, ToolConfig } from '@/config/site';

export interface RelatedToolsProps {
  currentSlug: string;
  category?: ToolConfig['category'];
  locale: Locale;
  limit?: number;
  className?: string;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({
  currentSlug,
  category,
  locale,
  limit = 3,
  className = '',
}) => {
  const t = getDictionary(locale);

  // Filter tools: prioritize same category first, excluding current
  let filtered = siteConfig.tools.filter((tool) => tool.slug !== currentSlug);
  if (category) {
    const sameCategory = filtered.filter((tool) => tool.category === category);
    const otherCategories = filtered.filter((tool) => tool.category !== category);
    filtered = [...sameCategory, ...otherCategories];
  }
  const displayTools = filtered.slice(0, limit);

  return (
    <div className={`w-full mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 ${className}`}>
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-5">
        {t.ui.relatedToolsTitle}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayTools.map((tool) => {
          const toolI18n = t.tools[tool.slug as keyof typeof t.tools];
          const href = locale === 'en' ? `/en/${tool.slug}/` : `/${tool.slug}/`;

          return (
            <Link
              key={tool.slug}
              href={href}
              className="group block p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-sm transition-all min-h-[44px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-800 dark:bg-brand-950/50 dark:text-brand-300">
                  {toolI18n?.badge || tool.category}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-brand-600 transition-colors">
                  {locale === 'ar' ? '←' : '→'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1 line-clamp-1">
                {toolI18n?.title || tool.name[locale]}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {toolI18n?.description || tool.description[locale]}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
