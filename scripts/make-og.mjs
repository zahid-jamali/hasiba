#!/usr/bin/env node
/**
 * scripts/make-og.mjs
 * Generates 1200x630 Open Graph preview PNG images for all Hasiba tools
 * using sharp and high-contrast SVG templates.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OG_DIR = path.resolve(__dirname, '../public/og');

const OG_ITEMS = [
  {
    slug: 'default',
    titleEn: 'Hasiba – Free Calculators',
    titleAr: 'حاسبة – أدوات حساب مجانية',
    category: 'ZETAWALA NETWORK',
    desc: 'Fast, accurate, Arabic-first online calculators for Saudi Arabia and the Gulf',
    accent: '#0284c7', // Brand Sky
    iconEmoji: '🧮',
  },
  {
    slug: 'hijri-date-today',
    titleEn: 'Hijri Date Today',
    titleAr: 'التاريخ الهجري اليوم',
    category: 'CALENDAR & DATES',
    desc: 'Official Umm al-Qura Hijri date, Gregorian equivalent, and Islamic countdowns',
    accent: '#059669', // Emerald
    iconEmoji: '🌙',
  },
  {
    slug: 'hijri-converter',
    titleEn: 'Hijri to Gregorian Converter',
    titleAr: 'تحويل التاريخ هجري وميلادي',
    category: 'CALENDAR & DATES',
    desc: 'Precise two-way astronomical date conversion based on official Umm al-Qura standard',
    accent: '#0d9488', // Teal
    iconEmoji: '🔄',
  },
  {
    slug: 'age-calculator',
    titleEn: 'Exact Age Calculator',
    titleAr: 'حساب العمر بالهجري والميلادي',
    category: 'CALENDAR & DATES',
    desc: 'Detailed lifespan breakdown in years, months, days, hours, and birthday countdown',
    accent: '#2563eb', // Blue
    iconEmoji: '🎂',
  },
  {
    slug: 'gold-price',
    titleEn: 'Live Gold Price Today',
    titleAr: 'سعر الذهب اليوم',
    category: 'FINANCE & MONEY',
    desc: '24K, 22K, 21K, 18K live spot rates in 10 Arab countries with making charge calculator',
    accent: '#d97706', // Amber
    iconEmoji: '🪙',
  },
  {
    slug: 'zakat-calculator',
    titleEn: 'Islamic Zakat Calculator',
    titleAr: 'حاسبة الزكاة الشرعية',
    category: 'FINANCE & MONEY',
    desc: 'Accurate 2.5% Zakat on cash, gold, silver, shares, and trade assets with live Nisab',
    accent: '#16a34a', // Green
    iconEmoji: '⚖️',
  },
  {
    slug: 'end-of-service',
    titleEn: 'End of Service Calculator',
    titleAr: 'حساب مكافأة نهاية الخدمة',
    category: 'LABOR & EMPLOYMENT',
    desc: 'UAE Gratuity (Decree-Law 33/2021) and Saudi Labor Law (Articles 84, 85, 87)',
    accent: '#4f46e5', // Indigo
    iconEmoji: '💼',
  },
  {
    slug: 'pregnancy-calculator',
    titleEn: 'Pregnancy & Due Date Calculator',
    titleAr: 'حاسبة الحمل وموعد الولادة',
    category: 'HEALTH & FAMILY',
    desc: 'Clinical Naegele’s Rule estimation, gestational weeks, and milestones in Hijri & Gregorian',
    accent: '#db2777', // Pink
    iconEmoji: '👶',
  },
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSvgCard(item) {
  const titleEn = escapeXml(item.titleEn);
  const titleAr = escapeXml(item.titleAr);
  const category = escapeXml(item.category);
  const desc = escapeXml(item.desc);
  const accent = item.accent;
  const iconEmoji = item.iconEmoji;

  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>

    <!-- Accent Glow -->
    <radialGradient id="accentGlow" cx="85%" cy="20%" r="65%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.32" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Card Background -->
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.85" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect width="1200" height="630" fill="url(#accentGlow)" />

  <!-- Subtle Grid Pattern -->
  <g opacity="0.06" stroke="#ffffff" stroke-width="1">
    <line x1="0" y1="105" x2="1200" y2="105" />
    <line x1="0" y1="210" x2="1200" y2="210" />
    <line x1="0" y1="315" x2="1200" y2="315" />
    <line x1="0" y1="420" x2="1200" y2="420" />
    <line x1="0" y1="525" x2="1200" y2="525" />
    <line x1="200" y1="0" x2="200" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="800" y1="0" x2="800" y2="630" />
    <line x1="1000" y1="0" x2="1000" y2="630" />
  </g>

  <!-- Inner Content Card -->
  <rect x="60" y="55" width="1080" height="520" rx="28" fill="url(#cardGrad)" stroke="#334155" stroke-width="1.5" />

  <!-- Top Bar: Category Pill & Brand Badges -->
  <g transform="translate(100, 105)">
    <!-- Category Pill -->
    <rect x="0" y="0" width="220" height="38" rx="10" fill="${accent}" fill-opacity="0.22" stroke="${accent}" stroke-width="1.2" />
    <text x="110" y="24" fill="${accent}" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" letter-spacing="1.5" text-anchor="middle">
      ${category}
    </text>

    <!-- Parent Brand Attribution -->
    <text x="880" y="25" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" text-anchor="end">
      HASIBA · حاسبة  |  by Zetawala
    </text>
  </g>

  <!-- Big Central Content -->
  <!-- Emoji Icon Circle -->
  <g transform="translate(100, 185)">
    <circle cx="48" cy="48" r="48" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="1.5" />
    <text x="48" y="58" font-size="44" text-anchor="middle">
      ${iconEmoji}
    </text>
  </g>

  <!-- English Title -->
  <text x="225" y="225" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="900" letter-spacing="-0.8">
    ${titleEn}
  </text>

  <!-- Arabic Title -->
  <text x="225" y="280" fill="${accent}" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="800">
    ${titleAr}
  </text>

  <!-- Description -->
  <text x="100" y="375" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400">
    ${desc}
  </text>

  <!-- Bottom Badges / Trust Markers -->
  <g transform="translate(100, 480)">
    <!-- Badge 1: 100% Free -->
    <rect x="0" y="0" width="160" height="36" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="80" y="23" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">
      ✓ 100% Free
    </text>

    <!-- Badge 2: In-Browser Privacy -->
    <rect x="175" y="0" width="220" height="36" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="285" y="23" fill="#34d399" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">
      🔒 In-Browser Privacy
    </text>

    <!-- Badge 3: Official Standards -->
    <rect x="410" y="0" width="200" height="36" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
    <text x="510" y="23" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">
      ⚖️ Official GCC Standards
    </text>

    <!-- URL on Right -->
    <text x="880" y="24" fill="#64748b" font-family="system-ui, monospace" font-size="15" font-weight="600" text-anchor="end">
      hasiba.zetawala.com
    </text>
  </g>
</svg>
`;
}

async function main() {
  await fs.mkdir(OG_DIR, { recursive: true });
  console.log('Generating 1200x630 Open Graph images for all tools...');

  for (const item of OG_ITEMS) {
    const svg = generateSvgCard(item);
    const outputPath = path.join(OG_DIR, `${item.slug}.png`);

    await sharp(Buffer.from(svg))
      .png({ quality: 90, compressionLevel: 8 })
      .toFile(outputPath);

    console.log(`✓ Created: public/og/${item.slug}.png`);
  }

  console.log(`All ${OG_ITEMS.length} OG images generated successfully.`);
}

main().catch((err) => {
  console.error('Failed to generate OG images:', err);
  process.exit(1);
});
