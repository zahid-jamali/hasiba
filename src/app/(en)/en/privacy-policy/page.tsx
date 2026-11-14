import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo';
import { siteConfig } from '@/config/site';
import { ContentPageLayout } from '@/components/pages/ContentPageLayout';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = buildMetadata({
  slug: 'privacy-policy',
  lang: 'en',
  customTitle: 'Privacy Policy – Hasiba',
  customDescription: 'Privacy policy for Hasiba, part of the Zetawala network, fully compliant with Google AdSense standards and zero personal data tracking.',
});

export default function EnglishPrivacyPolicyPage() {
  const contactEmail = siteConfig.parent.email || 'support@zetawala.com';

  return (
    <ContentPageLayout
      locale="en"
      title="Privacy Policy"
      description="Hasiba, operated under the Zetawala network, is committed to uncompromising user privacy, client-side processing, and clear advertising transparency."
      badge="Privacy & Trust"
      lastUpdated="November 14, 2026"
    >
      {/* 1. Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          1. Introduction & Scope
        </h2>
        <p>
          This Privacy Policy governs the manner in which <strong>Hasiba (حاسبة)</strong>, an independent online utility within the <strong>Zetawala Network</strong>, handles information when you visit and interact with our web applications and calculators.
        </p>
      </section>

      {/* 2. Zero Personal Data Collection */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          2. Client-Side Calculation Guarantee
        </h2>
        <p>
          We firmly believe that sensitive financial, personal, and medical parameters belong exclusively to you:
        </p>
        <Card variant="accent" className="space-y-2">
          <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-base">
            Zero Server-Side Calculation Storage:
          </h3>
          <p className="text-sm text-emerald-800 dark:text-emerald-300">
            All numerical computations on Hasiba (including birthdates, gratuity wages, zakatable liquid wealth, and menstrual cycle inputs) execute <strong>100% locally in your client web browser</strong>. No personal numbers or financial figures are ever transmitted across networks or stored in our databases.
          </p>
        </Card>
      </section>

      {/* 3. LocalStorage for UI preferences */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          3. LocalStorage for User Preferences
        </h2>
        <p>
          Hasiba utilizes browser local storage (<code>localStorage</code>) strictly to retain client-side cosmetic interface preferences, such as:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300 ps-2">
          <li>Number format preferences (Western digits `123` vs Eastern Arabic digits `١٢٣`).</li>
          <li>Dark mode or display color theme toggles.</li>
        </ul>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This data remains solely on your personal device and is never uploaded to any remote server. You can purge this at any time via your browser settings.
        </p>
      </section>

      {/* 4. Google AdSense Disclosures */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          4. Google AdSense & Third-Party Advertising Disclosures
        </h2>
        <p>
          To maintain Hasiba as a 100% free utility without paywalls or required user subscriptions, we display digital advertisements through the <strong>Google AdSense</strong> program. In full accordance with Google’s publisher requirements:
        </p>

        <div className="space-y-3 not-prose">
          <Card className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Third-Party Vendor Cookies:
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites on the internet.
            </p>
          </Card>

          <Card className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Personalized Advertising:
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Google’s use of advertising cookies enables it and its partners to serve ads to users based on their visits to our sites and/or other sites across the internet.
            </p>
          </Card>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 pt-2">
          Opting Out of Personalized Advertising:
        </h3>
        <p>
          Users may opt out of personalized advertising at any time by visiting Google Ads Settings:
        </p>
        <p>
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-brand-700 hover:text-brand-800 dark:text-brand-400 underline min-h-[44px]"
          >
            <span>Google Ads Settings (https://adssettings.google.com)</span>
            <span aria-hidden="true">↗</span>
          </a>
        </p>

        <p>
          To learn more about how Google processes information when you visit partner sites, please review the official documentation:
        </p>
        <p>
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-brand-700 hover:text-brand-800 dark:text-brand-400 underline min-h-[44px]"
          >
            <span>How Google uses information from sites or apps that use our services</span>
            <span aria-hidden="true">↗</span>
          </a>
        </p>
      </section>

      {/* 5. Analytics Disclosure */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          5. Website Performance Analytics (Cookieless)
        </h2>
        <p>
          We utilize <strong>Cloudflare Web Analytics</strong> to measure general traffic volume and page performance. This analytics framework:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400 ps-2">
          <li>Operates completely without cookies or device fingerprinting.</li>
          <li>Does not track individuals across distinct domains.</li>
          <li>Does not collect or store client IP addresses or Personally Identifiable Information (PII).</li>
        </ul>
      </section>

      {/* 6. External Links */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          6. External Links
        </h2>
        <p>
          Hasiba may include hyperlinks to external websites, such as the Zetawala parent network or official government ministry portals. We are not responsible for the privacy practices or content of third-party domains.
        </p>
      </section>

      {/* 7. Privacy Inquiries */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          7. Contact for Privacy Inquiries
        </h2>
        <p>
          If you have questions regarding this Privacy Policy or compliance with data privacy regulations, please reach out directly:
        </p>
        <p>
          <a
            href={`mailto:${contactEmail}`}
            className="font-bold text-brand-700 hover:text-brand-800 dark:text-brand-400 text-lg underline min-h-[44px] inline-flex items-center"
          >
            {contactEmail}
          </a>
        </p>
      </section>
    </ContentPageLayout>
  );
}
