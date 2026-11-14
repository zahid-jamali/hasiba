import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n/types';
import { getDictionary } from '@/i18n';
import { siteConfig } from '@/config/site';

export interface FooterProps {
  locale: Locale;
}

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  const t = getDictionary(locale);
  const currentYear = new Date().getFullYear();

  const getToolUrl = (slug: string) => {
    return locale === 'en' ? `/en/${slug}/` : `/${slug}/`;
  };

  const datesTools = siteConfig.tools.filter((tool) => tool.category === 'dates');
  const moneyTools = siteConfig.tools.filter((tool) => tool.category === 'money');
  const healthTools = siteConfig.tools.filter((tool) => tool.category === 'health');

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto transition-colors">
      {/* Top "Parent Brand" Banner Block */}
      <div className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3.5 text-center sm:text-start">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 flex items-center justify-center shrink-0">
                <Image
                  src={siteConfig.parent.logo}
                  alt={siteConfig.parent.name[locale]}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {siteConfig.parent.description[locale]}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {siteConfig.parent.name[locale]} · {siteConfig.parent.url.replace(/^https?:\/\//, '')}
                </p>
              </div>
            </div>

            <a
              href={siteConfig.parent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-700 hover:bg-brand-800 text-white transition-all shadow-sm active:scale-[0.99] shrink-0"
            >
              {siteConfig.parent.visitText[locale]}
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Col 1: About Hasiba & Identity */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name[locale]}
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="font-bold text-xl text-slate-900 dark:text-slate-100">
                {siteConfig.name[locale]}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              {siteConfig.description[locale]}
            </p>
          </div>

          {/* Col 2: Dates Tools */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t.categories.dates}
            </h3>
            <ul className="space-y-2 text-sm">
              {datesTools.map((tool) => {
                const toolI18n = t.tools[tool.slug as keyof typeof t.tools];
                return (
                  <li key={tool.slug}>
                    <Link
                      href={getToolUrl(tool.slug)}
                      className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-1 block"
                    >
                      {toolI18n?.title || tool.name[locale]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3: Money Tools */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t.categories.money}
            </h3>
            <ul className="space-y-2 text-sm">
              {moneyTools.map((tool) => {
                const toolI18n = t.tools[tool.slug as keyof typeof t.tools];
                return (
                  <li key={tool.slug}>
                    <Link
                      href={getToolUrl(tool.slug)}
                      className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-1 block"
                    >
                      {toolI18n?.title || tool.name[locale]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 4: Health Tools */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t.categories.health}
            </h3>
            <ul className="space-y-2 text-sm">
              {healthTools.map((tool) => {
                const toolI18n = t.tools[tool.slug as keyof typeof t.tools];
                return (
                  <li key={tool.slug}>
                    <Link
                      href={getToolUrl(tool.slug)}
                      className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-1 block"
                    >
                      {toolI18n?.title || tool.name[locale]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 5: Site Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t.common.siteLinks}
            </h3>
            <ul className="space-y-2 text-sm">
              {siteConfig.siteLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={locale === 'en' ? `/en${link.href}` : link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-1 block"
                  >
                    {link.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Line: Zetawala Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>
            © {currentYear} {siteConfig.parent.name[locale]}. {t.common.allRightsReserved}.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.parent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-600 transition-colors"
            >
              {siteConfig.parent.url.replace(/^https?:\/\//, '')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
