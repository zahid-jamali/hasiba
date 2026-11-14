export type Locale = 'ar' | 'en';

export interface MonthOption {
  value: number;
  label: string;
}

export interface Dictionary {
  common: {
    siteName: string;
    siteDescription: string;
    networkNotice: string;
    allRightsReserved: string;
    languageSwitchLabel: string;
    switchLanguageName: string;
    home: string;
    tools: string;
    categories: string;
    dates: string;
    money: string;
    health: string;
    placeholderHeading: string;
    placeholderDescription: string;
    backToHome: string;
    siteLinks: string;
    visitZetawala: string;
    zetawalaDisclaimer: string;
  };
  ui: {
    copied: string;
    copy: string;
    shareWhatsApp: string;
    day: string;
    month: string;
    year: string;
    hijri: string;
    gregorian: string;
    selectPlaceholder: string;
    enterNumber: string;
    digitsToggleLabel: string;
    digitsWestern: string;
    digitsArabic: string;
    relatedToolsTitle: string;
    faqTitle: string;
    adPlaceholder: string;
  };
  months: {
    hijri: MonthOption[];
    gregorian: MonthOption[];
  };
  categories: {
    dates: string;
    money: string;
    health: string;
  };
  tools: {
    'hijri-date-today': {
      title: string;
      description: string;
      badge: string;
    };
    'hijri-converter': {
      title: string;
      description: string;
      badge: string;
    };
    'age-calculator': {
      title: string;
      description: string;
      badge: string;
    };
    'gold-price': {
      title: string;
      description: string;
      badge: string;
    };
    'zakat-calculator': {
      title: string;
      description: string;
      badge: string;
    };
    'end-of-service': {
      title: string;
      description: string;
      badge: string;
    };
    'pregnancy-calculator': {
      title: string;
      description: string;
      badge: string;
    };
  };
}
