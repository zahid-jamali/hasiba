/**
 * Pure TypeScript calculation library for Islamic Zakat.
 * No React dependencies.
 *
 * Supports gold and silver nisab standards, multi-karat gold valuation,
 * multi-currency FX conversion, and comprehensive zakatable wealth assessment.
 */

export type SupportedCurrency =
  | 'SAR'
  | 'AED'
  | 'EGP'
  | 'KWD'
  | 'QAR'
  | 'JOD'
  | 'IQD'
  | 'OMR'
  | 'BHD'
  | 'MAD'
  | 'USD';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbolAr: string;
  symbolEn: string;
  nameAr: string;
  nameEn: string;
  decimals: number;
}

export const SUPPORTED_CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  SAR: {
    code: 'SAR',
    symbolAr: 'ر.س',
    symbolEn: 'SAR',
    nameAr: 'ريال سعودي',
    nameEn: 'Saudi Riyal',
    decimals: 2,
  },
  AED: {
    code: 'AED',
    symbolAr: 'د.إ',
    symbolEn: 'AED',
    nameAr: 'درهم إماراتي',
    nameEn: 'UAE Dirham',
    decimals: 2,
  },
  EGP: {
    code: 'EGP',
    symbolAr: 'ج.م',
    symbolEn: 'EGP',
    nameAr: 'جنيه مصري',
    nameEn: 'Egyptian Pound',
    decimals: 2,
  },
  KWD: {
    code: 'KWD',
    symbolAr: 'د.ك',
    symbolEn: 'KWD',
    nameAr: 'دينار كويتي',
    nameEn: 'Kuwaiti Dinar',
    decimals: 3,
  },
  QAR: {
    code: 'QAR',
    symbolAr: 'ر.ق',
    symbolEn: 'QAR',
    nameAr: 'ريال قطري',
    nameEn: 'Qatari Riyal',
    decimals: 2,
  },
  JOD: {
    code: 'JOD',
    symbolAr: 'د.أ',
    symbolEn: 'JOD',
    nameAr: 'دينار أردني',
    nameEn: 'Jordanian Dinar',
    decimals: 3,
  },
  IQD: {
    code: 'IQD',
    symbolAr: 'د.ع',
    symbolEn: 'IQD',
    nameAr: 'دينار عراقي',
    nameEn: 'Iraqi Dinar',
    decimals: 0,
  },
  OMR: {
    code: 'OMR',
    symbolAr: 'ر.ع',
    symbolEn: 'OMR',
    nameAr: 'ريال عماني',
    nameEn: 'Omani Rial',
    decimals: 3,
  },
  BHD: {
    code: 'BHD',
    symbolAr: 'د.ب',
    symbolEn: 'BHD',
    nameAr: 'دينار بحريني',
    nameEn: 'Bahraini Dinar',
    decimals: 3,
  },
  MAD: {
    code: 'MAD',
    symbolAr: 'د.م',
    symbolEn: 'MAD',
    nameAr: 'درهم مغربي',
    nameEn: 'Moroccan Dirham',
    decimals: 2,
  },
  USD: {
    code: 'USD',
    symbolAr: '$',
    symbolEn: 'USD',
    nameAr: 'دولار أمريكي',
    nameEn: 'US Dollar',
    decimals: 2,
  },
};

/**
 * 1 Troy Ounce = 31.1035 grams
 */
export const TROY_OUNCE_TO_GRAMS = 31.1035;

/**
 * Gold Nisab = 85 grams of 24 Karat gold
 */
export const GOLD_NISAB_GRAMS = 85;

/**
 * Silver Nisab = 595 grams of pure silver
 */
export const SILVER_NISAB_GRAMS = 595;

/**
 * Standard annual lunar Zakat rate (2.5%)
 */
export const ZAKAT_RATE = 0.025;

export type NisabStandard = 'gold' | 'silver';

export interface GoldGramsInput {
  '24K'?: number;
  '22K'?: number;
  '21K'?: number;
  '18K'?: number;
}

export interface MetalRatesInput {
  xauUsdOz: number;
  xagUsdOz: number;
  fxRate: number;
}

export interface MetalGramPrices {
  gram24K: number;
  gram22K: number;
  gram21K: number;
  gram18K: number;
  gramSilver: number;
}

export interface PricesApiResponse {
  updatedAt?: string;
  xauUsdOz: number;
  xagUsdOz: number;
  fx: Record<string, number>;
}

/**
 * Default fallback prices used when `/data/prices.json` is loading,
 * unavailable, or in test environments.
 */
export const FALLBACK_PRICES_DATA: PricesApiResponse = {
  updatedAt: '2026-03-01T00:00:00Z',
  xauUsdOz: 2685.4,
  xagUsdOz: 31.42,
  fx: {
    SAR: 3.75,
    AED: 3.6725,
    EGP: 50.15,
    KWD: 0.308,
    QAR: 3.64,
    JOD: 0.709,
    IQD: 1310,
    OMR: 0.385,
    BHD: 0.376,
    MAD: 10.05,
    USD: 1.0,
  },
};

/**
 * Computes gold per-gram prices across karats and silver per-gram price in chosen currency.
 */
export function calculateMetalPrices(rates: MetalRatesInput): MetalGramPrices {
  const gram24K = (rates.xauUsdOz / TROY_OUNCE_TO_GRAMS) * rates.fxRate;
  const gram22K = (gram24K * 22) / 24;
  const gram21K = (gram24K * 21) / 24;
  const gram18K = (gram24K * 18) / 24;
  const gramSilver = (rates.xagUsdOz / TROY_OUNCE_TO_GRAMS) * rates.fxRate;

  return {
    gram24K,
    gram22K,
    gram21K,
    gram18K,
    gramSilver,
  };
}

/**
 * Extracts metal rates for a specific currency from a prices API response,
 * falling back safely to predefined baseline rates if any value is missing or non-positive.
 */
export function getRatesForCurrency(
  data: PricesApiResponse | null | undefined,
  currency: SupportedCurrency
): MetalRatesInput {
  const source = data || FALLBACK_PRICES_DATA;

  const xauUsdOz =
    typeof source.xauUsdOz === 'number' && source.xauUsdOz > 0
      ? source.xauUsdOz
      : FALLBACK_PRICES_DATA.xauUsdOz;

  const xagUsdOz =
    typeof source.xagUsdOz === 'number' && source.xagUsdOz > 0
      ? source.xagUsdOz
      : FALLBACK_PRICES_DATA.xagUsdOz;

  let fxRate = 1;
  if (currency === 'USD') {
    fxRate = 1;
  } else if (source.fx && typeof source.fx[currency] === 'number' && source.fx[currency] > 0) {
    fxRate = source.fx[currency];
  } else if (FALLBACK_PRICES_DATA.fx[currency]) {
    fxRate = FALLBACK_PRICES_DATA.fx[currency];
  }

  return {
    xauUsdOz,
    xagUsdOz,
    fxRate,
  };
}

export interface ZakatInputs {
  cashAtHome?: number;
  bankBalances?: number;
  goldGrams?: GoldGramsInput;
  silverGrams?: number;
  investmentsMarketValue?: number;
  businessStockValue?: number;
  moneyOwedToYou?: number;
  debtsDueNow?: number;
  nisabStandard?: NisabStandard;
}

export interface AssetBreakdownItem {
  categoryKey: string;
  labelAr: string;
  labelEn: string;
  amount: number;
  percentage: number;
}

export interface ZakatCalculationResult {
  totalAssets: number;
  totalDeductions: number;
  netZakatableWealth: number;
  goldNisabValue: number;
  silverNisabValue: number;
  selectedNisabValue: number;
  isNisabReached: boolean;
  zakatDue: number;
  assetBreakdown: AssetBreakdownItem[];
  metalPrices: MetalGramPrices;
  nisabStandard: NisabStandard;
}

/**
 * Pure calculation function for Zakat.
 * Computes gross assets, deductions, net wealth, nisab thresholds,
 * whether nisab is reached, and zakat due (2.5%).
 */
export function calculateZakat(
  inputs: ZakatInputs & { selectedCurrency?: SupportedCurrency },
  metalRatesInput: MetalRatesInput | PricesApiResponse,
  currency?: SupportedCurrency
): ZakatCalculationResult {
  let metalRates: MetalRatesInput;
  if ('fxRate' in metalRatesInput && typeof metalRatesInput.fxRate === 'number') {
    metalRates = metalRatesInput;
  } else {
    const chosenCurr = currency || inputs.selectedCurrency || 'SAR';
    metalRates = getRatesForCurrency(metalRatesInput as PricesApiResponse, chosenCurr);
  }

  const metalPrices = calculateMetalPrices(metalRates);
  const nisabStandard: NisabStandard = inputs.nisabStandard === 'silver' ? 'silver' : 'gold';

  // Sanitize numeric inputs (non-negative)
  const cashAtHome = Math.max(0, Number(inputs.cashAtHome) || 0);
  const bankBalances = Math.max(0, Number(inputs.bankBalances) || 0);
  const cashTotal = cashAtHome + bankBalances;

  const gold24K = Math.max(0, Number(inputs.goldGrams?.['24K']) || 0);
  const gold22K = Math.max(0, Number(inputs.goldGrams?.['22K']) || 0);
  const gold21K = Math.max(0, Number(inputs.goldGrams?.['21K']) || 0);
  const gold18K = Math.max(0, Number(inputs.goldGrams?.['18K']) || 0);

  const goldValue =
    gold24K * metalPrices.gram24K +
    gold22K * metalPrices.gram22K +
    gold21K * metalPrices.gram21K +
    gold18K * metalPrices.gram18K;

  const silverGrams = Math.max(0, Number(inputs.silverGrams) || 0);
  const silverValue = silverGrams * metalPrices.gramSilver;

  const investmentsMarketValue = Math.max(0, Number(inputs.investmentsMarketValue) || 0);
  const businessStockValue = Math.max(0, Number(inputs.businessStockValue) || 0);
  const moneyOwedToYou = Math.max(0, Number(inputs.moneyOwedToYou) || 0);
  const debtsDueNow = Math.max(0, Number(inputs.debtsDueNow) || 0);

  const totalAssets =
    cashTotal +
    goldValue +
    silverValue +
    investmentsMarketValue +
    businessStockValue +
    moneyOwedToYou;

  const totalDeductions = debtsDueNow;
  const netZakatableWealth = Math.max(0, totalAssets - totalDeductions);

  // Nisab threshold values
  const goldNisabValue = GOLD_NISAB_GRAMS * metalPrices.gram24K;
  const silverNisabValue = SILVER_NISAB_GRAMS * metalPrices.gramSilver;

  const selectedNisabValue = nisabStandard === 'silver' ? silverNisabValue : goldNisabValue;

  const isNisabReached = selectedNisabValue > 0 && netZakatableWealth >= selectedNisabValue;
  const zakatDue = isNisabReached ? netZakatableWealth * ZAKAT_RATE : 0;

  // Breakdown items with relative percentages of gross assets
  const breakdownData: Array<{
    categoryKey: string;
    labelAr: string;
    labelEn: string;
    amount: number;
  }> = [
    {
      categoryKey: 'cash',
      labelAr: 'السيولة النقدية والأرصدة البنكية',
      labelEn: 'Cash & Bank Balances',
      amount: cashTotal,
    },
    {
      categoryKey: 'gold',
      labelAr: 'الذهب بجميع عياراته',
      labelEn: 'Gold Holdings',
      amount: goldValue,
    },
    {
      categoryKey: 'silver',
      labelAr: 'الفضة الخالصة',
      labelEn: 'Silver Holdings',
      amount: silverValue,
    },
    {
      categoryKey: 'investments',
      labelAr: 'الأسهم والصناديق الاستثمارية',
      labelEn: 'Investments & Shares',
      amount: investmentsMarketValue,
    },
    {
      categoryKey: 'businessStock',
      labelAr: 'عروض التجارة والبضائع المعدة للبيع',
      labelEn: 'Business Inventory & Goods',
      amount: businessStockValue,
    },
    {
      categoryKey: 'moneyOwedToYou',
      labelAr: 'ديون مرجوة السداد لك لدى الغير',
      labelEn: 'Debts Owed to You (Good Debts)',
      amount: moneyOwedToYou,
    },
  ];

  const assetBreakdown: AssetBreakdownItem[] = breakdownData.map((item) => ({
    ...item,
    percentage: totalAssets > 0 ? (item.amount / totalAssets) * 100 : 0,
  }));

  return {
    totalAssets,
    totalDeductions,
    netZakatableWealth,
    goldNisabValue,
    silverNisabValue,
    selectedNisabValue,
    isNisabReached,
    zakatDue,
    assetBreakdown,
    metalPrices,
    nisabStandard,
  };
}
