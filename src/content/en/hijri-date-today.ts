import { ToolContent } from '../types';

export const content: ToolContent = {
  title: 'Hijri Date Today',
  metaTitle: 'Hijri Date Today & Islamic Calendar Converter | Hasiba',
  metaDescription: 'Check today’s official Hijri date according to Umm al-Qura calendar with Gregorian equivalent for Saudi Arabia, UAE, and Gulf expats.',
  h1: 'Today’s Hijri Date & Islamic Calendar Conversion',
  intro: 'A quick and accurate tool to check today’s Hijri date based on the Umm al-Qura standard, complete with the Gregorian date match for Gulf residents and expats.',
  howItWorks: {
    formula: 'Calculated using the official astronomical Umm al-Qura lunar criteria based on moon conjunction in Makkah.',
    sourceOrLaw: 'Umm al-Qura Calendar standards by King Abdulaziz City for Science and Technology (KACST), Saudi Arabia.',
  },
  article: `## Understanding the Hijri Calendar in Everyday Life

The **Hijri (Islamic) Calendar** is a lunar-based system of 12 months in a year of 354 or 355 days. For residents and expatriates in Saudi Arabia, the UAE, Kuwait, Qatar, and other Arab nations, the Hijri date determines public holidays, Ramadan working hours, visa validity periods, and religious events.

### How Umm al-Qura Calendar Works

In Saudi Arabia, the **Umm al-Qura calendar** is the standard reference for government affairs. It calculates the start of each month based on astronomical calculations for Makkah:
- The moon's conjunction must occur before sunset.
- The moon must set after the sun at Makkah's coordinates.

### Difference Between Lunar and Solar Calendars

- **Hijri Year**: Approximately 354.36 days long.
- **Gregorian Year**: Approximately 365.24 days long.
- **The Shift**: The Hijri calendar shifts backward by roughly 10 to 12 days each solar year. This explains why holy months like Ramadan rotate through all four seasons over a 33-year cycle.

### The 12 Months of the Islamic Year

1. **Muharram** (Sacred Month)
2. **Safar**
3. **Rabi al-Awwal**
4. **Rabi al-Thani**
5. **Jumada al-Ula**
6. **Jumada al-Thaniyah**
7. **Rajab** (Sacred Month)
8. **Sha'ban**
9. **Ramadan** (Month of Fasting)
10. **Shawwal** (Includes Eid al-Fitr)
11. **Dhu al-Qi'dah** (Sacred Month)
12. **Dhu al-Hijjah** (Month of Hajj and Eid al-Adha)`,
  example: {
    title: 'Practical Date Alignment Example',
    scenario: 'Checking the Gregorian date for the 15th of Ramadan 1446.',
    calculation: 'Cross-referencing day 15 of lunar month 9 with standard civil solar calendar.',
    result: '15 Ramadan 1446 AH corresponds exactly to 14 March 2025 CE.',
  },
  faqs: [
    {
      q: 'What is today’s Hijri date in Saudi Arabia and the Gulf?',
      a: 'The current Hijri date is displayed live at the top of this page according to the official Umm al-Qura calendar standard utilized in Saudi Arabia.',
    },
    {
      q: 'What is the Umm al-Qura calendar and how is it calculated?',
      a: 'Umm al-Qura is Saudi Arabia’s official astronomical lunar calendar. It benchmarks the new lunar month against coordinates of the Holy Kaaba in Makkah, requiring the moon’s conjunction to occur before sunset and the moon to set after the sun.',
    },
    {
      q: 'Why do Hijri and Gregorian years differ in length (354/355 vs 365 days)?',
      a: 'The Islamic year follows a lunar cycle of roughly 354.36 days, whereas the Gregorian calendar follows the solar year of 365.24 days. This creates an 11-day annual variance.',
    },
    {
      q: 'Does the Islamic date roll over at midnight?',
      a: 'No. The Islamic day begins at sunset (Maghrib), whereas the Gregorian day changes at midnight (12:00 AM).',
    },
    {
      q: 'Why does Eid or Ramadan start on different days across different countries?',
      a: 'Individual nations adhere to distinct moon sighting committees and criteria. Some rely strictly on physical visual sighting, while others utilize astronomical calculations like Umm al-Qura.',
    },
    {
      q: 'Which calendar is used in Saudi government forms and services?',
      a: 'Saudi official portals (including Absher, Qiwa, Najiz, and GOSI) historically and formally reference the Umm al-Qura calendar for residency, contracts, and legal deeds.',
    },
    {
      q: 'What are the four Sacred Months in the Islamic calendar?',
      a: 'The four Sacred Months (Al-Ashhur Al-Hurum) are Dhu al-Qi’dah, Dhu al-Hijjah, Muharram, and Rajab.',
    },
    {
      q: 'Can a lunar month have 31 days?',
      a: 'No. A lunar month is strictly either 29 or 30 days. It is astronomically impossible for a lunar month to have 28 or 31 days.',
    },
  ],
  sources: [
    { label: 'Umm al-Qura Official Portal', url: 'https://www.ummulqura.org.sa' },
    { label: 'KACST Astronomy Research', url: 'https://kacst.gov.sa' },
  ],
  updatedAt: '2026-03-01',
};

export default content;
