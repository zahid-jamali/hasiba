import { describe, it, expect } from 'vitest';
import { calculateSaudiGratuity } from './gratuity-ksa';

describe('Saudi Labor Law End of Service Award (Articles 84, 85, 87)', () => {
  it('calculates 3 years under employer termination / contract end (3 * 0.5 month)', () => {
    const contractWageMonthly = 10000;
    // 3 years * 0.5 * 10,000 = 1.5 months = 15,000 SAR
    const result = calculateSaudiGratuity({
      contractWageMonthly,
      startDate: '2020-01-01',
      endDate: '2023-01-01',
      separationReason: 'termination_or_end',
    });

    expect(result.serviceYears).toBe(3);
    expect(result.firstFiveYearsAward).toBe(15000);
    expect(result.subsequentYearsAward).toBe(0);
    expect(result.baseAwardTotal).toBe(15000);
    expect(result.appliedArticle).toBe('Article 84');
    expect(result.resignationRatio).toBe(1);
    expect(result.resignationRatioPercentage).toBe(100);
    expect(result.finalGratuityPayable).toBe(15000);
  });

  it('calculates 3 years under resignation (1/3 of 1.5 months = 0.5 month)', () => {
    const contractWageMonthly = 10000;
    // Base award = 3 * 0.5 * 10,000 = 15,000 SAR
    // Article 85 ratio for 3 years (2 to < 5 yrs) = 1/3
    // Final payable = 15,000 * (1/3) = 5,000 SAR (0.5 month wage)
    const result = calculateSaudiGratuity({
      contractWageMonthly,
      startDate: '2020-01-01',
      endDate: '2023-01-01',
      separationReason: 'resignation',
    });

    expect(result.serviceYears).toBe(3);
    expect(result.baseAwardTotal).toBe(15000);
    expect(result.appliedArticle).toBe('Article 85');
    expect(result.resignationRatio).toBeCloseTo(1 / 3, 4);
    expect(result.resignationRatioPercentage).toBe(33.33);
    expect(result.awardAfterResignationRatio).toBe(5000);
    expect(result.finalGratuityPayable).toBe(5000);
  });

  it('calculates 7 years under resignation (2/3 of award)', () => {
    const contractWageMonthly = 10000;
    // First 5 years = 5 * 0.5 * 10,000 = 25,000 SAR
    // Next 2 years = 2 * 1.0 * 10,000 = 20,000 SAR
    // Total base award = 45,000 SAR
    // Article 85 ratio for 7 years (5 to < 10 yrs) = 2/3
    // Final payable = 45,000 * (2/3) = 30,000 SAR
    const result = calculateSaudiGratuity({
      contractWageMonthly,
      startDate: '2016-01-01',
      endDate: '2023-01-01',
      separationReason: 'resignation',
    });

    expect(result.serviceYears).toBe(7);
    expect(result.firstFiveYearsAward).toBe(25000);
    expect(result.subsequentYearsAward).toBe(20000);
    expect(result.baseAwardTotal).toBe(45000);
    expect(result.appliedArticle).toBe('Article 85');
    expect(result.resignationRatio).toBeCloseTo(2 / 3, 4);
    expect(result.resignationRatioPercentage).toBe(66.67);
    expect(result.awardAfterResignationRatio).toBe(30000);
    expect(result.finalGratuityPayable).toBe(30000);
  });

  it('calculates 12 years under resignation (100% full award)', () => {
    const contractWageMonthly = 12000;
    // First 5 years = 5 * 0.5 * 12,000 = 30,000 SAR
    // Next 7 years = 7 * 1.0 * 12,000 = 84,000 SAR
    // Total base award = 114,000 SAR
    // Article 85 ratio for 12 years (10+ yrs) = 1 (100%)
    const result = calculateSaudiGratuity({
      contractWageMonthly,
      startDate: '2011-01-01',
      endDate: '2023-01-01',
      separationReason: 'resignation',
    });

    expect(result.serviceYears).toBe(12);
    expect(result.firstFiveYearsAward).toBe(30000);
    expect(result.subsequentYearsAward).toBe(84000);
    expect(result.baseAwardTotal).toBe(114000);
    expect(result.appliedArticle).toBe('Article 85');
    expect(result.resignationRatio).toBe(1);
    expect(result.resignationRatioPercentage).toBe(100);
    expect(result.finalGratuityPayable).toBe(114000);
  });

  it('applies Article 87 exception (female resignation after marriage at 3 years -> 100% full award)', () => {
    const contractWageMonthly = 10000;
    // 3 years base award = 15,000 SAR
    // Under standard resignation, ratio would be 1/3 (5,000 SAR).
    // Under Article 87 exception, ratio is 100% -> 15,000 SAR.
    const result = calculateSaudiGratuity({
      contractWageMonthly,
      startDate: '2020-01-01',
      endDate: '2023-01-01',
      separationReason: 'resignation',
      isArticle87Exception: true,
    });

    expect(result.serviceYears).toBe(3);
    expect(result.baseAwardTotal).toBe(15000);
    expect(result.appliedArticle).toBe('Article 87');
    expect(result.resignationRatio).toBe(1);
    expect(result.resignationRatioPercentage).toBe(100);
    expect(result.finalGratuityPayable).toBe(15000);
  });

  it('yields 0 gratuity under resignation when continuous service is under 2 years', () => {
    // 1 year and 6 months of service
    const result = calculateSaudiGratuity({
      contractWageMonthly: 8000,
      startDate: '2022-01-01',
      endDate: '2023-07-01',
      separationReason: 'resignation',
      isArticle87Exception: false,
    });

    expect(result.serviceYears).toBe(1);
    expect(result.appliedArticle).toBe('Article 85');
    expect(result.resignationRatio).toBe(0);
    expect(result.resignationRatioPercentage).toBe(0);
    expect(result.awardAfterResignationRatio).toBe(0);
    expect(result.finalGratuityPayable).toBe(0);
  });

  it('subtracts unpaid leave days from service length', () => {
    const contractWageMonthly = 10000;
    // 5 years gross service (2018 to 2023).
    // With 365 unpaid leave days, net service is 4 years.
    // 4 years * 0.5 * 10,000 = 20,000 SAR
    const result = calculateSaudiGratuity({
      contractWageMonthly,
      startDate: '2018-01-01',
      endDate: '2023-01-01',
      separationReason: 'termination_or_end',
      unpaidLeaveDays: 365,
    });

    expect(result.serviceYears).toBe(4);
    expect(result.baseAwardTotal).toBe(20000);
    expect(result.finalGratuityPayable).toBe(20000);
  });

  it('subtracts employer deductions from final gratuity and clamps to 0', () => {
    const result = calculateSaudiGratuity({
      contractWageMonthly: 10000,
      startDate: '2020-01-01',
      endDate: '2023-01-01',
      separationReason: 'termination_or_end',
      employerDeductions: 5000,
    });

    // Base award = 15,000 SAR. Minus 5,000 = 10,000 SAR.
    expect(result.deductions).toBe(5000);
    expect(result.finalGratuityPayable).toBe(10000);

    // If deductions exceed award:
    const clampedResult = calculateSaudiGratuity({
      contractWageMonthly: 10000,
      startDate: '2020-01-01',
      endDate: '2023-01-01',
      separationReason: 'termination_or_end',
      employerDeductions: 50000,
    });

    expect(clampedResult.finalGratuityPayable).toBe(0);
  });

  it('throws for negative contract wage or invalid date ordering', () => {
    expect(() =>
      calculateSaudiGratuity({
        contractWageMonthly: -500,
        startDate: '2021-01-01',
        endDate: '2023-01-01',
        separationReason: 'termination_or_end',
      })
    ).toThrow('Contract monthly wage cannot be negative.');

    expect(() =>
      calculateSaudiGratuity({
        contractWageMonthly: 5000,
        startDate: '2023-01-01',
        endDate: '2021-01-01',
        separationReason: 'termination_or_end',
      })
    ).toThrow('End date cannot be earlier than start date.');
  });
});
