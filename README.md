# Hasiba (حاسبة) – Free Online Calculators

> **Live Website:** [https://hasiba.zetawala.com](https://hasiba.zetawala.com)  
> **Parent Network:** [Zetawala Free Utilities Network](https://zetawala.com)  
> **Deployment Target:** Cloudflare Pages (Fully Static Export)

---

## 🌟 Overview

**Hasiba (حاسبة)** is an Arabic-first portal of free, high-precision web calculators designed for users in Saudi Arabia, the UAE, Egypt, Kuwait, Qatar, Jordan, Iraq, and across the Arab world, as well as English-speaking expats in the Gulf region.

### Core Architecture & Technical Highlights
- **Framework:** Next.js 15+ (App Router), TypeScript (Strict Mode), Tailwind CSS with CSS Logical Properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) for full RTL/LTR parity.
- **100% Client-Side Static Export:** `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`. Zero server runtime, zero APIs, zero databases. All calculations execute locally in the visitor's browser for maximum privacy and Core Web Vitals performance.
- **Dual Root Layout Routing:**
  - Arabic (Default RTL): `/`, `/hijri-date-today/`, `/age-calculator/`, etc.
  - English (LTR Expat Mirror): `/en/`, `/en/hijri-date-today/`, `/en/age-calculator/`, etc.
- **Automated Price Pipeline:** Spot gold and silver prices synced every 6 hours via GitHub Actions and Node 20 script (`scripts/update-prices.mjs`) committing to `public/data/prices.json`.
- **Testing:** 100% calculation logic verified with Vitest unit test suites.

---

## 🛠️ Local Development

### Prerequisites
- **Node.js:** v20.x or higher
- **Package Manager:** npm

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
# Arabic:  http://localhost:3000
# English: http://localhost:3000/en/
```

### Verification & Quality Gates
```bash
# Run all Vitest unit tests (98 tests)
npm test

# Run ESLint validation
npm run lint

# Compile production static build (exports to /out)
npm run build

# Run comprehensive link, canonical, hreflang, and title audit
node scripts/check-links.mjs

# Validate JSON-LD structured data schemas
node scripts/validate-jsonld.mjs

# Automatically submit all URLs to Microsoft Bing via IndexNow
npm run indexnow
```

---

## 🚀 Cloudflare Pages Deployment Settings

Hasiba is designed for seamless, automated deployment on **Cloudflare Pages**:

| Setting | Value |
| :--- | :--- |
| **Framework preset** | `Next.js (Static HTML Export)` |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |
| **Root directory** | `/` |

### Cloudflare Environment Variables
Set these under **Pages > Project > Settings > Environment Variables**:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NODE_VERSION` | Mandatory Node.js version | `20` |
| `NEXT_PUBLIC_ADSENSE_ID` | Google AdSense client ID | `ca-pub-XXXXXXXXXXXXXXXX` |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | Cloudflare Web Analytics token | *(optional token)* |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console verification meta | *(optional verification code)* |

---

## 🔑 Environment Variables & GitHub Secrets

### Required for Daily Metals & FX Automation (`.github/workflows/update-prices.yml`)
- **`GOLD_API_KEY`** *(GitHub Secret)*:  
  API key from [GoldAPI.io](https://www.goldapi.io). Used by `scripts/update-prices.mjs` to fetch international spot prices (XAU/XAG).  
  *Never commit or expose this key to client-side code.*

### Microsoft Bing IndexNow Automation (`.github/workflows/indexnow.yml`)
- **IndexNow API Key:** `7e52a986aa4b59606d1f8048fab426ec`
- **Key Verification URL:** `https://hasiba.zetawala.com/7e52a986aa4b59606d1f8048fab426ec.txt`
- **Submission Command:** `npm run indexnow`
- **Supported Engines:** Microsoft Bing, Yandex, Naver, Seznam.
- **Workflow:** Runs automatically on every push to `main` and daily at midnight UTC to keep search engine indexes fresh.
- **`INDEXNOW_KEY`** *(GitHub Secret / Environment Variable, optional)*:  
  Override the default key with your custom key from Bing Webmaster Tools if preferred.

### Client-Side Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_CF_ANALYTICS_TOKEN=
NEXT_PUBLIC_GSC_VERIFICATION=
```

---

## ➕ How to Add a New Tool (Step-by-Step Guide)

Follow these steps to add a new calculator tool while maintaining strict SEO, testing, and localization standards:

### Step 1: Register Tool in Site Config
In `src/config/site.ts`, append your tool to `siteConfig.tools`:
```typescript
{
  slug: 'my-new-tool',
  name: {
    ar: 'اسم الحاسبة بالعربية',
    en: 'My New Tool Name',
  },
  description: {
    ar: 'وصف تسويقي دقيق ومختصر',
    en: 'Concise, high-intent description for search',
  },
  category: 'money', // 'dates' | 'money' | 'health'
}
```

### Step 2: Implement Logic & Unit Tests
1. Create pure calculation functions in `src/lib/my-new-tool.ts`:
   - Accept normalized numbers and options.
   - Throw typed errors for impossible inputs.
   - Never import React or browser-only APIs.
2. Create Vitest unit test in `src/lib/my-new-tool.test.ts`:
   - Test standard cases, boundary conditions, zero values, and edge cases.
   - Verify `npm test` passes.

### Step 3: Create Interactive Client Component
In `src/components/calculators/MyNewToolCalculator.tsx`:
- Use `'use client';`
- Accept `{ locale: Locale }`
- Utilize shared design system components:
  - `<NumberInput />` (automatically converts Eastern Arabic digits `١٢٣` to Western `123`).
  - `<SegmentedToggle />` for tabs and mode switches.
  - `<ResultBox />` with `aria-live="polite"` for accessible live updates.
  - WhatsApp share and 1-click clipboard copy handlers.

### Step 4: Write Native Arabic & English Content
Create content files following `ToolContent` interface (`src/content/types.ts`):
1. `src/content/ar/my-new-tool.ts`:
   - Search-optimized `metaTitle`, `metaDescription`, `h1`.
   - `howItWorks`: Plain-language explanation of formula and statutory source.
   - `article`: 600–900 words in Modern Standard Arabic with `<h2>` and `<h3>` tags.
   - `example`: Worked numerical scenario.
   - `faqs`: 6–8 real user questions and authoritative answers.
   - `sources`: Links to official ministries or standards bodies.
2. `src/content/en/my-new-tool.ts`: Separately authored English content for Gulf expats.
3. Register both modules in `src/content/index.ts`.

### Step 5: Mount in Dynamic Tool Route
In both `src/app/(ar)/[slug]/page.tsx` and `src/app/(en)/en/[slug]/page.tsx`:
```tsx
import { MyNewToolCalculator } from '@/components/calculators/MyNewToolCalculator';

// In page component:
else if (slug === 'my-new-tool') {
  calculatorNode = <MyNewToolCalculator locale={locale} />;
}
```

### Step 6: Generate Open Graph Image
Run the OG generator script:
```bash
node scripts/make-og.mjs
```
This generates a 1200x630 branded card at `public/og/my-new-tool.png`.

### Step 7: Update Sitemap & Audit
1. Add route to `src/app/sitemap.ts`.
2. Run quality checks:
```bash
npm test
npm run lint
npm run build
node scripts/check-links.mjs
```

---

## 🏛️ Project Structure

```
hasiba/
├── .github/workflows/
│   └── update-prices.yml      # 6-hour cron for precious metals & FX rates
├── public/
│   ├── ads.txt                # Google AdSense authorized sellers verification
│   ├── data/
│   │   ├── prices.json        # Current spot gold, silver, and FX rates
│   │   └── prices-history.json# 365-day historical gold rates for SVG chart
│   ├── images/
│   │   ├── hasiba-logo.png
│   │   └── zetawala-logo.png
│   └── og/                    # 1200x630 social preview PNGs per tool
├── scripts/
│   ├── check-links.mjs        # Production static crawler & SEO auditor
│   ├── make-og.mjs            # High-resolution OG image generator
│   ├── update-prices.mjs      # Live metals & exchange rate updater
│   └── validate-jsonld.mjs    # Schema.org structured data auditor
├── src/
│   ├── app/
│   │   ├── (ar)/              # Arabic RTL routes (/, /hijri-date-today/, etc.)
│   │   ├── (en)/en/           # English LTR routes (/en/, /en/hijri-date-today/, etc.)
│   │   ├── robots.ts          # Static robots.txt generator
│   │   └── sitemap.ts         # Static sitemap.xml with hreflang pairs
│   ├── components/
│   │   ├── calculators/       # Interactive client calculator components
│   │   ├── layout/            # Slim Header and Zetawala Parent Footer
│   │   ├── pages/             # Country hubs and subpage layouts
│   │   ├── seo/               # Metadata builder and JSON-LD components
│   │   ├── templates/         # ToolPageTemplate layout
│   │   └── ui/                # Accessible design system primitives
│   ├── config/                # Site configuration, fonts, and constants
│   ├── content/               # High-value native Arabic and English articles
│   ├── context/               # Digit preference context (Western vs Eastern Arabic)
│   ├── i18n/                  # Localized dictionaries and types
│   └── lib/                   # Pure calculation engines and Vitest suites
```

---

## 📄 License & Attribution
- **Publisher:** Part of the [Zetawala Network](https://zetawala.com).
- **Exchange Rates:** Rates By [Exchange Rate API](https://www.exchangerate-api.com).
- **Calendar Calculations:** Umm al-Qura astronomical standard via Saudi Ministry of Islamic Affairs guidelines.
