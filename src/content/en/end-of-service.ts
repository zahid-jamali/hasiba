import { ToolContent } from '../types';

export const content: ToolContent = {
  title: 'End of Service Gratuity Calculator (UAE & Saudi Arabia)',
  metaTitle: 'End of Service Gratuity Calculator (UAE & Saudi Labor Laws) | Hasiba',
  metaDescription: 'Accurately calculate end of service benefits under Saudi Labor Law (Articles 84, 85, 87) and UAE Federal Decree-Law No. 33 of 2021 with allowances, resignation scales, and caps.',
  h1: 'End of Service Gratuity Calculator for Saudi Arabia & UAE',
  intro: 'An authoritative statutory end of service benefits calculator designed for private sector employees and HR specialists in the Kingdom of Saudi Arabia and the United Arab Emirates, updated in alignment with the latest ministerial regulations.',
  howItWorks: {
    formula: 'Saudi Labor Law: Half a month wage per year for the first 5 years + one full month wage per year thereafter (calculated on actual wage including housing and transport allowances), adjusted by Article 85 resignation sliding tiers unless Article 87 applies. UAE Labor Law (Decree-Law 33/2021): 21 days basic salary per year for the first 5 years + 30 days basic salary per year thereafter (calculated strictly on basic wage), with 0% resignation deduction and a mandatory cap of 2 years basic wage.',
    sourceOrLaw: 'Saudi Labor Law (Royal Decree No. M/51 as amended) and Ministry of Human Resources and Social Development (HRSD) regulations; UAE Federal Decree-Law No. 33 of 2021 on the Regulation of Labour Relations and Ministry of Human Resources and Emiratisation (MOHRE) guidelines.',
  },
  article: `## Comprehensive Legal Guide to End of Service Gratuity in the GCC

In the Gulf Cooperation Council (GCC) private sector, **End of Service Gratuity (EOSG)**—often referred to as severance pay or terminal benefits—is an employer-funded statutory right granted to employees at the conclusion of their employment relationship. 

While both **Saudi Arabia** and the **United Arab Emirates** mandate end-of-service benefits, their respective labor codes differ fundamentally in wage definitions, resignation reductions, accrual rates, and statutory caps.

---

### 1. Saudi Labor Law Framework (Articles 84, 85, & 87)

The Saudi Labor Law, issued under Royal Decree No. M/51, provides a structured framework based on tenure, reason for separation, and comprehensive wages:

#### A. Standard Accrual Formula (Article 84)
When employment terminates via employer dismissal (without misconduct under Article 80), natural expiration of a fixed-term contract, retirement, or mutual consent:
- **First 5 Years of Continuous Service**: **Half a month’s wage** (15 days) for each completed year.
- **Years Beyond 5 (Year 6+)**: **One full month’s wage** (30 days) for each subsequent completed year.
- **Fractional Years**: Pro-rated down to the exact day on a 365-day calendar year basis.
- **The "Actual Wage" Rule**: Crucially, Saudi gratuity is computed on the employee's **last actual wage**, which encompasses the base monthly salary plus fixed recurring allowances (such as housing allowance, transport allowance, and regular commissions).

#### B. Resignation Reductions (Article 85)
If an open-ended or fixed-term employment relationship ends due to the employee's voluntary resignation:
- **Service under 2 years**: **0%** entitlement (no gratuity is payable).
- **Service from 2 to less than 5 years**: **1/3 (33.33%)** of the Article 84 base award.
- **Service from 5 to less than 10 years**: **2/3 (66.67%)** of the Article 84 base award.
- **Service of 10 years or more**: **100%** full award.

#### C. Article 87 Statutory Exceptions
Article 87 explicitly guarantees the **full 100% award** even upon resignation under specific protective conditions:
- **Female Workers**: Resignation within **6 months** of the date of marriage, or within **3 months** of giving birth.
- **Force Majeure**: Contract termination caused by uncontrollable catastrophic circumstances beyond the employee's control.
- **Employer Breach (Article 81)**: Departure resulting from gross employer contractual default or abuse.

---

### 2. UAE Unified Labor Law (Federal Decree-Law No. 33 of 2021)

The modernized UAE employment code, effective since February 2022 across the mainland private sector:

#### A. Accrual Rates and the 1-Year Threshold (Article 51)
- **Minimum Qualifying Period**: An employee must complete at least **one continuous year** of service. Less than 1 year results in zero statutory gratuity.
- **First 5 Years**: **21 calendar days** of basic wage for each year of service.
- **Subsequent Years (Year 6+)**: **30 calendar days** of basic wage for each subsequent year.
- **Daily Wage Formula**: Legally specified as $\\text{Daily Wage} = \\text{Monthly Basic Salary} \\div 30$.
- **Basic Wage Basis Only**: In sharp contrast to Saudi Arabia, UAE gratuity is computed strictly on **basic salary**. Housing, travel, schooling, utilities, and discretionary bonuses are legally excluded.

#### B. Zero Resignation Reductions
Under Decree-Law 33 of 2021, the historic distinction between limited and unlimited contracts has been abolished. **Resignation does not diminish gratuity**; employees receive 100% of their statutory entitlement after one year of tenure.

#### C. The Statutory 2-Year Cap
Total accumulated gratuity **cannot exceed two years’ worth of basic wage** (24 months of basic pay), regardless of whether tenure extends to 25, 30, or more years.

---

### Key Comparisons: Saudi Arabia vs. United Arab Emirates

| Aspect | Saudi Arabia (Labor Law M/51) | United Arab Emirates (Decree-Law 33/2021) |
| :--- | :--- | :--- |
| **Salary Basis** | Total Actual Wage (Basic + Housing + Transport) | Basic Salary Only (all allowances excluded) |
| **Years 1 to 5 Rate** | Half-month wage (15 days) per year | 21 days basic wage per year |
| **Years 6+ Rate** | Full-month wage (30 days) per year | 30 days basic wage per year |
| **Resignation Penalty** | Sliding scale: <2 yrs (0%), 2-5 yrs (1/3), 5-10 yrs (2/3), 10+ yrs (100%) | None (100% full award after completing 1 year) |
| **Statutory Cap** | None (accumulates uncapped across entire career) | Strictly capped at 2 years' basic wage (24 months) |
| **Female Marriage/Birth** | Article 87 awards 100% full gratuity | Unified standard applies automatically |
| **Regulating Body** | Ministry of Human Resources (HRSD) | Ministry of Human Resources & Emiratisation (MOHRE) |

---

### Unpaid Leave Exclusions & Deductions
Both labor frameworks agree that **unpaid leave days** (authorized or unauthorized leave without pay) are strictly subtracted from continuous service time. Employers may legally deduct outstanding employee loans, documented equipment liabilities, or court-mandated debts from the final gratuity settlement.`,
  example: {
    title: 'Direct Comparative Case Study: 7 Years of Service in Saudi Arabia vs UAE',
    scenario: 'An engineer completes 7 continuous years with a basic salary of 8,000 SAR/AED and recurrent housing/transport allowances of 4,000 SAR/AED (Total: 12,000 SAR/AED).',
    calculation: `• Saudi Arabia Employer Termination Calculation:
- Monthly Wage Base: 12,000 SAR (Actual Wage).
- First 5 Years: 5 × (12,000 ÷ 2) = 30,000 SAR.
- Next 2 Years (Years 6-7): 2 × 12,000 = 24,000 SAR.
- Total Saudi Gratuity: 54,000 SAR.

• UAE Mainland Calculation:
- Monthly Wage Base: 8,000 AED (Basic Salary only). Daily wage = 266.67 AED.
- First 5 Years: 5 × 21 × (8,000 ÷ 30) = 28,000 AED.
- Next 2 Years (Years 6-7): 2 × 30 × (8,000 ÷ 30) = 16,000 AED.
- Total UAE Gratuity: 44,000 AED.`,
    result: 'The employee receives 54,000 SAR in Saudi Arabia (owing to the inclusion of allowances) compared to 44,000 AED in the UAE (based on basic salary with 21/30 day tiers).',
  },
  faqs: [
    {
      q: 'What is the primary difference in how salary is counted between Saudi Arabia and the UAE?',
      a: 'In Saudi Arabia, gratuity is calculated on the "actual wage" including basic salary and recurrent fixed allowances like housing and transport. In the UAE, it is strictly restricted to basic wage only, excluding all allowances.',
    },
    {
      q: 'How does voluntary employee resignation affect gratuity in Saudi Arabia?',
      a: 'Under Saudi Labor Law Article 85: Less than 2 years service grants 0%; 2 to 5 years grants one-third (33.33%); 5 to 10 years grants two-thirds (66.67%); and 10 or more years grants the full 100% award.',
    },
    {
      q: 'Is gratuity reduced if an employee resigns in the UAE under the new law?',
      a: 'No. Federal Decree-Law No. 33 of 2021 eliminated resignation reductions in the mainland private sector. Employees receive their full entitlement once they complete at least 1 year of continuous service.',
    },
    {
      q: 'Is there a maximum cap on end of service gratuity?',
      a: 'In the UAE, total gratuity cannot exceed two years’ worth of basic salary (24 months). In Saudi Arabia, there is no statutory ceiling; benefits accumulate uncapped throughout total service length.',
    },
    {
      q: 'What are the Article 87 exceptions in Saudi Arabia?',
      a: 'Article 87 grants a full 100% award upon resignation if a female employee resigns within 6 months of marriage or 3 months of giving birth, or if termination is due to certified force majeure.',
    },
    {
      q: 'How are partial and fractional years of service computed?',
      a: 'Both countries calculate partial years pro-rata down to the exact day: the remaining fractional days worked are divided by 365 and multiplied by the applicable annual tier rate.',
    },
    {
      q: 'Are unpaid leave days included when counting service length?',
      a: 'No. Periods of unpaid leave or leave without pay are legally excluded from total continuous service calculations in both Saudi Arabia and the UAE.',
    },
    {
      q: 'What is the legal deadline for employers to disburse final settlement dues?',
      a: 'Under Saudi law, employers must settle dues within 1 week of termination, or within 2 weeks if the worker resigned. Under UAE law, all entitlements must be settled within 14 calendar days of contract end.',
    },
  ],
  sources: [
    { label: 'Saudi Ministry of Human Resources Labor Education (HRSD)', url: 'https://laboreducation.hrsd.gov.sa' },
    { label: 'UAE Ministry of Human Resources and Emiratisation (MOHRE)', url: 'https://www.mohre.gov.ae' },
  ],
  updatedAt: '2026-03-01',
};

export default content;
