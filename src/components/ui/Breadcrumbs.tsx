import React from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/types';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale: Locale;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  locale,
  className = '',
}) => {
  const separator = locale === 'ar' ? '←' : '→';

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 overflow-x-auto py-2 ${className}`}
    >
      <ol className="flex items-center flex-nowrap whitespace-nowrap gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-brand-700 dark:hover:text-brand-400 transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={
                    isLast
                      ? 'font-bold text-slate-900 dark:text-slate-100'
                      : ''
                  }
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="text-slate-300 dark:text-slate-600 select-none text-[11px]" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
