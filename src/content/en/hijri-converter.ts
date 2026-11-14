import { ToolContent } from '../types';

export const content: ToolContent = {
  title: 'Hijri to Gregorian Converter',
  metaTitle: 'Hijri to Gregorian Date Converter | Hasiba',
  metaDescription: 'Accurately convert dates between Hijri and Gregorian calendars using Umm al-Qura standard for Saudi Arabia and Gulf countries.',
  h1: 'Hijri to Gregorian Date Converter (Dual Direction)',
  intro: 'A fast, reliable date conversion utility designed for professionals, expats, and legal administrators dealing with Middle Eastern records.',
  howItWorks: {
    formula: 'Astronomical Julian Day conversion synced with the Umm al-Qura lunar database.',
    sourceOrLaw: 'Official calendar conversion models used by Saudi administrative and judicial bodies.',
  },
  article: `## The Need for Precision Date Conversion

Converting between the Hijri and Gregorian calendars is a routine necessity across Saudi Arabia and the GCC. Expatriates frequently handle documents—such as residency permits (Iqama), birth certificates, lease agreements, and judicial deeds—that record dates solely in the Hijri calendar.

### Avoiding the Common 1-2 Day Conversion Errors

Simple mathematical formulas (such as dividing by 1.03) often produce errors of one or two days because lunar months fluctuate irregularly between 29 and 30 days. Hasiba utilizes the official Julian day count mapped against validated Umm al-Qura observations.

### Practical Applications

- **Immigration & Visas**: Converting Iqama expiry and entry visa validities.
- **Human Resources**: Calculating exact probation periods, service duration, and leave entitlements.
- **Contract Management**: Ensuring commercial contracts with Hijri termination clauses match banking and accounting cycles.`,
  example: {
    title: 'Practical Birth Date Conversion',
    scenario: 'An expat needs the Gregorian date for a child born on 10 Rajab 1415 AH.',
    calculation: 'Translating year 1415, month 7, day 10 using official Umm al-Qura alignment.',
    result: '10 Rajab 1415 AH corresponds to December 12, 1994 CE.',
  },
  faqs: [
    {
      q: 'How do I convert my Gregorian birth date into Hijri?',
      a: 'Switch to the "Gregorian → Hijri" tab, select your birth day, month, and year, and the exact corresponding Umm al-Qura Hijri date and weekday will display immediately.',
    },
    {
      q: 'Is this conversion aligned with the Saudi Absher and Qiwa platforms?',
      a: 'Yes, our calculations use the exact Umm al-Qura astronomical lunar standard utilized across official Saudi government electronic portals.',
    },
    {
      q: 'Why do the Hijri and Gregorian calendars differ in year length?',
      a: 'The Hijri year consists of 12 lunar months totaling 354 or 355 days, while the solar Gregorian year totals 365 or 366 days, creating an annual variance of around 11 days.',
    },
    {
      q: 'Why do some generic conversion formulas give dates off by 1 or 2 days?',
      a: 'Mathematical approximations fail to account for the exact 29-day and 30-day lunar months determined by astronomical conjunction. Hasiba matches against verified calendar records.',
    },
    {
      q: 'What is the covered historical year range in this converter?',
      a: 'The converter supports all dates between 1343 AH and 1500 AH (approximately 1924 CE to 2076 CE).',
    },
    {
      q: 'How does the tool show elapsed time or time remaining?',
      a: 'The result card automatically calculates the exact time difference relative to today (e.g. "About 30 years ago" or "In 45 days").',
    },
    {
      q: 'Which calendar do Saudi employment contracts use?',
      a: 'Under Saudi Labor Law, contracts may be referenced in either Gregorian or Hijri; when Hijri is specified, the Umm al-Qura calendar is the legal standard.',
    },
    {
      q: 'Can I view the full annual calendar for a given Hijri year?',
      a: 'Yes! The converter provides direct links to our full annual programmatic calendar pages for each year between 1440 and 1455 AH.',
    },
  ],
  sources: [
    { label: 'Umm al-Qura Official System', url: 'https://www.ummulqura.org.sa' },
    { label: 'Saudi Ministry of Human Resources', url: 'https://hrsd.gov.sa' },
  ],
  updatedAt: '2026-03-01',
};

export default content;
