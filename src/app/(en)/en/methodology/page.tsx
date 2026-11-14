import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo';
import { ContentPageLayout } from '@/components/pages/ContentPageLayout';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = buildMetadata({
  slug: 'methodology',
  lang: 'en',
  customTitle: 'Calculation Methodology & Data Sources – Hasiba',
  customDescription: 'Discover the exact mathematical algorithms, official statutory labor laws, and financial APIs powering Hasiba calculators.',
});

export default function EnglishMethodologyPage() {
  return (
    <ContentPageLayout
      locale="en"
      title="Calculation Methodology & Data Sources"
      description="We maintain rigorous engineering standards and absolute transparency. Below is an exhaustive breakdown of all official sources, legal statutes, and algorithms used across Hasiba."
      badge="Transparency & Sources"
      lastUpdated="November 2026"
    >
      {/* Overview statement */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Core Engineering & Methodological Principles
        </h2>
        <p>
          Every calculator on <strong>Hasiba</strong>, operated under the Zetawala network, adheres strictly to three fundamental principles:
        </p>
        <ol className="list-decimal list-inside space-y-2 pe-2">
          <li>
            <strong>Statutory Alignment:</strong> Verbatim compliance with official laws issued by government ministries in Saudi Arabia, the UAE, Egypt, and GCC nations.
          </li>
          <li>
            <strong>Real-Time Data Feeds:</strong> Direct linkage to verified international bullion indices and central bank foreign exchange rates.
          </li>
          <li>
            <strong>100% Client-Side Execution:</strong> All numerical calculations run locally in the user’s web browser, safeguarding user privacy with zero data transmission to external servers.
          </li>
        </ol>
      </section>

      {/* Tool 1: Hijri Date & Converter */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/60 text-brand-800 dark:text-brand-300 flex items-center justify-center font-bold text-sm">
            1
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Hijri Date Today & Calendar Converter
          </h2>
        </div>

        <p>
          Calculations are governed by the official <strong>Umm al-Qura Calendar</strong> standard authorized by the Kingdom of Saudi Arabia and recognized throughout the Gulf Cooperation Council (GCC).
        </p>

        <Card variant="muted" className="space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Technical Implementation:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>
              Native implementation of the standard <code>Intl.DateTimeFormat</code> API with the explicit astronomical locale identifier <code>en-u-ca-islamic-umalqura</code>.
            </li>
            <li>
              Normalized to UTC noon (<code>12:00:00 UTC</code>) to eliminate timezone boundary drift and date shifting across international regions.
            </li>
            <li>
              Precise determination of lunar month lengths (29 or 30 days) synchronized with the official astronomical sighting almanac of Mecca.
            </li>
          </ul>
        </Card>
      </section>

      {/* Tool 2: Age Calculator */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/60 text-brand-800 dark:text-brand-300 flex items-center justify-center font-bold text-sm">
            2
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Detailed Age Calculator (Gregorian & Hijri)
          </h2>
        </div>

        <p>
          The age engine calculates elapsed calendar time between birthdate and current date across solar and lunar astronomical timelines:
        </p>

        <Card variant="muted" className="space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Mathematical Arithmetic:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <strong>Gregorian Solar Age:</strong> Exact elapsed days, accounting for quadrennial leap years (366 days) and variable Gregorian month durations (28–31 days).
            </li>
            <li>
              <strong>Hijri Lunar Age:</strong> Full conversion of the birth date into Umm al-Qura coordinates. The average lunar year is approximately <code>354.36</code> days versus <code>365.24</code> solar days, accounting for the ~11-day annual variance.
            </li>
            <li>
              <strong>Next Birthday Countdown:</strong> Exact day and weekday countdown until the upcoming Gregorian and Hijri birth anniversaries.
            </li>
          </ul>
        </Card>
      </section>

      {/* Tool 3: Gold & Silver Prices */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 flex items-center justify-center font-bold text-sm">
            3
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Gold & Silver Prices & Bullion Indices
          </h2>
        </div>

        <p>
          Raw precious metal spot values are extracted from international commodity exchanges and converted into national currencies via official bullion industry formulas:
        </p>

        <Card variant="muted" className="space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Data Feeds & Karat Conversion:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <strong>Global Spot Feed:</strong> London Bullion Market Association (LBMA) benchmark feeds and international commodities API (GoldAPI.io).
            </li>
            <li>
              <strong>Foreign Exchange:</strong> Open Exchange Rates API (<code>open.er-api.com</code>) updated on a recurring 6-hour cron cycle.
            </li>
            <li>
              <strong>Troy Ounce Standard:</strong> 1 troy ounce = exactly <code>31.1034768</code> grams.
            </li>
            <li>
              <strong>Karat Purity Fractions:</strong>
              <div className="font-mono text-xs mt-1 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                24K = 100% (1.000) | 22K = 22/24 (0.9167)<br />
                21K = 21/24 (0.8750) | 18K = 18/24 (0.7500)
              </div>
            </li>
            <li>
              <strong>Regional Benchmarks:</strong> Includes the Egyptian Gold Pound (8g of 21K) and Gulf Tola (11.6638g of 24K).
            </li>
          </ul>
        </Card>
      </section>

      {/* Tool 4: Zakat Calculator */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 flex items-center justify-center font-bold text-sm">
            4
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Islamic Zakat Calculator & Nisab Thresholds
          </h2>
        </div>

        <p>
          Formulas are modeled on classical Islamic jurisprudence (Fiqh) and regulatory guidelines published by the Zakat, Tax and Customs Authority (ZATCA) of Saudi Arabia:
        </p>

        <Card variant="muted" className="space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Fiqh Rules & Nisab Benchmarks:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <strong>Gold Nisab:</strong> 20 Mithqals, standardized to exactly <strong>85 grams</strong> of pure 24K gold.
            </li>
            <li>
              <strong>Silver Nisab:</strong> 200 Dirhams, standardized to exactly <strong>595 grams</strong> of pure silver.
            </li>
            <li>
              <strong>Dynamic Nisab Pricing:</strong> Calculated in real-time by multiplying current live gram spot prices by the respective gram threshold.
            </li>
            <li>
              <strong>Zakat Rate:</strong> <strong>2.5%</strong> (one-fortieth) for a lunar (Hijri) haul, or <strong>2.577%</strong> when using the solar (Gregorian) calendar year.
            </li>
            <li>
              <strong>Deductible Netting:</strong> Evaluates cash savings, gold/silver held for wealth preservation, business inventory, and shares, subtracting immediate liabilities.
            </li>
          </ul>
        </Card>
      </section>

      {/* Tool 5: End of Service Gratuity */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 flex items-center justify-center font-bold text-sm">
            5
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            End of Service Gratuity (UAE & Saudi Arabia)
          </h2>
        </div>

        <p>
          Distinguishes between UAE and Saudi statutory frameworks, accommodating termination type (employer termination, contract expiry, resignation, or force majeure):
        </p>

        <Card variant="muted" className="space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Statutory Legal Provisions:
          </h3>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <div>
              <strong className="text-slate-900 dark:text-slate-100">Kingdom of Saudi Arabia (Saudi Labor Law):</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>Article 84: Half-month salary per year for the first 5 years; full month salary per year thereafter.</li>
                <li>Article 85 (Resignation): Zero entitlement under 2 years of service; 1/3 entitlement for 2–5 years; 2/3 entitlement for 5–10 years; full entitlement for 10+ years.</li>
                <li>Article 87: Full entitlement exceptions for force majeure or female employees terminating within 6 months of marriage or 3 months of childbirth.</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <strong className="text-slate-900 dark:text-slate-100">United Arab Emirates (UAE Labor Law):</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>Federal Decree-Law No. 33 of 2021 on the Regulation of Labor Relations and its Executive Regulations.</li>
                <li>21 days of basic wage for each of the first 5 years of service; 30 days of basic wage for each subsequent year.</li>
                <li>Uniform entitlement under the revised federal decree for fixed-term contracts without resignation reduction penalties.</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Tool 6: Pregnancy Calculator */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 flex items-center justify-center font-bold text-sm">
            6
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Pregnancy & Due Date Calculator
          </h2>
        </div>

        <p>
          Formulas implement clinical obstetric protocols endorsed by the American College of Obstetricians and Gynecologists (ACOG) and the World Health Organization (WHO):
        </p>

        <Card variant="muted" className="space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Clinical Protocols (Naegele’s Rule):
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <strong>Standard Gestational Period:</strong> Estimated at <strong>280 days (40 weeks)</strong> from the first day of the last normal menstrual period (LMP).
            </li>
            <li>
              <strong>Menstrual Cycle Variance:</strong> Adjusts for cycles deviating from the 28-day baseline (e.g. a 32-day cycle adds 4 days to estimated gestational age).
            </li>
            <li>
              <strong>Trimester Segmentation:</strong> 1st Trimester (weeks 1–13), 2nd Trimester (weeks 14–27), and 3rd Trimester (weeks 28–40+).
            </li>
            <li>
              <strong>Clinical Advisory:</strong> Calculator outputs are statistical estimates; ultrasound biometry remains the clinical gold standard for confirmation.
            </li>
          </ul>
        </Card>
      </section>
    </ContentPageLayout>
  );
}
