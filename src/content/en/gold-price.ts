import { ToolContent } from '../types';

export const content: ToolContent = {
  title: 'Gold Price Today',
  metaTitle: 'Gold Price Today - Live 24K, 22K, 21K, 18K & Making Fees | Hasiba',
  metaDescription: 'Live gold and silver prices across Saudi Arabia, UAE, Egypt, Kuwait, and Qatar. 24K, 22K, 21K, 18K gram rates, making fee calculator, and 30-day trend chart.',
  h1: 'Live Gold Price Today Across Arab Countries in Local Currencies',
  intro: 'A transparent real-time benchmark for 24K, 22K, 21K, and 18K gold and pure silver across 10 Arab countries with built-in making charge calculators and 30-day historical charts.',
  howItWorks: {
    formula: 'Price per Gram = (International spot XAU/USD per troy ounce ÷ 31.1035) × Karat Purity Multiplier × Live FX Exchange Rate.',
    sourceOrLaw: 'London Bullion Market Association (LBMA) spot prices combined with real-time central banking FX feeds.',
  },
  article: `## Complete Guide to Gold Buying and Pricing in the Middle East

Gold has served as the premier safe haven and store of value across the Arabian Gulf, Egypt, and North Africa for millennia. Whether purchasing bridal jewelry in Riyadh, bullion bars in Dubai Gold Souk, or gold pounds in Cairo, understanding how raw spot rates translate into retail shop tags is indispensable.

Hasiba delivers an independent, transparent price feed derived directly from global bullion spot benchmarks (XAU/USD) converted via live exchange rates. This arms buyers with the fundamental baseline before entering jewelry boutiques.

---

### Understanding Gold Karats and Purities

Gold purity is universally measured in karats on a 24-point fractional scale:
- **24K Gold (99.9% Purity)**: Pure gold with no alloy metals. Soft, vibrant yellow, and ductile. It is the international standard for **investment bars (ingots), minted biscuits, and sovereign bullion coins**.
- **22K Gold (91.6% Purity)**: Blended with small ratios of copper and silver for resilience. It is the dominant choice for traditional bridal sets and high-wear jewelry across the UAE, Qatar, and South Asian expat communities.
- **21K Gold (87.5% Purity)**: **The undisputed market leader in Saudi Arabia, Egypt, and Jordan**. It delivers a rich golden hue combined with structural integrity for rings, necklaces, and bangles.
- **18K Gold (75.0% Purity)**: Mixed with 25% alloy metals (nickel, silver, copper, or palladium). It is the hardest karat, ideally suited for prong-setting diamonds and precious gems, and is the standard in Morocco and European luxury fashion houses.

---

### Demystifying Jeweler Making Charges (Masna’iya) and VAT

When shopping at retail gold merchants, your final invoice comprises three distinct layers:
1. **Raw Metal Cost**: Total gram weight multiplied by today’s live karat rate.
2. **Making Charges (Crafting Fee)**: Crafting fees reflect labor, design complexity, brand prestige, and origin (e.g. Italian, Emirati, Turkish, Bahraini). For simple cast bullion bars, fees range between 5 and 15 local currency units per gram. For intricate handmade jewelry, fees range from 25 to 70+ units per gram.
3. **Value Added Tax (VAT)**:
   - **Saudi Arabia & UAE**: Investment grade bullion (99%+ purity) is classified as zero-rated (0% VAT). On retail jewelry, VAT (15% in KSA, 5% in UAE) applies primarily to the **making charge portion** when invoiced correctly.
   - **Egypt**: Stamping fees and progressive value-added levies are regulated by the Assay and Weights Administration.

---

### Common Regional Units of Gold Weight

- **Troy Ounce (oz)**: The global standard, equaling exactly **31.1035 grams** of 24K gold.
- **Egyptian Gold Pound (Gineih Dahab)**: Weighed at exactly **8 grams of 21K gold**; Egypt’s staple retail investment vehicle.
- **Tola**: The historic South Asian and Arabian Peninsula unit, equaling **11.6638 grams**.`,
  example: {
    title: 'Real-World Purchase Example: 21K Gold Bangle',
    scenario: 'Buying a 20-gram 21K gold bangle in Saudi Arabia when the raw gram price is 280 SAR, with a 30 SAR/g making charge.',
    calculation: 'Raw gold cost = 20 × 280 = 5,600 SAR. Making fee = 20 × 30 = 600 SAR. 15% VAT on making fee = 90 SAR. Grand Total = 6,290 SAR.',
    result: 'Total Out-of-Pocket Cost: 6,290 SAR (averaging 314.50 SAR per gram all-inclusive).',
  },
  faqs: [
    {
      q: 'How is the live gold price calculated from international spot markets?',
      a: 'The international spot price per troy ounce (XAU/USD) is divided by 31.1035 to find the 24K price per gram in USD, which is then multiplied by your local currency exchange rate and the karat purity ratio.',
    },
    {
      q: 'Which karat is the best choice for pure financial investment?',
      a: '24K gold bars and sealed ingots from accredited mints are the best investment. They feature minimal crafting premiums and are exempt from standard retail sales taxes in most jurisdictions.',
    },
    {
      q: 'What is a making charge (masna’iya) and is it refundable?',
      a: 'A making charge is the fee charged by goldsmiths to design and manufacture the piece. It is non-refundable; when you resell jewelry to a dealer, they only pay for the raw scrap gold weight.',
    },
    {
      q: 'What is the VAT rate on gold in Saudi Arabia and the UAE?',
      a: 'Investment gold with a purity of 99% or higher is subject to 0% VAT. For jewelry, VAT (15% in Saudi Arabia, 5% in the UAE) is levied on the craftsmanship and making fee component.',
    },
    {
      q: 'How much do a troy ounce, gold pound, and tola weigh in grams?',
      a: 'A troy ounce is 31.1035 grams (24K), an Egyptian gold pound is 8 grams (21K), and a tola is 11.6638 grams (24K).',
    },
    {
      q: 'Why do local gold prices in Egypt sometimes diverge from spot rates?',
      a: 'Local Egyptian pricing accounts for the parallel foreign exchange premium, localized supply and demand fluctuations, and assay hallmarking tariffs.',
    },
    {
      q: 'How do I determine the scrap value of my old gold jewelry?',
      a: 'Multiply the net weight of the gold (excluding non-precious stones) by today’s raw gram scrap purchase price displayed in our calculator.',
    },
    {
      q: 'How frequently are gold prices updated on Hasiba?',
      a: 'Prices track international financial markets and are refreshed periodically throughout every trading day, with daily automated data syncs.',
    },
  ],
  sources: [
    { label: 'World Gold Council', url: 'https://www.gold.org' },
    { label: 'Zakat, Tax and Customs Authority (ZATCA)', url: 'https://zatca.gov.sa' },
    { label: 'Dubai Multi Commodities Centre (DMCC)', url: 'https://www.dmcc.ae' },
  ],
  updatedAt: '2026-03-01',
};

export default content;
