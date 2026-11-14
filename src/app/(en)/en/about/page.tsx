import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { buildMetadata } from '@/components/seo';
import { siteConfig } from '@/config/site';
import { ContentPageLayout } from '@/components/pages/ContentPageLayout';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = buildMetadata({
  slug: 'about',
  lang: 'en',
  customTitle: 'About Hasiba – Free & Accurate Calculators for the Arab World',
  customDescription: 'Learn about Hasiba, part of the Zetawala network, offering accurate, free online calculators audited against official Gulf and international standards.',
});

export default function EnglishAboutPage() {
  const contactEmail = siteConfig.parent.email || 'support@zetawala.com';

  return (
    <ContentPageLayout
      locale="en"
      title="About Hasiba"
      description="Accurate, free online calculation tools for the Arab World and Gulf region, powered by Zetawala."
      badge="About Platform"
      lastUpdated="November 2026"
    >
      {/* Intro & Zetawala Parent Block */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Who We Are & Our Role in Zetawala
        </h2>
        <p>
          <strong>Hasiba (حاسبة)</strong> is a premier calculation utility platform specifically built to provide free, high-speed, and audited digital calculators for users across Saudi Arabia, the United Arab Emirates, Egypt, and the wider Gulf and Arab region.
        </p>
        <p>
          Hasiba was developed as a flagship project of the <strong>Zetawala Network</strong>, an independent digital technology initiative focused on engineering open, free-to-use, and privacy-respecting online utilities. Our core conviction is that essential calculations—whether for labor entitlements, religious obligations, precious metals, or personal milestones—should be accessible to everyone instantly, with zero paywalls, forced registrations, or invasive tracking.
        </p>

        <Card variant="muted" className="my-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <Image
                src={siteConfig.parent.logo}
                alt="Zetawala Logo"
                width={56}
                height={56}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1 text-center sm:text-start">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Part of the Zetawala Network
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Discover our network of free digital tools and public web utilities at our parent hub:{' '}
                <a
                  href={siteConfig.parent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-700 hover:text-brand-800 dark:text-brand-400 underline"
                >
                  zetawala.com
                </a>
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Mission */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Our Mission & Vision
        </h2>
        <p>
          Historically, online calculation utilities in the MENA region faced persistent challenges: outdated interfaces, lack of localized legal adaptations (such as GCC labor laws or Umm al-Qura lunar dates), and heavy paywalls.
        </p>
        <p>
          Hasiba solves this by delivering modern, lightweight, mobile-first web calculators tailored to GCC regional standards. Furthermore, we maintain a strict privacy-first model: all calculations execute client-side inside your browser, meaning your financial figures, salaries, and birthdates are never logged or stored on our servers.
        </p>
      </section>

      {/* Auditing formulas */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          How Our Formulas Are Audited
        </h2>
        <p>
          Because these calculations inform meaningful financial, legal, and personal choices, we hold our formulas to rigorous verification standards:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-brand-600 text-lg">⚖️</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Labor Laws & Gratuity
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Formulas strictly mirror Articles 84, 85, and 87 of Saudi Labor Law, and UAE Federal Decree-Law No. 33 of 2021 regarding End of Service Gratuity calculation brackets.
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-brand-600 text-lg">🌙</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Umm al-Qura Hijri Calendar
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Directly aligned with Saudi Arabia’s official Umm al-Qura calendar system utilizing international standards (`Intl` with `en-u-ca-islamic-umalqura`).
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-brand-600 text-lg">🪙</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Precious Metals & Live FX
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Integrated with LBMA spot metal feeds and central bank foreign exchange rates, recalculated across all karats every 6 hours.
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-brand-600 text-lg">🩺</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Obstetric Guidelines
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Pregnancy due date and milestone computations follow clinical Naegele’s Rule protocols recommended by the American College of Obstetricians and Gynecologists (ACOG).
            </p>
          </Card>
        </div>

        <p>
          For complete transparency, read our in-depth{' '}
          <Link
            href="/en/methodology/"
            className="font-bold text-brand-700 hover:text-brand-800 dark:text-brand-400 underline"
          >
            Methodology & Data Sources
          </Link>{' '}
          page.
        </p>
      </section>

      {/* Suggest improvements & report errors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Suggestions & Reporting Discrepancies
        </h2>
        <p>
          Continuous accuracy is our commitment. If you notice a recent statutory update in GCC labor legislation, spot a bug, or wish to request a new calculator, our engineering and editorial team welcomes your input.
        </p>

        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 not-prose flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">
              Direct Contact & Feedback Email:
            </div>
            <a
              href={`mailto:${contactEmail}`}
              className="text-lg font-bold text-brand-700 dark:text-brand-400 hover:underline"
            >
              {contactEmail}
            </a>
          </div>

          <Link
            href="/en/contact/"
            className="px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-700 text-white hover:bg-brand-800 transition-colors shrink-0"
          >
            Contact Page →
          </Link>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Our team reviews all inquiries promptly, typically responding within 24–48 business hours.
        </p>
      </section>
    </ContentPageLayout>
  );
}
