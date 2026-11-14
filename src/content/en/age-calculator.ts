import { ToolContent } from '../types';

export const content: ToolContent = {
  title: 'Age Calculator',
  metaTitle: 'Age Calculator - Hijri & Gregorian Detailed Breakdown | Hasiba',
  metaDescription: 'Calculate your exact age in years, months, weeks, and days in both Hijri and Gregorian calendars with upcoming birthday countdown and time metrics.',
  h1: 'Exact Age Calculator in Hijri and Gregorian Calendars',
  intro: 'A precise age calculation tool engineered for residents and expatriates in Saudi Arabia and the Gulf, comparing your lifespan across lunar and solar calendars.',
  howItWorks: {
    formula: 'Time elapsed calculated by subtracting birth date components from today’s reference date across solar and lunar calendar systems, adjusting for leap years and month lengths.',
    sourceOrLaw: 'Standard astronomical time division with leap year compensation: Gregorian tropical year (365.2425 days) and Umm al-Qura lunar calendar year (354.367 days).',
  },
  article: `## Understanding Age Calculation Across Solar and Lunar Systems

Living and working in Saudi Arabia and the wider Arabian Gulf often requires navigating two distinct calendar systems: the internationally standard **Gregorian solar calendar** and the Islamic **Hijri lunar calendar**.

While banking, international commerce, and private-sector payroll predominantly use Gregorian dates, official administrative procedures, government decrees, and historical records in Saudi Arabia are deeply anchored in the Hijri calendar (specifically the official **Umm al-Qura calendar**). Consequently, your legal age can differ noticeably depending on which system an authority references.

---

### The Astronomical Difference: 11 Days Each Year

The fundamental discrepancy between the two calendars stems from astronomy:
- A **Gregorian solar year** is determined by Earth's orbit around the Sun, lasting approximately **365.2425 days**.
- A **Hijri lunar year** is based on twelve lunar cycles (moon phases), lasting approximately **354.367 days**.

Because a lunar year is roughly **10 to 12 days shorter** (averaging 11 days per year):
1. **Accelerated Hijri Age**: You celebrate Hijri birthdays every ~354 days, causing your lunar age to advance faster than your solar age.
2. **The 33-Year Alignment Cycle**: Every ~33 Gregorian years, the cumulative ~11-day annual difference adds up to one entire year (33 × 11 ≈ 363 days).
3. **Age Milestone Shift**:
   - At Gregorian age **33**, you are approximately **34** years old in the Hijri system.
   - At Gregorian age **66**, you are approximately **68** years old in the Hijri system.

---

### Converting Age from Official Gulf Documents

Expatriates and GCC nationals frequently possess official documents issued in either calendar:
- **Saudi Birth Certificates & Family Cards**: Older or official certificates often document birth dates primarily in Hijri format.
- **Iqama & Resident Identity**: Resident identity cards issued by the Ministry of Interior feature precise birth dates that correspond across both systems.
- **Academic Credentials**: Foreign educational records list solar birth dates that must be matched against Gulf admission criteria.

With Hasiba's Age Calculator, you can toggle seamlessly between **Hijri** and **Gregorian** input. The engine utilizes high-precision astronomical algorithms mapped to the Saudi Umm al-Qura standard, preventing the off-by-one errors common in rough estimation tools.

---

### Key Practical Applications in the Gulf

- **School Enrollment & Kindergarten Entry**: The Saudi Ministry of Education and GCC schools enforce exact birth-date thresholds for Grade 1 admissions (typically 6 years completed, with a strict 90-day grace period for approved preschool graduates).
- **Civil & Military Recruitment Deadlines**: Upper age limits for public-sector or security roles in Saudi Arabia are explicitly defined in Hijri years at the time application portals open.
- **Retirement & Pension Entitlements (GOSI)**: The General Organization for Social Insurance (GOSI) references statutory retirement age standards where understanding exact calendar alignment is essential for pension claims.
- **Insurance Underwriting**: Motor and health insurance premium brackets categorize drivers and policyholders by exact completed age brackets.

---

### Handling Leap Years (February 29 Birthdays)

If you were born on **February 29** during a leap year, calculating your birthday in standard 365-day years can cause confusion. Hasiba's calculation engine automatically maps your non-leap year birthday to **February 28**, clearly notes the adjustment in the result card, and maintains 100% precision in your cumulative day count.`,
  example: {
    title: 'Dual Calendar Age Comparison Example',
    scenario: 'An expatriate professional born on December 18, 1994 (corresponding to 15 Rajab 1415 AH), calculating their age on December 18, 2024.',
    calculation: 'Elapsed solar time: Exactly 30 completed Gregorian years. Lunar equivalent: 30 solar years plus ~330 accumulated lunar differential days.',
    result: 'Gregorian Age: Exactly 30 years, 0 months, 0 days. Hijri Age: 30 years, 11 months, 16 days (approaching 31 Hijri years). Total Days Lived: 10,957 days.',
  },
  faqs: [
    {
      q: 'Why is my Hijri age greater than my Gregorian age?',
      a: 'The Islamic Hijri calendar is lunar, spanning approximately 354 days per year compared to the 365-day solar Gregorian year. This 11-day annual shortfall causes Hijri years to pass quicker, resulting in approximately one extra Hijri year every 33 solar years.',
    },
    {
      q: 'How do I calculate my age using a Hijri birth certificate?',
      a: 'Select the "Hijri" toggle at the top of the calculator and input the day, month, and Hijri year from your certificate. Hasiba automatically converts the date to Gregorian and calculates your exact age in both systems simultaneously.',
    },
    {
      q: 'How many total days old am I, and how is it calculated?',
      a: 'Our calculator computes the exact number of days between your birth date and the reference date, factoring in every quadrennial leap year and specific calendar month lengths to yield an exact day count.',
    },
    {
      q: 'What is the lifetime difference between Hijri and Gregorian age?',
      a: 'Over a typical lifetime, your Hijri age increases by roughly 3% faster than your Gregorian age. By age 33 you are 1 year older in Hijri; by age 66 you are 2 years older; and by age 99 you are 3 years older.',
    },
    {
      q: 'How does age calculation affect school admission in Saudi Arabia?',
      a: 'The Saudi Ministry of Education (via the Noor portal) strictly requires children entering Grade 1 to have reached 6 years of age at the start of the academic year, allowing an exception for children under 6 by no more than 90 days if kindergarten prerequisites are met.',
    },
    {
      q: 'What are the retirement age benchmarks according to GOSI in Saudi Arabia?',
      a: 'Statutory retirement under the General Organization for Social Insurance (GOSI) is traditionally anchored around 60 years of age. Having an accurate dual-calendar readout prevents discrepancies when verifying pension eligibility dates.',
    },
    {
      q: 'How are leap-year birthdays on February 29 handled in non-leap years?',
      a: 'In non-leap years (which have only 28 days in February), your next birthday is celebrated on February 28, accompanied by a clear explanatory note in the result breakdown.',
    },
    {
      q: 'Does this calculator store or transmit my personal birth date?',
      a: 'No. All calculations are executed 100% locally inside your web browser. Hasiba does not store, log, or transmit any personal birth information to any server or database.',
    },
  ],
  sources: [
    { label: 'Umm al-Qura Official Calendar', url: 'https://www.ummulqura.org.sa' },
    { label: 'General Organization for Social Insurance (GOSI)', url: 'https://gosi.gov.sa' },
    { label: 'Saudi Ministry of Education', url: 'https://moe.gov.sa' },
  ],
  updatedAt: '2026-03-01',
};

export default content;
