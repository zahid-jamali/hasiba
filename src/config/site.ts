export interface ToolConfig {
  slug: string;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  category: 'dates' | 'money' | 'health';
}

export interface SiteLink {
  key: string;
  href: string;
  label: {
    ar: string;
    en: string;
  };
}

export interface SiteConfig {
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  baseUrl: string;
  logo: string;
  adsenseId: string;
  parent: {
    name: {
      ar: string;
      en: string;
    };
    url: string;
    logo: string;
    email?: string;
    badgeText: {
      ar: string;
      en: string;
    };
    description: {
      ar: string;
      en: string;
    };
    visitText: {
      ar: string;
      en: string;
    };
  };
  tools: ToolConfig[];
  siteLinks: SiteLink[];
}

export const siteConfig: SiteConfig = {
  name: {
    ar: 'حاسبة',
    en: 'Hasiba',
  },
  description: {
    ar: 'موقع حاسبة - أدوات وحسابات مجانية دقيقة وسريعة للعالم العربي ودول الخليج',
    en: 'Hasiba - Free, fast, and accurate online calculators for the Arab world and Gulf region',
  },
  baseUrl: 'https://hasiba.zetawala.com',
  logo: '/images/hasiba-logo.png',
  adsenseId: process.env.NEXT_PUBLIC_ADSENSE_ID || '',
  parent: {
    name: {
      ar: 'زيتاوالا',
      en: 'Zetawala',
    },
    url: 'https://zetawala.com',
    logo: '/images/zetawala-logo.png',
    email: 'support@zetawala.com',
    badgeText: {
      ar: 'من شبكة زيتاوالا',
      en: 'by Zetawala',
    },
    description: {
      ar: 'حاسبة هي جزء من شبكة زيتاوالا للأدوات المجانية',
      en: 'Hasiba is part of the Zetawala network of free tools.',
    },
    visitText: {
      ar: 'زيارة زيتاوالا ←',
      en: 'Visit Zetawala →',
    },
  },
  siteLinks: [
    {
      key: 'about',
      href: '/about/',
      label: {
        ar: 'عن حاسبة',
        en: 'About Us',
      },
    },
    {
      key: 'methodology',
      href: '/methodology/',
      label: {
        ar: 'منهجية الحساب',
        en: 'Methodology',
      },
    },
    {
      key: 'contact',
      href: '/contact/',
      label: {
        ar: 'اتصل بنا',
        en: 'Contact Us',
      },
    },
    {
      key: 'privacy-policy',
      href: '/privacy-policy/',
      label: {
        ar: 'سياسة الخصوصية',
        en: 'Privacy Policy',
      },
    },
    {
      key: 'terms',
      href: '/terms/',
      label: {
        ar: 'شروط الاستخدام',
        en: 'Terms of Use',
      },
    },
    {
      key: 'disclaimer',
      href: '/disclaimer/',
      label: {
        ar: 'إخلاء المسؤولية',
        en: 'Disclaimer',
      },
    },
  ],
  tools: [
    {
      slug: 'hijri-date-today',
      name: {
        ar: 'التاريخ الهجري اليوم',
        en: 'Hijri Date Today',
      },
      description: {
        ar: 'معرفة التاريخ الهجري اليوم مع المقابل الميلادي والمناسبات الإسلامية',
        en: 'Check today’s Hijri date with Gregorian conversion and Islamic events',
      },
      category: 'dates',
    },
    {
      slug: 'hijri-converter',
      name: {
        ar: 'تحويل التاريخ من هجري إلى ميلادي',
        en: 'Hijri to Gregorian Converter',
      },
      description: {
        ar: 'تحويل دقيق ومباشر بين التقويم الهجري والميلادي',
        en: 'Accurate converter between Hijri and Gregorian calendar dates',
      },
      category: 'dates',
    },
    {
      slug: 'age-calculator',
      name: {
        ar: 'حساب العمر',
        en: 'Age Calculator',
      },
      description: {
        ar: 'احسب عمرك بالتفصيل بالهجري والميلادي بالأيام والشهور والسنوات',
        en: 'Calculate your exact age in Hijri and Gregorian in years, months, and days',
      },
      category: 'dates',
    },
    {
      slug: 'gold-price',
      name: {
        ar: 'سعر الذهب اليوم',
        en: 'Gold Price Today',
      },
      description: {
        ar: 'أسعار الذهب والفضة اليوم في السعودية والإمارات ومصر والدول العربية',
        en: 'Live gold and silver prices today across Saudi Arabia, UAE, Egypt and Arab countries',
      },
      category: 'money',
    },
    {
      slug: 'zakat-calculator',
      name: {
        ar: 'حاسبة الزكاة',
        en: 'Zakat Calculator',
      },
      description: {
        ar: 'احسب زكاة المال والذهب والفضة والأسهم والتجارة وفق الشريعة الإسلامية',
        en: 'Calculate Islamic Zakat on money, gold, silver, stocks, and trade assets',
      },
      category: 'money',
    },
    {
      slug: 'end-of-service',
      name: {
        ar: 'حساب مكافأة نهاية الخدمة',
        en: 'End of Service Calculator (UAE & Saudi)',
      },
      description: {
        ar: 'حساب مكافأة نهاية الخدمة وفقاً لنظام العمل السعودي وقانون العمل الإماراتي',
        en: 'Calculate end of service gratuity according to UAE and Saudi labor laws',
      },
      category: 'money',
    },
    {
      slug: 'pregnancy-calculator',
      name: {
        ar: 'حاسبة الحمل وموعد الولادة',
        en: 'Pregnancy & Due Date Calculator',
      },
      description: {
        ar: 'احسبي موعد الولادة المتوقع وأسابيع الحمل ومراحل نمو الجنين',
        en: 'Calculate expected delivery date, pregnancy weeks, and fetal milestones',
      },
      category: 'health',
    },
  ],
};
