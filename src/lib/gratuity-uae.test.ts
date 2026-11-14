import { describe, it, expect } from 'vitest';
import { calculateUaeGratuity, parseDateOnly } from './gratuity-uae';

describe('UAE End of Service Gratuity (Decree-Law 33 of 2021)', () => {
  it('parses date strings and objects correctly', () => {
    const d1 = parseDateOnly('2023-05-15');
    expect(d1.getUTCFullYear()).toBe(2023);
    expect(d1.getUTCMonth()).toBe(4); // 0-indexed May
    expect(d1.getUTCDate()).toBe(15);

    const d2 = parseDateOnly(new Date(Date.UTC(2024, 0, 1)));
    expect(d2.getUTCFullYear()).toBe(2024);
    expect(d2.getUTCMonth()).toBe(0);
    expect(d2.getUTCDate()).toBe(1);
  });

  it('returns 0 gratuity for continuous service under 1 year', () => {
    // 6 months of service
    const result = calculateUaeGratuity({
      basicSalaryMonthly: 12000,
      startDate: '2023-01-01',
      endDate: '2023-07-01',
    });

    expect(result.serviceYears).toBe(0);
    expect(result.serviceMonths).toBe(6);
    expect(result.rawGratuityTotal).toBe(0);
    expect(result.finalGratuityPayable).toBe(0);
    expect(result.isCapped).toBe(false);
  });

  it('calculates exactly 3 years (3 * 21 days of basic wage)', () => {
    const basicSalaryMonthly = 10000;
    // Daily wage = 10000 / 30 = 333.333...
    // 3 years * 21 days * (10000 / 30) = 3 * 7,000 = 21,000 AED
    const result = calculateUaeGratuity({
      basicSalaryMonthly,
      startDate: '2020-01-01',
      endDate: '2023-01-01',
    });

    expect(result.serviceYears).toBe(3);
    expect(result.serviceMonths).toBe(0);
    expect(result.serviceDays).toBe(0);
    expect(result.dailyWage).toBe(333.33);
    expect(result.firstFiveYearsAmount).toBe(21000);
    expect(result.subsequentYearsAmount).toBe(0);
    expect(result.rawGratuityTotal).toBe(21000);
    expect(result.finalGratuityPayable).toBe(21000);
    expect(result.isCapped).toBe(false);
  });

  it('calculates 7 years (5 yrs * 21 days + 2 yrs * 30 days)', () => {
    const basicSalaryMonthly = 15000;
    // Daily wage = 15000 / 30 = 500 AED
    // First 5 years = 5 * 21 * 500 = 52,500 AED
    // Next 2 years = 2 * 30 * 500 = 30,000 AED
    // Total raw = 52,500 + 30,000 = 82,500 AED
    const result = calculateUaeGratuity({
      basicSalaryMonthly,
      startDate: '2016-01-01',
      endDate: '2023-01-01',
    });

    expect(result.serviceYears).toBe(7);
    expect(result.dailyWage).toBe(500);
    expect(result.firstFiveYearsAmount).toBe(52500);
    expect(result.subsequentYearsAmount).toBe(30000);
    expect(result.rawGratuityTotal).toBe(82500);
    expect(result.finalGratuityPayable).toBe(82500);
    expect(result.isCapped).toBe(false);
  });

  it('calculates 12 years (5 yrs * 21 days + 7 yrs * 30 days)', () => {
    const basicSalaryMonthly = 10000;
    // Daily wage = 10000 / 30 = 333.333... AED
    // First 5 years = 5 * 21 * (10000 / 30) = 35,000 AED
    // Next 7 years = 7 * 30 * (10000 / 30) = 70,000 AED
    // Total = 35,000 + 70,000 = 105,000 AED
    const result = calculateUaeGratuity({
      basicSalaryMonthly,
      startDate: '2011-01-01',
      endDate: '2023-01-01',
    });

    expect(result.serviceYears).toBe(12);
    expect(result.firstFiveYearsAmount).toBe(35000);
    expect(result.subsequentYearsAmount).toBe(70000);
    expect(result.rawGratuityTotal).toBe(105000);
    expect(result.finalGratuityPayable).toBe(105000);
    expect(result.isCapped).toBe(false);
  });

  it('enforces the statutory 2-year basic wage cap (e.g. 26+ years exceeding 24 months salary)', () => {
    const basicSalaryMonthly = 10000;
    // 2-year cap = 24 * 10,000 = 240,000 AED
    // For 26 years:
    // First 5 years = 35,000 AED
    // Next 21 years = 21 * 10,000 = 210,000 AED
    // Raw total = 245,000 AED > 240,000 AED (capped!)
    const result = calculateUaeGratuity({
      basicSalaryMonthly,
      startDate: '1997-01-01',
      endDate: '2023-01-01',
    });

    expect(result.serviceYears).toBe(26);
    expect(result.rawGratuityTotal).toBe(245000);
    expect(result.isCapped).toBe(true);
    expect(result.capAmount).toBe(240000);
    expect(result.finalGratuityPayable).toBe(240000);
  });

  it('deducts unpaid leave days from service and applies employer deductions', () => {
    const basicSalaryMonthly = 10000;
    // 3 years would be 2020-01-01 to 2023-01-01.
    // With 365 unpaid leave days, effective service drops by 1 full year to 2 years!
    // 2 years * 21 * (10000 / 30) = 14,000 AED
    // With employer deductions = 4,000 AED
    // Final payable = 14,000 - 4,000 = 10,000 AED
    const result = calculateUaeGratuity({
      basicSalaryMonthly,
      startDate: '2020-01-01',
      endDate: '2023-01-01',
      unpaidLeaveDays: 365,
      employerDeductions: 4000,
    });

    expect(result.unpaidLeaveDaysExcluded).toBe(365);
    expect(result.serviceYears).toBe(2);
    expect(result.rawGratuityTotal).toBe(14000);
    expect(result.deductions).toBe(4000);
    expect(result.finalGratuityPayable).toBe(10000);
  });

  it('deducts unpaid leave reducing service to under 1 year, yielding 0 gratuity', () => {
    // 1 year and 10 days of employment, but 30 days of unpaid leave -> Net < 1 year
    const result = calculateUaeGratuity({
      basicSalaryMonthly: 8000,
      startDate: '2022-01-01',
      endDate: '2023-01-11',
      unpaidLeaveDays: 30,
    });

    expect(result.serviceYears).toBe(0);
    expect(result.finalGratuityPayable).toBe(0);
  });

  it('clamps final gratuity payable to 0 if employer deductions exceed total gratuity', () => {
    const result = calculateUaeGratuity({
      basicSalaryMonthly: 5000,
      startDate: '2021-01-01',
      endDate: '2023-01-01',
      employerDeductions: 20000, // Exceeds 2 * 21 * (5000 / 30) = 7,000 AED
    });

    expect(result.rawGratuityTotal).toBe(7000);
    expect(result.deductions).toBe(20000);
    expect(result.finalGratuityPayable).toBe(0);
  });

  it('calculates pro-rata fraction for partial year accurately', () => {
    // 2 years and 73 days (73 / 365 = exactly 0.2 year)
    // 2.2 years * 21 * (10000 / 30) = 2.2 * 7,000 = 15,400 AED
    const result = calculateUaeGratuity({
      basicSalaryMonthly: 10000,
      startDate: '2021-01-01',
      endDate: '2023-03-15', // Jan 1 2021 to Jan 1 2023 is 2 years. Jan 1 to Mar 15 in 2023 = 31 (Jan) + 28 (Feb) + 14 = 73 days
    });

    expect(result.serviceYears).toBe(2);
    expect(result.firstFiveYearsAmount).toBe(15400);
    expect(result.rawGratuityTotal).toBe(15400);
  });

  it('throws for negative salary or end date before start date', () => {
    expect(() =>
      calculateUaeGratuity({
        basicSalaryMonthly: -100,
        startDate: '2022-01-01',
        endDate: '2023-01-01',
      })
    ).toThrow('Basic salary cannot be negative.');

    expect(() =>
      calculateUaeGratuity({
        basicSalaryMonthly: 5000,
        startDate: '2023-01-01',
        endDate: '2022-01-01',
      })
    ).toThrow('End date cannot be earlier than start date.');
  });
});
