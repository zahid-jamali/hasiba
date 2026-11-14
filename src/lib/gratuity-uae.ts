/**
 * UAE Federal Decree-Law No. 33 of 2021 (Regulation of Labour Relations).
 * End of Service Gratuity (EOSG) Calculation for the Private Sector.
 *
 * Key Statutory Rules:
 * - Qualifying period: At least 1 year of continuous service (excluding unpaid leave).
 * - Under 1 year continuous service = 0 gratuity.
 * - Years 1 to 5: 21 calendar days of basic wage for each year of service.
 * - Subsequent years (Year 6+): 30 calendar days of basic wage for each year of service.
 * - Partial years: Calculated pro-rata down to the exact day (using 365 days / year).
 * - Daily wage assumption: Basic monthly salary / 30 (explicit statutory basis).
 * - Resignation rule: Under Decree-Law 33 of 2021, resignation does NOT reduce gratuity.
 * - 2-Year Cap: Total gratuity cannot exceed 2 years' basic wage (24 * basicSalaryMonthly).
 * - Unpaid leave: Excluded from continuous service length.
 * - Employer deductions: Subtracted from final gratuity payable (minimum 0).
 */

export interface UaeGratuityInput {
  basicSalaryMonthly: number; // AED
  startDate: Date | string; // YYYY-MM-DD
  endDate: Date | string; // Last working day
  unpaidLeaveDays?: number; // Default 0, excluded from continuous service
  employerDeductions?: number; // Default 0, subtracted from final gratuity
}

export interface UaeGratuityResult {
  totalServiceDays: number;
  serviceYears: number;
  serviceMonths: number;
  serviceDays: number;
  unpaidLeaveDaysExcluded: number;
  dailyWage: number;
  firstFiveYearsAmount: number;
  subsequentYearsAmount: number;
  rawGratuityTotal: number;
  isCapped: boolean;
  capAmount: number;
  deductions: number;
  finalGratuityPayable: number;
}

/**
 * Parses a Date object or YYYY-MM-DD string into a normalized UTC Date.
 */
export function parseDateOnly(input: Date | string): Date {
  if (input instanceof Date) {
    if (isNaN(input.getTime())) {
      throw new Error('Invalid Date object provided.');
    }
    return new Date(Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate()));
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    const isoDate = trimmed.split('T')[0];
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const d = new Date(Date.UTC(year, month - 1, day));
        if (!isNaN(d.getTime())) {
          return d;
        }
      }
    }
    const fallback = new Date(trimmed);
    if (!isNaN(fallback.getTime())) {
      return new Date(Date.UTC(fallback.getUTCFullYear(), fallback.getUTCMonth(), fallback.getUTCDate()));
    }
  }

  throw new Error(`Invalid date string: "${input}"`);
}

/**
 * Helper to round to 2 decimal places.
 */
function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates UAE end of service gratuity according to Federal Decree-Law No. 33 of 2021.
 */
export function calculateUaeGratuity(input: UaeGratuityInput): UaeGratuityResult {
  const {
    basicSalaryMonthly,
    startDate,
    endDate,
    unpaidLeaveDays = 0,
    employerDeductions = 0,
  } = input;

  if (basicSalaryMonthly < 0) {
    throw new Error('Basic salary cannot be negative.');
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

  // Effective end date after removing unpaid leave days
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

  // Statutory Daily Wage assumption: monthly basic / 30
  const dailyWageExact = basicSalaryMonthly / 30;
  const dailyWage = round2(dailyWageExact);

  // Cap: 2 years' basic wage (24 months)
  const capAmount = round2(24 * basicSalaryMonthly);

  // If service is less than 1 year, no gratuity is payable
  if (serviceYears < 1) {
    return {
      totalServiceDays,
      serviceYears,
      serviceMonths,
      serviceDays,
      unpaidLeaveDaysExcluded: unpaidExcluded,
      dailyWage,
      firstFiveYearsAmount: 0,
      subsequentYearsAmount: 0,
      rawGratuityTotal: 0,
      isCapped: false,
      capAmount,
      deductions,
      finalGratuityPayable: 0,
    };
  }

  // 1. First 5 years calculation (21 days of basic wage per year)
  // Annual entitlement for first 5 years = 21 * (basicSalary / 30) = 0.7 * basicSalary
  const annualFirst5Exact = 21 * dailyWageExact;
  const first5FullYears = Math.min(5, serviceYears);
  let firstFiveYearsAmountExact = first5FullYears * annualFirst5Exact;

  // 2. Subsequent years calculation (30 days of basic wage per year = 1 month's salary)
  const annualSubsequentExact = 30 * dailyWageExact;
  const subsequentFullYears = Math.max(0, serviceYears - 5);
  let subsequentYearsAmountExact = subsequentFullYears * annualSubsequentExact;

  // 3. Pro-rata calculation for partial year days
  if (fractionDays > 0) {
    if (serviceYears < 5) {
      // Fraction falls within first 5 years
      const fractionAmount = (fractionDays / 365) * annualFirst5Exact;
      firstFiveYearsAmountExact += fractionAmount;
    } else {
      // Fraction falls in subsequent years
      const fractionAmount = (fractionDays / 365) * annualSubsequentExact;
      subsequentYearsAmountExact += fractionAmount;
    }
  }

  const rawGratuityTotalExact = firstFiveYearsAmountExact + subsequentYearsAmountExact;
  const isCapped = rawGratuityTotalExact > capAmount;
  const cappedAmountExact = isCapped ? capAmount : rawGratuityTotalExact;

  const firstFiveYearsAmount = round2(firstFiveYearsAmountExact);
  const subsequentYearsAmount = round2(subsequentYearsAmountExact);
  const rawGratuityTotal = round2(rawGratuityTotalExact);

  const finalGratuityPayable = Math.max(0, round2(cappedAmountExact - deductions));

  return {
    totalServiceDays,
    serviceYears,
    serviceMonths,
    serviceDays,
    unpaidLeaveDaysExcluded: unpaidExcluded,
    dailyWage,
    firstFiveYearsAmount,
    subsequentYearsAmount,
    rawGratuityTotal,
    isCapped,
    capAmount,
    deductions,
    finalGratuityPayable,
  };
}
