/**
 * Saudi Labor Law (Royal Decree No. M/51 as amended).
 * End of Service Award (مكافأة نهاية الخدمة) Calculation (Articles 84, 85, 87).
 *
 * Statutory Rules:
 * 1. Article 84 (Base Award):
 *    - Calculated based on the worker's LAST actual wage (Basic salary + fixed allowances e.g. housing, transport).
 *    - First 5 years: Half a month's wage (0.5 * contractWageMonthly) for each year.
 *    - Subsequent years (Year 6+): One full month's wage (1.0 * contractWageMonthly) for each year.
 *    - Parts of a year: Pro-rata entitlement according to time spent at work (using 365 days / year).
 *
 * 2. Article 85 (Resignation Sliding Scale):
 *    If employment ends due to employee resignation:
 *    - Continuous service < 2 years: 0% entitlement (no award).
 *    - Continuous service 2 to < 5 years: 1/3 (33.33%) of the base award.
 *    - Continuous service 5 to < 10 years: 2/3 (66.67%) of the base award.
 *    - Continuous service 10+ years: 100% (full award).
 *
 * 3. Article 87 (Exceptions to Article 85):
 *    The worker is entitled to the FULL award (100%) even under resignation if:
 *    - Resignation due to force majeure.
 *    - Female employee terminating contract within 6 months of marriage.
 *    - Female employee terminating contract within 3 months of giving birth.
 *
 * 4. Contract Termination or Expiry:
 *    - If contract terminated by employer or fixed term ends: 100% full award always.
 */

import { parseDateOnly } from './gratuity-uae';

export type SaudiSeparationReason = 'termination_or_end' | 'resignation';

export interface SaudiGratuityInput {
  contractWageMonthly: number; // SAR (Actual wage: basic + fixed recurrent allowances)
  startDate: Date | string; // Employment start date
  endDate: Date | string; // Last working day
  separationReason: SaudiSeparationReason; // End/termination vs resignation
  isArticle87Exception?: boolean; // True for marriage/birth/force majeure exceptions
  unpaidLeaveDays?: number; // Default 0, excluded from continuous service
  employerDeductions?: number; // Default 0, subtracted from final gratuity
}

export interface SaudiGratuityResult {
  totalServiceDays: number;
  serviceYears: number;
  serviceMonths: number;
  serviceDays: number;
  unpaidLeaveDaysExcluded: number;
  contractWageMonthly: number;
  firstFiveYearsAward: number;
  subsequentYearsAward: number;
  baseAwardTotal: number;
  resignationRatio: number; // 0, 1/3, 2/3, 1
  resignationRatioPercentage: number; // 0, 33.33, 66.67, 100
  appliedArticle: 'Article 84' | 'Article 85' | 'Article 87';
  awardAfterResignationRatio: number;
  deductions: number;
  finalGratuityPayable: number;
}

/**
 * Helper to round to 2 decimal places.
 */
function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates Saudi End of Service Award according to Articles 84, 85, and 87 of Saudi Labor Law.
 */
export function calculateSaudiGratuity(input: SaudiGratuityInput): SaudiGratuityResult {
  const {
    contractWageMonthly,
    startDate,
    endDate,
    separationReason,
    isArticle87Exception = false,
    unpaidLeaveDays = 0,
    employerDeductions = 0,
  } = input;

  if (contractWageMonthly < 0) {
    throw new Error('Contract monthly wage cannot be negative.');
  }

  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (end < start) {
    throw new Error('End date cannot be earlier than start date.');
  }

  const unpaidExcluded = Math.max(0, unpaidLeaveDays);
  const deductions = Math.max(0, employerDeductions);

  // Gross calendar days
  const grossDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const totalServiceDays = Math.max(0, grossDays - unpaidExcluded);

  // Effective end date after excluding unpaid leave
  const effectiveEnd = new Date(end.getTime() - unpaidExcluded * (1000 * 60 * 60 * 24));

  let serviceYears = 0;
  let serviceMonths = 0;
  let serviceDays = 0;
  let fractionDays = 0;

  if (effectiveEnd > start) {
    let y = effectiveEnd.getUTCFullYear() - start.getUTCFullYear();
    let m = effectiveEnd.getUTCMonth() - start.getUTCMonth();
    let d = effectiveEnd.getUTCDate() - start.getUTCDate();

    if (d < 0) {
      m -= 1;
      const prevMonthLastDay = new Date(Date.UTC(effectiveEnd.getUTCFullYear(), effectiveEnd.getUTCMonth(), 0)).getUTCDate();
      d += prevMonthLastDay;
    }

    if (m < 0) {
      y -= 1;
      m += 12;
    }

    serviceYears = Math.max(0, y);
    serviceMonths = Math.max(0, m);
    serviceDays = Math.max(0, d);

    // Days elapsed after the last full completed anniversary year
    const lastAnniversary = new Date(Date.UTC(start.getUTCFullYear() + serviceYears, start.getUTCMonth(), start.getUTCDate()));
    fractionDays = Math.max(0, Math.round((effectiveEnd.getTime() - lastAnniversary.getTime()) / (1000 * 60 * 60 * 24)));
  }

  // 1. Article 84 Base Award Calculation
  // First 5 years: 0.5 * contractWageMonthly per year
  const annualRateFirst5Exact = 0.5 * contractWageMonthly;
  const first5FullYears = Math.min(5, serviceYears);
  let firstFiveYearsAwardExact = first5FullYears * annualRateFirst5Exact;

  // Subsequent years (Year 6+): 1.0 * contractWageMonthly per year
  const annualRateSubsequentExact = 1.0 * contractWageMonthly;
  const subsequentFullYears = Math.max(0, serviceYears - 5);
  let subsequentYearsAwardExact = subsequentFullYears * annualRateSubsequentExact;

  // Partial year fraction
  if (fractionDays > 0) {
    if (serviceYears < 5) {
      const fractionAmount = (fractionDays / 365) * annualRateFirst5Exact;
      firstFiveYearsAwardExact += fractionAmount;
    } else {
      const fractionAmount = (fractionDays / 365) * annualRateSubsequentExact;
      subsequentYearsAwardExact += fractionAmount;
    }
  }

  const baseAwardTotalExact = firstFiveYearsAwardExact + subsequentYearsAwardExact;

  // 2. Article 85 / 87 Resignation Scale & Statutory Article
  let resignationRatio = 1;
  let resignationRatioPercentage = 100;
  let appliedArticle: 'Article 84' | 'Article 85' | 'Article 87' = 'Article 84';

  const totalEffectiveServiceYears = serviceYears + fractionDays / 365;

  if (separationReason === 'termination_or_end') {
    appliedArticle = 'Article 84';
    resignationRatio = 1;
    resignationRatioPercentage = 100;
  } else if (separationReason === 'resignation') {
    if (isArticle87Exception) {
      appliedArticle = 'Article 87';
      resignationRatio = 1;
      resignationRatioPercentage = 100;
    } else {
      appliedArticle = 'Article 85';
      if (totalEffectiveServiceYears < 2) {
        resignationRatio = 0;
        resignationRatioPercentage = 0;
      } else if (totalEffectiveServiceYears < 5) {
        resignationRatio = 1 / 3;
        resignationRatioPercentage = 33.33;
      } else if (totalEffectiveServiceYears < 10) {
        resignationRatio = 2 / 3;
        resignationRatioPercentage = 66.67;
      } else {
        resignationRatio = 1;
        resignationRatioPercentage = 100;
      }
    }
  }

  // 3. Final calculations with deductions
  const awardAfterResignationRatioExact = baseAwardTotalExact * resignationRatio;
  const firstFiveYearsAward = round2(firstFiveYearsAwardExact);
  const subsequentYearsAward = round2(subsequentYearsAwardExact);
  const baseAwardTotal = round2(baseAwardTotalExact);
  const awardAfterResignationRatio = round2(awardAfterResignationRatioExact);

  const finalGratuityPayable = Math.max(0, round2(awardAfterResignationRatioExact - deductions));

  return {
    totalServiceDays,
    serviceYears,
    serviceMonths,
    serviceDays,
    unpaidLeaveDaysExcluded: unpaidExcluded,
    contractWageMonthly: round2(contractWageMonthly),
    firstFiveYearsAward,
    subsequentYearsAward,
    baseAwardTotal,
    resignationRatio,
    resignationRatioPercentage,
    appliedArticle,
    awardAfterResignationRatio,
    deductions,
    finalGratuityPayable,
  };
}
