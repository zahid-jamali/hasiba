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
    <footer className="w-full border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-[#07150f] mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1: About Hasiba & Identity */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link
              href={locale === 'en' ? '/en/' : '/'}
              className="inline-flex items-center gap-3 group"
            >
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.name[locale]}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tight text-brand-900 dark:text-emerald-100 group-hover:text-brand-700 dark:group-hover:text-emerald-300 transition-colors">
                  {siteConfig.name[locale]}
                </span>
                <span className="text-xs font-semibold text-gold-600 dark:text-gold-400">
                  {locale === 'ar' ? 'حاسبات دقيقة ومجانية' : 'Smart Daily Calculators'}
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              {locale === 'ar'
                ? 'منصة عربية متكاملة تقدم أدوات وحسابات يومية دقيقة وسريعة للعالم العربي ودول الخليج، معتمدة على الأنظمة الرسمية والمعايير الفلكية والشرعية، وبخصوصية تامة 100% داخل جهازك دون جمع بياناتك الشخصية.'
                : 'A dedicated calculator portal offering fast, highly accurate daily computation tools for the Arab world and Gulf region, compliant with official regulatory and calendar standards, executed 100% client-side with complete privacy.'}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-100 dark:border-brand-900/40">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
                <span>{locale === 'ar' ? '100% مجاني وبلا تسجيل' : '100% Free & No Sign-up'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gold-50 text-gold-800 dark:bg-gold-950/60 dark:text-gold-300 border border-gold-200/60 dark:border-gold-900/40">
                <span>🔒 {locale === 'ar' ? 'خصوصية تامة داخل المتصفح' : 'Client-side Privacy'}</span>
              </span>
            </div>
          </div>

          {/* Col 2: Dates Tools */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <span>📅</span>
              <span>{t.categories.dates}</span>
            </h3>
            <ul className="space-y-2 text-sm">
              {datesTools.map((tool) => {
                const toolI18n = t.tools[tool.slug as keyof typeof t.tools];
                return (
                  <li key={tool.slug}>
                    <Link
                      href={getToolUrl(tool.slug)}
                      className="text-slate-600 dark:text-slate-400 hover:text-brand-700 dark:hover:text-emerald-300 transition-colors py-1 block"
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <span>💰</span>
              <span>{t.categories.money}</span>
            </h3>
            <ul className="space-y-2 text-sm">
              {moneyTools.map((tool) => {
                const toolI18n = t.tools[tool.slug as keyof typeof t.tools];
                return (
                  <li key={tool.slug}>
                    <Link
                      href={getToolUrl(tool.slug)}
                      className="text-slate-600 dark:text-slate-400 hover:text-brand-700 dark:hover:text-emerald-300 transition-colors py-1 block"
                    >
                      {toolI18n?.title || tool.name[locale]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 4: Health Tools & Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <span>🩺</span>
              <span>{t.categories.health}</span>
            </h3>
            <ul className="space-y-2 text-sm">
              {healthTools.map((tool) => {
                const toolI18n = t.tools[tool.slug as keyof typeof t.tools];
                return (
                  <li key={tool.slug}>
                    <Link
                      href={getToolUrl(tool.slug)}
                      className="text-slate-600 dark:text-slate-400 hover:text-brand-700 dark:hover:text-emerald-300 transition-colors py-1 block"
                    >
                      {toolI18n?.title || tool.name[locale]}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="pt-4 border-t border-surface-200 dark:border-surface-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {t.common.siteLinks}
              </h4>
              <ul className="space-y-1.5 text-xs">
                {siteConfig.siteLinks.slice(0, 4).map((link) => (
                  <li key={link.key}>
                    <Link
                      href={locale === 'en' ? `/en${link.href}` : link.href}
                      className="text-slate-500 dark:text-slate-400 hover:text-brand-700 dark:hover:text-emerald-300 transition-colors"
                    >
                      {link.label[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Line: Copyright & Discreet Parent Network Note */}
        <div className="mt-12 pt-6 border-t border-surface-200 dark:border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>
            © {currentYear} {siteConfig.name[locale]}. {t.common.allRightsReserved}.
          </p>

          {/* Single discreet mention of Zetawala */}
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span>
              {locale === 'ar'
                ? 'حاسبة هي إحدى مبادرات شبكة زيتاوالا'
                : 'Hasiba is an initiative of the Zetawala network'}
            </span>
            <span>·</span>
            <a
              href={siteConfig.parent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-700 dark:text-emerald-400 font-semibold hover:underline"
            >
              {siteConfig.parent.name[locale]}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
