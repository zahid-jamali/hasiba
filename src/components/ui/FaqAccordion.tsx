import React from 'react';

export interface FaqItem {
  question: string;
  answer: string | React.ReactNode;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  className?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  items,
  title,
  className = '',
}) => {
  return (
    <section className={`w-full ${className}`}>
      {title && (
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {title}
        </h2>
      )}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <details
            key={idx}
            className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors shadow-sm overflow-hidden"
          >
            <summary className="flex items-center justify-between gap-4 p-4 sm:p-5 cursor-pointer font-bold text-slate-900 dark:text-slate-100 hover:text-brand-700 dark:hover:text-brand-400 select-none min-h-[44px]">
              <span className="text-base sm:text-lg leading-snug">
                {item.question}
              </span>
              <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 group-open:rotate-180 transition-transform duration-200 text-xs">
                ▼
              </span>
            </summary>
            <div className="px-4 sm:px-5 pb-5 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-1">
              {typeof item.answer === 'string' ? (
                <p>{item.answer}</p>
              ) : (
                item.answer
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};
