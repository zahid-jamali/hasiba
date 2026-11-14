import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/components/seo';
import { siteConfig } from '@/config/site';
import { ContentPageLayout } from '@/components/pages/ContentPageLayout';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = buildMetadata({
  slug: 'terms',
  lang: 'en',
  customTitle: 'Terms of Use – Hasiba',
  customDescription: 'Terms of service and acceptable use policies governing Hasiba calculators and tools under the Zetawala network.',
});

export default function EnglishTermsPage() {
  const contactEmail = siteConfig.parent.email || 'support@zetawala.com';

  return (
    <ContentPageLayout
      locale="en"
      title="Terms of Use"
      description="These terms govern your access and use of Hasiba, an online calculation utility platform operated by the Zetawala network."
      badge="Legal Terms"
      lastUpdated="November 14, 2026"
    >
      {/* 1. Acceptance */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using <strong>Hasiba (حاسبة)</strong>, you agree to be bound by these Terms of Use and all applicable regional laws and regulations. If you do not agree with any part of these terms, you are prohibited from using or accessing this site.
        </p>
      </section>

      {/* 2. Permitted Use */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          2. Permitted Use & Conduct
        </h2>
        <p>
          Hasiba provides free calculation utilities for personal, educational, and informational purposes. You agree not to:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300 ps-2">
          <li>Use the tools for unlawful, fraudulent, or malicious activities.</li>
          <li>Engage in automated scraping, denial of service (DoS), or actions that place disproportionate strain on site infrastructure.</li>
          <li>Misrepresent Hasiba calculations as binding legal or financial rulings.</li>
        </ul>
      </section>

      {/* 3. Intellectual Property */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          3. Intellectual Property Rights
        </h2>
        <p>
          All content, software architecture, branding, trademarks, layouts, and algorithms featured on Hasiba are the exclusive intellectual property of the <strong>Zetawala Network</strong> and are protected under international copyright and trademark conventions.
        </p>
      </section>

      {/* 4. Accuracy & Disclaimer */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          4. Educational Nature & Output Disclaimer
        </h2>
        <p>
          While we rigorously test mathematical algorithms against official GCC labor laws and financial spot feeds, all computations are provided on an &ldquo;as is&rdquo; basis:
        </p>
        <Card variant="muted" className="space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Results are mathematical estimates intended for planning and reference. They do not constitute formal legal counsel, certified auditing, medical diagnosis, or religious fatwas.
          </p>
        </Card>
        <p>
          Please review our complete{' '}
          <Link
            href="/en/disclaimer/"
            className="font-bold text-brand-700 dark:text-brand-400 underline"
          >
            Disclaimer
          </Link>{' '}
          page for additional legal terms.
        </p>
      </section>

      {/* 5. Advertising */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          5. Third-Party Advertising
        </h2>
        <p>
          Hasiba displays third-party advertisements via Google AdSense. We do not endorse or warrant the claims, products, or services offered by third-party advertisers.
        </p>
      </section>

      {/* 6. Amendments */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          6. Modifications
        </h2>
        <p>
          Zetawala reserves the right to revise these Terms of Use at any time. Continued use of the website following any posted modifications constitutes constructive acceptance of updated terms.
        </p>
      </section>

      {/* 7. Contact */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          7. Legal Inquiries
        </h2>
        <p>
          For questions or formal inquiries regarding these terms, contact our team at:{' '}
          <a
            href={`mailto:${contactEmail}`}
            className="font-bold text-brand-700 hover:text-brand-800 dark:text-brand-400 underline"
          >
            {contactEmail}
          </a>
        </p>
      </section>
    </ContentPageLayout>
  );
}
