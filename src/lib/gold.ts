/**
 * src/lib/gold.ts
 * Pure calculation functions for gold & silver pricing, karats, and value computation.
 */

export const TROY_OUNCE_GRAMS = 31.1035;
export const TOLA_GRAMS = 11.6638;
export const EGYPTIAN_GOLD_POUND_GRAMS = 8; // 8 grams of 21K gold

export type KaratKey = '24K' | '22K' | '21K' | '18K';

export const KARAT_PURITIES: Record<KaratKey, number> = {
  '24K': 1,
  '22K': 22 / 24,
  '21K': 21 / 24,
  '18K': 18 / 24,
};

export type GoldCountryCode =
  | 'sa'
  | 'ae'
  | 'eg'
  | 'kw'
  | 'qa'
  | 'jo'
  | 'iq'
  | 'om'
  | 'bh'
  | 'ma';

export interface GoldCountryConfig {
  slug: GoldCountryCode;
  currency: string;
  name: {
    ar: string;
    en: string;
  };
  currencyName: {
    ar: string;
    en: string;
  };
  currencySymbol: {
    ar: string;
    en: string;
  };
  popularKarat: KaratKey;
  vatRateText: {
    ar: string;
    en: string;
  };
  makingChargesText: {
    ar: string;
    en: string;
  };
  marketNote: {
    ar: string;
    en: string;
  };
}

export const GOLD_COUNTRIES: Record<GoldCountryCode, GoldCountryConfig> = {
  sa: {
    slug: 'sa',
    currency: 'SAR',
    name: { ar: 'السعودية', en: 'Saudi Arabia' },
    currencyName: { ar: 'ريال سعودي', en: 'Saudi Riyal' },
    currencySymbol: { ar: 'ر.س', en: 'SAR' },
    popularKarat: '21K',
    vatRateText: {
      ar: 'المعادن الثمينة الاستثمارية (عيار 99% فأكثر) خاضعة لنسبة صفرية (0%)، وتُفرض ضريبة 15% على المصنعية في المشغولات الذهبية.',
      en: 'Investment gold (99%+ purity) is 0% VAT. 15% VAT applies to jewelry making charges.',
    },
    makingChargesText: {
      ar: 'تتراوح المصنعية عادة بين 25 و65 ريالاً للجرام حسب دقة التصميم والعلامة التجارية.',
      en: 'Typical making charges range between 25 and 65 SAR per gram.',
    },
    marketNote: {
      ar: 'يعد عيار 21 الأكثر شعبية وتداولاً في كافة مناطق المملكة العربية السعودية للمناسبات والادخار.',
      en: '21K is the dominant gold karat across all Saudi regions for adornment and savings.',
    },
  },
  ae: {
    slug: 'ae',
    currency: 'AED',
    name: { ar: 'الإمارات', en: 'United Arab Emirates' },
    currencyName: { ar: 'درهم إماراتي', en: 'UAE Dirham' },
    currencySymbol: { ar: 'د.إ', en: 'AED' },
    popularKarat: '22K',
    vatRateText: {
      ar: 'يخضع الذهب الاستثماري بنقاء 99% فأكثر لنظام التكليف العكسي (0%)، بينما تطبق ضريبة 5% على المشغولات.',
      en: 'Investment grade gold (99%+) qualifies for reverse-charge VAT. 5% VAT applies to jewelry retail.',
    },
    makingChargesText: {
      ar: 'تتراوح المصنعية في سوق دبي للذهب بين 15 و45 درهماً للجرام للمشغولات التقليدية والحديثة.',
      en: 'Making charges in Dubai Gold Souk typically range from 15 to 45 AED per gram.',
    },
    marketNote: {
      ar: 'يحظى عيار 22 بإقبال واسع لدى المقيمين من جنوب آسيا والخليج، وتستخدم وحدة التولة (11.66 جم) بكثرة في التداول.',
      en: '22K is popular among South Asian expats and locals, with the tola (11.6638g) widely traded.',
    },
  },
  eg: {
    slug: 'eg',
    currency: 'EGP',
    name: { ar: 'مصر', en: 'Egypt' },
    currencyName: { ar: 'جنيه مصري', en: 'Egyptian Pound' },
    currencySymbol: { ar: 'ج.م', en: 'EGP' },
    popularKarat: '21K',
    vatRateText: {
      ar: 'تفرض ضريبة القيمة المضافة ورسوم الدمغة على أجور المصنعية وتوريد المشغولات بنسب متغيرة معتمدة من مصلحة الدمغة.',
      en: 'VAT and stamping duties are levied on manufacturing fees based on assay authority schedules.',
    },
    makingChargesText: {
      ar: 'تتراوح المصنعية بين 70 و180 جنيهاً للجرام في السبائك، وتصل إلى 300 جنيه فأكثر في المشغولات التراثية.',
      en: 'Making charges range from 70-180 EGP/g on bullion and up to 300+ EGP/g on fine jewelry.',
    },
    marketNote: {
      ar: 'يعتبر عيار 21 والجنيه الذهب (8 جرامات عيار 21) المرجع الأساسي للتسعير والادخار في السوق المصري.',
      en: '21K gold and the Gold Pound (8g of 21K) are Egypt’s primary retail and hedging benchmarks.',
    },
  },
  kw: {
    slug: 'kw',
    currency: 'KWD',
    name: { ar: 'الكويت', en: 'Kuwait' },
    currencyName: { ar: 'دينار كويتي', en: 'Kuwaiti Dinar' },
    currencySymbol: { ar: 'د.ك', en: 'KWD' },
    popularKarat: '21K',
    vatRateText: {
      ar: 'لا تفرض دولة الكويت ضريبة قيمة مضافة على مبيعات الذهب والسبائك حتى تاريخه.',
      en: 'No Value Added Tax (VAT) is currently levied on gold retail or bullion in Kuwait.',
    },
    makingChargesText: {
      ar: 'تتراوح أجور المصنعية بين 1.5 و4 دنانير كويتية للجرام للسبائك والمشغولات المحلية والمستوردة.',
      en: 'Making fees generally range between 1.5 and 4 KWD per gram.',
    },
    marketNote: {
      ar: 'يتميز السوق الكويتي برقابة صارمة على دمغ الذهب وفحص العيارات من وزارة التجارة والصناعة.',
      en: 'Kuwait features stringent purity assay and hallmark inspection by the Ministry of Commerce.',
    },
  },
  qa: {
    slug: 'qa',
    currency: 'QAR',
    name: { ar: 'قطر', en: 'Qatar' },
    currencyName: { ar: 'ريال قطري', en: 'Qatari Riyal' },
    currencySymbol: { ar: 'ر.ق', en: 'QAR' },
    popularKarat: '21K',
    vatRateText: {
      ar: 'لا توجد ضريبة قيمة مضافة عامة على شراء الذهب والمجوهرات في دولة قطر.',
      en: 'No Value Added Tax (VAT) currently applies to gold jewelry or bullion in Qatar.',
    },
    makingChargesText: {
      ar: 'تتراوح المصنعية في سوق الذهب بالدوحة بين 20 و50 ريالاً قطرياً للجرام.',
      en: 'Making charges in Doha Gold Souq range between 20 and 50 QAR per gram.',
    },
    marketNote: {
      ar: 'يفضل المواطنون والمقيمون في قطر عياري 21 و22، مع إقبال كبير على السبائك السويسرية عيار 24.',
      en: '21K and 22K dominate jewelry, with strong demand for Swiss 24K investment ingots.',
    },
  },
  jo: {
    slug: 'jo',
    currency: 'JOD',
    name: { ar: 'الأردن', en: 'Jordan' },
    currencyName: { ar: 'دينار أردني', en: 'Jordanian Dinar' },
    currencySymbol: { ar: 'د.أ', en: 'JOD' },
    popularKarat: '21K',
    vatRateText: {
      ar: 'تخضع المشغولات لرسوم فحص ودمغ من مؤسسة المواصفات والمقاييس الأردنية ونقابة الصاغة.',
      en: 'Jewelry is subject to assay testing and stamping fees managed by the JSMO and Goldsmith Syndicate.',
    },
    makingChargesText: {
      ar: 'تتراوح المصنعية بين 2.5 و5 دنانير أردنية للجرام حسب مصدر الصياغة (محلي أو إيطالي).',
      en: 'Making charges typically range between 2.5 and 5 JOD per gram.',
    },
    marketNote: {
      ar: 'تصدر نقابة أصحاب محلات تجارة وصياغة الحلي والمجوهرات تسعيرة يومية موحدة مرتين يومياً.',
      en: 'The Jordanian Goldsmiths Syndicate issues official benchmark prices twice daily.',
    },
  },
  iq: {
    slug: 'iq',
    currency: 'IQD',
    name: { ar: 'العراق', en: 'Iraq' },
    currencyName: { ar: 'دينار عراقي', en: 'Iraqi Dinar' },
    currencySymbol: { ar: 'د.ع', en: 'IQD' },
    popularKarat: '21K',
    vatRateText: {
      ar: 'لا تطبق ضريبة قيمة مضافة على تداول الذهب الخام والمشغول في الأسواق العراقية.',
      en: 'No VAT applies to raw or manufactured gold in Iraqi retail souks.',
    },
    makingChargesText: {
      ar: 'تتراوح أجور الصياغة بين 5,000 و15,000 دينار عراقي للمثقال أو الجرام بحسب المحافظة.',
      en: 'Making charges range from 5,000 to 15,000 IQD per gram/mithqal depending on location.',
    },
    marketNote: {
      ar: 'يعتمد التسعير المحلي في سوق الكاظمية والشورجة على سعر صرف الدولار الموازي وسعر الأونصة العالمية.',
      en: 'Local pricing in Baghdad souks is closely pegged to parallel FX rates and world spot prices.',
    },
  },
  om: {
    slug: 'om',
    currency: 'OMR',
    name: { ar: 'عُمان', en: 'Oman' },
    currencyName: { ar: 'ريال عُماني', en: 'Omani Rial' },
    currencySymbol: { ar: 'ر.ع', en: 'OMR' },
    popularKarat: '22K',
    vatRateText: {
      ar: 'يطبق نظام الخضوع للضريبة بنسبة الصفر (0%) على الذهب الاستثماري، بينما تخضع المشغولات لضريبة 5%.',
      en: 'Zero-rated VAT applies to investment gold; 5% VAT applies to jewelry purchases.',
    },
    makingChargesText: {
      ar: 'تتراوح أجور الصياغة في سوق مطرح بين 2.5 و5 ريالات عُمانية للجرام.',
      en: 'Crafting fees in Muttrah Souq usually range between 2.5 and 5 OMR per gram.',
    },
    marketNote: {
      ar: 'تشتهر سلطنة عمان بصياغة الحلي التراثية المتقنة من عيار 22 وعيار 21 بطلب واسع في الأعراس.',
      en: 'Oman is renowned for heritage jewelry crafting, with heavy bridal demand for 22K and 21K.',
    },
  },
  bh: {
    slug: 'bh',
    currency: 'BHD',
    name: { ar: 'البحرين', en: 'Bahrain' },
    currencyName: { ar: 'دينار بحريني', en: 'Bahraini Dinar' },
    currencySymbol: { ar: 'د.ب', en: 'BHD' },
    popularKarat: '21K',
    vatRateText: {
      ar: 'يطبق معدل ضريبة الصفر (0%) على استيراد وتوريد الذهب الاستثماري المؤهل بنقاء 99% فأكثر.',
      en: 'Qualified investment gold (99%+) is zero-rated for VAT purposes in Bahrain.',
    },
    makingChargesText: {
      ar: 'تتراوح المصنعية في سوق المنامة للذهب بين 3 و6 دنانير بحرينية للجرام.',
      en: 'Making charges in Manama Gold Souq range between 3 and 6 BHD per gram.',
    },
    marketNote: {
      ar: 'يتميز الذهب البحريني بجودته العالية وتصاميمه الخليجية الأصيلة خاصة عيار 21 المرصع باللؤلؤ الطبيعي.',
      en: 'Bahraini gold is prized for 21K craftsmanship, frequently paired with natural pearls.',
    },
  },
  ma: {
    slug: 'ma',
    currency: 'MAD',
    name: { ar: 'المغرب', en: 'Morocco' },
    currencyName: { ar: 'درهم مغربي', en: 'Moroccan Dirham' },
    currencySymbol: { ar: 'د.م', en: 'MAD' },
    popularKarat: '18K',
    vatRateText: {
      ar: 'تخضع المشغولات الذهبية لرسوم الدمغة القانونية وضريبة القيمة المضافة بنسبة 20% على المصنعية.',
      en: 'Jewelry is subject to official assay hallmarking and 20% VAT on manufacturing value-add.',
    },
    makingChargesText: {
      ar: 'تتراوح المصنعية في قيساريات الذهب بالمغرب بين 40 و120 درهماً مغربياً للجرام.',
      en: 'Making charges in Moroccan medina souks range between 40 and 120 MAD per gram.',
    },
    marketNote: {
      ar: 'يعد عيار 18 الأكثر شيوعاً واستخداماً في صياغة الحلي والمجوهرات الراقية في كافة المدن المغربية.',
      en: '18K is the standard gold karat for retail fine jewelry throughout Morocco.',
    },
  },
};

export interface PricesData {
  updatedAt: string;
  xauUsdOz: number;
  xagUsdOz: number;
  fx: Record<string, number>;
}

export interface GoldPricesByKarat {
  '24K': number;
  '22K': number;
  '21K': number;
  '18K': number;
  ounce24K: number;
  silverGram: number;
  // Specific extra regional units
  egyptianGoldPound?: number; // 8 grams of 21K
  uaeTola?: number; // 11.6638 grams of 24K
}

/**
 * Calculate gold and silver prices in a specific currency given raw spot data
 */
export function calculateGoldPrices(
  pricesData: PricesData,
  currency: string
): GoldPricesByKarat {
  const fxRate = pricesData.fx[currency] ?? 1;
  const gram24K = (pricesData.xauUsdOz / TROY_OUNCE_GRAMS) * fxRate;
  const gramSilver = (pricesData.xagUsdOz / TROY_OUNCE_GRAMS) * fxRate;

  const result: GoldPricesByKarat = {
    '24K': Number(gram24K.toFixed(2)),
    '22K': Number((gram24K * KARAT_PURITIES['22K']).toFixed(2)),
    '21K': Number((gram24K * KARAT_PURITIES['21K']).toFixed(2)),
    '18K': Number((gram24K * KARAT_PURITIES['18K']).toFixed(2)),
    ounce24K: Number((pricesData.xauUsdOz * fxRate).toFixed(2)),
    silverGram: Number(gramSilver.toFixed(2)),
  };

  // Add Egypt-specific unit: Gold Pound = 8g of 21K
  if (currency === 'EGP') {
    result.egyptianGoldPound = Number((result['21K'] * EGYPTIAN_GOLD_POUND_GRAMS).toFixed(2));
  }

  // Add UAE-specific unit: Tola = 11.6638g of 24K
  if (currency === 'AED') {
    result.uaeTola = Number((gram24K * TOLA_GRAMS).toFixed(2));
  }

  return result;
}

export interface GoldValueInput {
  grams: number;
  karat: KaratKey;
  currency: string;
  makingChargeType?: 'fixed_per_gram' | 'percentage';
  makingChargeValue?: number;
}

export interface GoldValueResult {
  grams: number;
  karat: KaratKey;
  pureGoldWeightGrams: number;
  pricePerGramBase: number;
  rawGoldTotal: number;
  makingChargeTotal: number;
  totalValue: number;
}

/**
 * "My Gold Value" calculator:
 * computes total worth of user's gold based on grams, karat, and optional making fee
 */
export function calculateMyGoldValue(
  input: GoldValueInput,
  pricesData: PricesData
): GoldValueResult {
  const prices = calculateGoldPrices(pricesData, input.currency);
  const pricePerGram = prices[input.karat];
  const grams = Math.max(0, input.grams || 0);

  const rawGoldTotal = grams * pricePerGram;
  let makingChargeTotal = 0;

  if (input.makingChargeValue && input.makingChargeValue > 0) {
    if (input.makingChargeType === 'percentage') {
      makingChargeTotal = rawGoldTotal * (input.makingChargeValue / 100);
    } else {
      // default: fixed amount per gram
      makingChargeTotal = grams * input.makingChargeValue;
    }
  }

  const pureGoldWeightGrams = grams * KARAT_PURITIES[input.karat];
  const totalValue = rawGoldTotal + makingChargeTotal;

  return {
    grams,
    karat: input.karat,
    pureGoldWeightGrams: Number(pureGoldWeightGrams.toFixed(3)),
    pricePerGramBase: pricePerGram,
    rawGoldTotal: Number(rawGoldTotal.toFixed(2)),
    makingChargeTotal: Number(makingChargeTotal.toFixed(2)),
    totalValue: Number(totalValue.toFixed(2)),
  };
}

/**
 * Format timestamp into user-friendly localized string
 */
export function formatPriceUpdatedAt(isoString: string, locale: 'ar' | 'en'): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  } catch {
    return isoString;
  }
}
