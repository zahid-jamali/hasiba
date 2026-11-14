import React from 'react';
import { Locale } from '@/i18n/types';
import { getDictionary } from '@/i18n';
import { siteConfig } from '@/config/site';
import { getToolContent } from '@/content';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { AdSlot } from '@/components/ui/AdSlot';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { DigitsPreferenceToggle } from '@/components/ui/DigitsPreferenceToggle';
import { ToolJsonLd } from '@/components/seo/ToolJsonLd';

interface ToolPageTemplateProps {
  slug: string;
  locale: Locale;
  calculatorNode?: React.ReactNode;
  resultNode?: React.ReactNode;
}

export const ToolPageTemplate: React.FC<ToolPageTemplateProps> = ({
  slug,
  locale,
  calculatorNode,
  resultNode,
}) => {
  const t = getDictionary(locale);
  const toolConfig = siteConfig.tools.find((tool) => tool.slug === slug);
  const content = getToolContent(slug, locale);

  if (!toolConfig || !content) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold">Content not found for {slug}</h1>
      </div>
    );
  }

  const isAr = locale === 'ar';
  const homePath = isAr ? '/' : '/en/';

  // 1. Breadcrumbs data: Home > Category > Tool
  const breadcrumbItems = [
    { label: t.common.home, href: homePath },
    {
      label: t.categories[toolConfig.category],
      href: `${homePath}#${toolConfig.category}`,
    },
    { label: content.title },
  ];

  return (
    <>
      {/* Tool JSON-LD (WebApplication, BreadcrumbList, FAQPage) */}
      <ToolJsonLd
        slug={slug}
        tool={toolConfig}
        locale={locale}
        title={content.title}
        description={content.metaDescription}
        faqs={content.faqs}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 w-full">
        {/* 1. Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Breadcrumbs items={breadcrumbItems} locale={locale} />
          <DigitsPreferenceToggle locale={locale} />
        </div>

        {/* 2. H1 + 3. One-sentence intro (compact, so calculator is above fold on 360px phone) */}
        <header className="space-y-2">
          <div className="inline-block mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {t.categories[toolConfig.category]}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            {content.h1}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {content.intro}
          </p>
        </header>

        {/* 4. The Calculator (Visible above the fold on a 360px phone) */}
        <section aria-label="Calculator" className="space-y-6">
          <Card className="p-4 sm:p-6 shadow-sm border-brand-200 dark:border-brand-900/40 bg-white dark:bg-slate-900">
            {calculatorNode ? (
              calculatorNode
            ) : (
              <div className="py-6 px-4 bg-slate-50 dark:bg-slate-950/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-center">
                <span className="text-3xl mb-2 block select-none">🧮</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isAr ? 'حاسبة تفاعلية قيد التفعيل البرمجي' : 'Interactive Calculator Component'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  {isAr
                    ? 'سيتم تفعيل هذه الحاسبة التفاعلية في الخطوة التالية مع كافة مدخلاتها الدقيقة.'
                    : 'The dedicated calculation logic will be mounted in the next step.'}
                </p>
              </div>
            )}
          </Card>

          {/* 5. Result area */}
          {resultNode ? (
            resultNode
          ) : (
            <div
              aria-live="polite"
              className="p-4 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 text-center text-xs text-emerald-800 dark:text-emerald-300 font-medium"
            >
              <span>{isAr ? '📊 ستظهر النتيجة والحسابات المفصلة هنا فور الإدخال' : '📊 Real-time calculation results will appear here'}</span>
            </div>
          )}
        </section>

        {/* 6. AdSlot #1 */}
        <AdSlot minHeight={90} slotId="tool-top-banner" />

        {/* 7. "How it is calculated" box */}
        <section aria-labelledby="how-it-works-title">
          <Card
            variant="accent"
            className="p-5 sm:p-7 border-emerald-200 dark:border-emerald-800/60 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📐</span>
              <h2
                id="how-it-works-title"
                className="text-lg sm:text-xl font-bold text-emerald-950 dark:text-emerald-200"
              >
                {isAr ? 'كيف يتم الحساب؟ (المعادلة والمرجع)' : 'How It Is Calculated (Formula & Law)'}
              </h2>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              <strong className="text-slate-900 dark:text-slate-100 font-bold">
                {isAr ? 'المعادلة الرياضية: ' : 'Formula: '}
              </strong>
              {content.howItWorks.formula}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-emerald-200/60 dark:border-emerald-900/50 pt-2.5">
              <strong className="text-slate-800 dark:text-slate-200 font-bold">
                {isAr ? 'المرجع والتشريع المعتمد: ' : 'Governing Standard / Law: '}
              </strong>
              {content.howItWorks.sourceOrLaw}
            </p>
          </Card>
        </section>

        {/* 8. Article (600-900 words with H2/H3 sections) */}
        <section aria-label="Comprehensive Article" className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <MarkdownRenderer content={content.article} />
        </section>

        {/* 9. Worked example with real numbers */}
        <section aria-labelledby="example-title">
          <Card className="p-5 sm:p-7 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-lg">💡</span>
              <h2
                id="example-title"
                className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100"
              >
                {content.example.title}
              </h2>
            </div>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p>
                <strong className="font-bold text-slate-900 dark:text-slate-100">
                  {isAr ? 'السيناريو والبيانات: ' : 'Scenario: '}
                </strong>
                {content.example.scenario}
              </p>
              <p>
                <strong className="font-bold text-slate-900 dark:text-slate-100">
                  {isAr ? 'خطوات الحساب: ' : 'Calculation: '}
                </strong>
                {content.example.calculation}
              </p>
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200 font-bold mt-2">
                <span>{isAr ? 'النتيجة النهائية: ' : 'Final Result: '}</span>
                <span>{content.example.result}</span>
              </div>
            </div>
          </Card>
        </section>

        {/* 10. FAQ, 6-8 questions (FaqAccordion) */}
        <section aria-label="Frequently Asked Questions" className="pt-4">
          <FaqAccordion
            title={t.ui.faqTitle}
            items={content.faqs.map((f) => ({
              question: f.q,
              answer: f.a,
            }))}
          />
        </section>

        {/* 11. Related tools (3-4 cards) */}
        <section aria-label="Related Calculators">
          <RelatedTools
            currentSlug={slug}
            category={toolConfig.category}
            locale={locale}
            limit={4}
          />
        </section>

        {/* 12. "Last updated" date + list of sources (links) */}
        <footer className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {isAr ? 'تاريخ آخر تحديث: ' : 'Last updated: '}
            </span>
            <time dateTime={content.updatedAt}>{content.updatedAt}</time>
          </div>

          {content.sources.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {isAr ? 'المصادر الرسمية: ' : 'Official Sources: '}
              </span>
              {content.sources.map((src, idx) => (
                <React.Fragment key={idx}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 dark:text-brand-400 hover:underline hover:text-brand-800 transition-colors"
                  >
                    {src.label}
                  </a>
                  {idx < content.sources.length - 1 && <span>·</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </footer>

        {/* 13. AdSlot #2 */}
        <AdSlot minHeight={250} slotId="tool-bottom-rectangle" />
      </article>
    </>
  );
};
