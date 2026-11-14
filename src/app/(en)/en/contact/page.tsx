import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { buildMetadata } from '@/components/seo';
import { siteConfig } from '@/config/site';
import { ContentPageLayout } from '@/components/pages/ContentPageLayout';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = buildMetadata({
  slug: 'contact',
  lang: 'en',
  customTitle: 'Contact Us – Hasiba',
  customDescription: 'Get in touch directly with the Hasiba and Zetawala team for inquiries, bug reports, feature requests, or partnership questions.',
});

export default function EnglishContactPage() {
  const contactEmail = siteConfig.parent.email || 'support@zetawala.com';

  return (
    <ContentPageLayout
      locale="en"
      title="Contact Us"
      description="We welcome your suggestions, feedback, and questions regarding any calculator or feature across Hasiba."
      badge="Support & Feedback"
      lastUpdated="November 2026"
    >
      {/* Static site notice & Email block */}
      <section className="space-y-4">
        <p>
          Because <strong>Hasiba</strong> is engineered as a fully static, privacy-centric web utility without backend user forms or database logging, our official and direct communication channel is via email.
        </p>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-white dark:from-slate-900 dark:to-brand-950/30 border border-brand-200 dark:border-brand-900/60 not-prose space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg">
              ✉️
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Direct Contact Email
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Expected response turnaround: 24 to 48 business hours
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-base sm:text-lg transition-all shadow-sm active:scale-[0.99] min-h-[44px]"
            >
              <span>{contactEmail}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Inquiries Categories */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          How Can We Help You?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-brand-600 font-bold text-base">💡</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Request a New Calculator
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Is there a statutory formula, regional financial metric, or daily utility relevant to Gulf residents that you would like added to Hasiba? Let us know with relevant references.
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-bold text-base">🔍</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Report a Formula or Bug
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              If you identify a new statutory amendment in GCC labor legislation, currency discrepancy, or technical bug, notify us so we can immediately inspect and deploy an update.
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-bold text-base">🤝</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Syndication & Partnerships
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              For inquiries regarding tool citations, media coverage, API collaboration, or digital partnerships within the Zetawala network.
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold text-base">🛡️</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Privacy & Data Inquiries
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Questions regarding privacy compliance, cookies, or Google AdSense policies are welcomed by our compliance coordinator.
            </p>
          </Card>
        </div>
      </section>

      {/* Parent Network Details */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Parent Network Details
        </h2>
        <Card variant="muted" className="not-prose flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 flex items-center justify-center shrink-0">
            <Image
              src={siteConfig.parent.logo}
              alt="Zetawala Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="space-y-1 text-center sm:text-start">
            <div className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Zetawala Free Utilities Network
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Official website:{' '}
              <a
                href={siteConfig.parent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-brand-700 dark:text-brand-400 hover:underline"
              >
                https://zetawala.com
              </a>
            </p>
          </div>
        </Card>
      </section>
    </ContentPageLayout>
  );
}
