import { ToolContent } from '../types';

export const content: ToolContent = {
  title: 'Zakat Calculator',
  metaTitle: 'Islamic Zakat Calculator - Cash, Gold, Stocks & Business Inventory | Hasiba',
  metaDescription:
    'Accurately calculate your annual Islamic Zakat on cash savings, bank accounts, gold, silver, investments, and business stock using live market Nisab thresholds.',
  h1: 'Islamic Zakat Calculator for Cash, Gold, Stocks, and Business',
  intro:
    'An accurate, Sharia-compliant computational tool designed for Muslims residing in Saudi Arabia, the GCC, and worldwide. Effortlessly compute your obligatory annual Zakat across personal savings, multi-karat gold, silver, equities, and commercial merchandise using live international bullion rates and official foreign exchange benchmarks.',
  howItWorks: {
    formula:
      'Zakat Payable = (Gross Zakatable Assets - Immediate Due Debts) × 2.5% (for Lunar Calendar) or 2.577% (for Gregorian Solar Calendar), provided net wealth equals or exceeds the Nisab threshold.',
    sourceOrLaw:
      'Established classical Islamic jurisprudence recognized by the Council of Senior Scholars, rulings of the International Islamic Fiqh Academy, and regulatory standards published by the Zakat, Tax and Customs Authority (ZATCA) in Saudi Arabia.',
  },
  article: `## Comprehensive Guide to Islamic Zakat Calculation

**Zakat** is the third fundamental pillar of Islam—an obligatory annual charitable levy ordained by Allah upon Muslims who possess qualifying surplus wealth. As explicitly stated in the Holy Quran: *"Take, [O Muhammad], from their wealth a charity by which you purify them and cause them increase..."* [Surah At-Tawbah 9:103]. Zakat is not merely a voluntary donation or a conventional tax; it is an act of worship that cleanses worldly wealth, bridles greed, and establishes socioeconomic justice across the Muslim community.

---

### Core Prerequisites for Zakat Obligation

Islamic jurists have outlined specific conditions that must simultaneously be met before an individual becomes obligated to discharge Zakat:

1. **Islam and Full Ownership**: The individual must be Muslim and possess clear, undisputed, unrestricted legal ownership of the asset, with full authority to dispose of or invest it.
2. **Reaching the Nisab Threshold**: Nisab represents the minimum qualifying financial threshold below which no Zakat is due. By prophetic precedent, the Nisab is defined as either **85 grams of pure 24-karat gold** or **595 grams of pure silver**.
3. **Completion of the Hawl (One Lunar Year)**: The wealth must remain in the owner’s possession at or above the Nisab threshold for one complete lunar year (approximately 354 days). Certain categories are exempt from the one-year holding period, notably agricultural produce harvested, extracted minerals, and accrued commercial profits that follow their principal capital's cycle.
4. **Surplus Beyond Essential Needs**: The assets must exceed what is necessary to sustain the basic living requirements of the person and their direct dependents (such as shelter, food, clothing, personal transportation, healthcare, and essential tools of trade).
5. **Growth Potential (*Namaa*)**: The wealth must either be actively growing (producing profits or dividends) or potentially productive by its very nature (such as gold, silver, liquid currencies, inventory, and tradable equities).

---

### Classification of Modern Zakatable Assets

In our contemporary financial landscape, zakatable wealth manifests across several key categories:

#### 1. Liquid Cash & Banking Deposits
This encompasses all physical cash currency on hand, checking balances, high-yield savings accounts, fixed-term deposits, and balances stored in digital e-wallets. The entire liquid balance maintained on the Zakat due date is assessable at the standard 2.5% lunar rate.

#### 2. Gold, Silver & Precious Bullion
Zakat is universally mandatory on gold and silver investment bullion, minted coins, and wealth preservation bars. When computing gold value across varying karats, purity is standardized against 24-karat gold:
- **24K Gold**: 99.9% pure gold (the reference purity for Nisab).
- **22K Gold**: Valued at 22/24 (approx. 91.67%) of the 24K price.
- **21K Gold**: Valued at 21/24 (approx. 87.5%) of the 24K price (the most widely traded karat in the Arab Gulf region).
- **18K Gold**: Valued at 18/24 (75.0%) of the 24K price.

Personal jewelry worn regularly by women features nuanced scholarly discussions, which are detailed in the FAQ section below.

#### 3. Stocks, Mutual Funds & Equities
The Zakat methodology for capital market investments hinges directly upon investment intent:
- **Day-Trading & Speculative Shares**: Shares purchased with the primary intention of short-term resale to capitalize on price fluctuations are classified as trading merchandise (*'Urud at-Tijarah*). Their full closing market value on the Hawl date is zakatable at 2.5%.
- **Long-Term Strategic Dividend Shares**: Shares acquired for regular dividend income. If the issuing corporation automatically calculates and pays Zakat on behalf of its shareholders (as mandated for listed Saudi joint-stock firms under ZATCA guidelines), individual shareholders have no further liability. If the corporation does not remit Zakat, the investor calculates Zakat upon the company’s net zakatable assets per share or upon the net dividends received.

#### 4. Commercial Stock & Trade Merchandise
All inventory, raw materials, and finished goods held for resale are valued on the Hawl due date at **current market selling price (retail or wholesale replacement value)**, rather than original historical purchase cost. Fixed business assets—such as store fixtures, display shelving, manufacturing machinery, computer systems, and delivery vehicles—are completely exempt.

#### 5. Receivables and Money Owed to You
- **Good Debts**: Loans granted to solvent, reliable individuals who are expected to repay upon request must be incorporated into your annual Zakat calculation.
- **Bad or Doubtful Debts**: Uncollectable loans or debts owed by bankrupt, insolvable, or evasive debtors are not zakatable annually. If recovered years later, scholars recommend paying Zakat once for a single past year upon actual receipt.

---

### Deducting Debts and Liabilities: Immediate vs. Long-Term

One of the most critical aspects of Zakat computation is determining which liabilities qualify for deduction:
- **Immediate Due Debts**: Debts, bills, unpaid employee wages, and commercial accounts payable that have matured and must be settled immediately on or before the Hawl date are deductible from gross assets.
- **Long-Term Deferred Loans**: For multi-year liabilities such as home mortgages or ten-year business financing, classical consensus and contemporary fatwa councils hold that **only the immediate installment maturing in the current year** may be deducted. Deducting the entire long-term principal balance is impermissible, as doing so would artificially wipe out Zakat obligations for wealthy property owners.

---

### Lunar vs. Gregorian Calendar Zakat Rates

The divine baseline established in the Sunnah is **one-fortieth (2.5%)** calculated according to the Islamic lunar calendar (354 days). If an individual, family office, or corporation maintains accounting records strictly based on the 365-day Gregorian solar calendar, contemporary jurists require applying an adjusted rate of **2.577%**. This 0.077% increment compensates precisely for the 11-day variance between the solar and lunar cycles, guaranteeing that the rights of impoverished beneficiaries remain fully intact.`,
  example: {
    title: 'Comprehensive Practical Zakat Computation Example',
    scenario:
      'A Muslim professional and retail entrepreneur residing in Riyadh reaches their annual Hawl date with the following qualifying assets: 60,000 SAR in bank savings, 50 grams of 21K gold jewelry kept for investment (current 21K price: 280 SAR/g), a day-trading stock portfolio worth 40,000 SAR, commercial retail inventory with a current selling value of 30,000 SAR, 10,000 SAR in good debt owed by a solvent colleague, and immediate commercial supplier payables due today of 15,000 SAR. The spot market price for 24K pure gold is 320 SAR/g.',
    calculation:
      '1. Bank Cash Savings: 60,000 SAR\n' +
      '2. Gold Holdings (50g × 280 SAR): 14,000 SAR\n' +
      '3. Day-Trading Stocks (Market Value): 40,000 SAR\n' +
      '4. Retail Business Inventory: 30,000 SAR\n' +
      '5. Recoverable Good Debts: 10,000 SAR\n' +
      '• Gross Zakatable Assets = 60,000 + 14,000 + 40,000 + 30,000 + 10,000 = 154,000 SAR\n' +
      '• Less Immediate Due Debts = -15,000 SAR\n' +
      '• Net Zakatable Wealth = 154,000 - 15,000 = 139,000 SAR\n' +
      '• Nisab Check: Gold Nisab = 85g × 320 SAR = 27,200 SAR (Wealth exceeds Nisab)\n' +
      '• Zakat Payable = 139,000 SAR × 2.5%',
    result: 'Total Obligatory Zakat Due: 3,475 SAR.',
  },
  faqs: [
    {
      q: 'What is Nisab and how is it calculated today?',
      a: 'Nisab is the divine minimum threshold established by Prophet Muhammad (peace be upon him) below which a Muslim is exempt from paying Zakat. It is fixed at 85 grams of pure 24K gold or 595 grams of pure silver. In modern financial practice, you determine today’s Nisab by multiplying 85 grams by the live market spot price of 24K gold per gram in your currency. If your net zakatable wealth equals or exceeds this figure after one full lunar year, Zakat becomes obligatory.',
    },
    {
      q: 'Why choose gold nisab vs silver nisab?',
      a: 'In the era of the early Islamic Caliphate, 85 grams of gold (20 dinars) held equivalent purchasing power to 595 grams of silver (200 dirhams). Over subsequent centuries, global industrial supply caused silver values to drop significantly relative to gold. Today, the majority of contemporary jurists and bodies such as the International Islamic Fiqh Academy recommend benchmarking cash currencies against the gold Nisab, as it accurately reflects actual financial prosperity and surplus wealth. However, some scholars still permit the silver standard, which yields a much lower threshold and favors poorer beneficiaries by qualifying more people to pay.',
    },
    {
      q: 'Is Zakat due on personal jewelry worn by women?',
      a: 'Scholars differ on gold jewelry retained by women for customary personal adornment. The majority of jurists—including the Maliki, Shafi’i, and Hanbali schools—rule that customary, non-extravagant personal jewelry is exempt from Zakat because it is an item of personal use rather than wealth accumulation. Conversely, the Hanafi school and several contemporary authorities (including the Saudi Permanent Committee for Scholarly Research) view that Zakat is due on all gold exceeding 85 grams, regardless of whether it is worn or stored. If jewelry is purchased with an intent of investment, financial security, or commercial resale, all scholars agree that it is fully zakatable.',
    },
    {
      q: 'Is Zakat due on monthly salary immediately upon receipt?',
      a: 'No. Zakat is never levied on monthly earned income at the time of payment. Zakat is a tax on retained surplus wealth, not an income tax. You only pay Zakat on the unspent portion of your salary that is saved, provided your total accumulated savings reach the Nisab threshold and remain in your possession for one complete lunar year (Hawl).',
    },
    {
      q: 'How do I calculate Zakat on long-term investment shares vs day-trading shares?',
      a: 'If you trade shares actively for capital gains (day-trading or swing trading), you must evaluate the entire portfolio at current market closing price on your Zakat date and pay 2.5% on the total sum. If you invest for long-term dividends, you do not pay on the fluctuating market price; instead, you assess the company’s underlying net zakatable assets per share. In Saudi Arabia, many public companies listed on Tadawul pay corporate Zakat directly to ZATCA on behalf of shareholders, absolving individual domestic investors from double taxation.',
    },
    {
      q: 'What debts can be deducted from zakatable wealth?',
      a: 'You may only deduct immediate, matured debts that are legally or contractually due for settlement on or before your Hawl date—such as immediate supplier invoices, overdue rent, personal debts payable on demand, and the current month’s financing installment. Long-term unmatured loans (such as the remaining 15-year balance of a home mortgage) cannot be deducted in their entirety, as this would improperly exempt legitimate wealth from charitable obligation.',
    },
    {
      q: 'How does the lunar year (Hawl) apply to savings accumulated at different times?',
      a: 'If you accumulate savings intermittently throughout the year (such as monthly payroll deposits), you have two options: 1) Track each deposit separately and assign it an independent 354-day cycle from when it arrived—this is mathematically exact but administratively cumbersome. 2) Designate a single recurring date on the Islamic calendar each year (such as the 1st of Ramadan), calculate your entire net wealth on that day, and pay 2.5% across all balances. Any portion of savings that has not yet completed a full year is treated as voluntary advance payment of Zakat, which is permissible and commendable.',
    },
    {
      q: 'How does business stock valuation work for retail and trade?',
      a: 'On your Zakat anniversary, conduct an inventory audit of all merchandise, finished goods, and raw materials designated for sale. Value these items at their current market selling price (the anticipated wholesale or retail realization value on that date), rather than what you originally paid. Fixed capital equipment—including office computers, POS systems, warehouse shelving, manufacturing machinery, and delivery trucks—is strictly exempt from Zakat valuation.',
    },
  ],
  sources: [
    { label: 'Zakaty Portal - Zakat, Tax and Customs Authority (ZATCA, Saudi Arabia)', url: 'https://zakaty.gov.sa' },
    { label: 'General Presidency of Scholarly Research and Ifta', url: 'https://alifta.gov.sa' },
    { label: 'Ehsan National Platform for Charitable Work', url: 'https://ehsan.sa' },
    { label: 'International Islamic Fiqh Academy (IIFA / OIC)', url: 'https://iifa-aifi.org' },
  ],
  updatedAt: '2026-03-01',
};

export default content;
