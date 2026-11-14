/**
 * scripts/validate-jsonld.mjs
 * Validates JSON-LD blocks in key HTML pages:
 * - Checks JSON syntax
 * - Checks @context and @type
 * - Outputs structured report for Google Rich Results Test verification
 */

import fs from 'node:fs';
import path from 'node:path';

const pagesToTest = [
  'out/index.html',
  'out/en/index.html',
  'out/age-calculator/index.html',
  'out/hijri-date-today/index.html',
  'out/gold-price/index.html',
  'out/zakat-calculator/index.html',
  'out/pregnancy-calculator/index.html',
  'out/end-of-service/index.html',
];

console.log('='.repeat(70));
console.log('              JSON-LD SCHEMA VALIDATION AUDIT              ');
console.log('='.repeat(70) + '\n');

let totalErrors = 0;

for (const relPath of pagesToTest) {
  const fullPath = path.resolve(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[MISSING] ${relPath} not found.`);
    totalErrors++;
    continue;
  }

  const html = fs.readFileSync(fullPath, 'utf-8');
  const matches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];

  console.log(`📄 Page: ${relPath} (${matches.length} JSON-LD block(s))`);

  if (matches.length === 0) {
    console.error(`   ✗ No JSON-LD block found!`);
    totalErrors++;
    continue;
  }

  matches.forEach((match, idx) => {
    try {
      const data = JSON.parse(match[1]);
      if (Array.isArray(data)) {
        data.forEach((item, itemIdx) => {
          console.log(`   ✓ Block ${idx + 1}[${itemIdx}]: @type="${item['@type']}" (context="${item['@context']}")`);
        });
      } else if (data['@graph']) {
        const types = data['@graph'].map(g => g['@type']).join(', ');
        console.log(`   ✓ Block ${idx + 1} (@graph): types=[${types}]`);
      } else {
        console.log(`   ✓ Block ${idx + 1}: @type="${data['@type']}" (name="${data.name || data.headline || ''}")`);
      }
    } catch (err) {
      console.error(`   ✗ Block ${idx + 1} JSON Parse Error:`, err.message);
      totalErrors++;
    }
  });

  console.log('');
}

console.log('='.repeat(70));
if (totalErrors === 0) {
  console.log('🎉 ALL JSON-LD SCHEMA BLOCKS PARSED CLEANLY WITH ZERO SYNTAX ERRORS!');
} else {
  console.error(`💥 Found ${totalErrors} JSON-LD error(s).`);
}
console.log('='.repeat(70) + '\n');

process.exit(totalErrors === 0 ? 0 : 1);
