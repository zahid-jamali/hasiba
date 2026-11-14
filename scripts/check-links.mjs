/**
 * scripts/check-links.mjs
 * Full static audit for Hasiba's exported `out` directory:
 * - Broken internal links
 * - Missing or malformed canonical tags
 * - Missing hreflang alternates (ar, en, x-default)
 * - Duplicate page titles across different URLs
 * - Pages without an <h1> or with multiple <h1> tags
 */

import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve(process.cwd(), 'out');
const SITE_BASE_URL = 'https://hasiba.zetawala.com';

if (!fs.existsSync(OUT_DIR)) {
  console.error(`[ERROR] "out" directory not found at ${OUT_DIR}. Run "npm run build" first.`);
  process.exit(1);
}

// 1. Collect all HTML files
function getHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const htmlFiles = getHtmlFiles(OUT_DIR);
console.log(`\n🔍 Found ${htmlFiles.length} HTML files in out/ directory to audit.\n`);

// Data structures for tracking
const errors = {
  brokenLinks: [],
  missingCanonical: [],
  missingHreflang: [],
  duplicateTitles: [],
  h1Issues: [],
};

const titleMap = new Map(); // title -> [urlPaths]

// Helper to convert file path to site URL path
function fileToUrlPath(filePath) {
  const rel = path.relative(OUT_DIR, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) {
    return '/' + rel.replace(/\/index\.html$/, '') + '/';
  }
  return '/' + rel;
}

// Check if a target URL path exists in `out`
function targetExists(targetPath) {
  let clean = targetPath.split('#')[0].split('?')[0];
  if (!clean || clean === '/') {
    return fs.existsSync(path.join(OUT_DIR, 'index.html'));
  }

  // Remove leading slash for path.join
  clean = clean.replace(/^\//, '');

  const candidates = [
    path.join(OUT_DIR, clean),
    path.join(OUT_DIR, clean, 'index.html'),
    path.join(OUT_DIR, clean + '.html'),
    path.join(OUT_DIR, clean.replace(/\/$/, '') + '.html'),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return true;
    }
  }
  return false;
}

// Attribute extractor
function getAttribute(tagStr, attrName) {
  const match = tagStr.match(new RegExp(`${attrName}=["']([^"']*)["']`, 'i'));
  return match ? match[1] : null;
}

// Audit each HTML file
for (const filePath of htmlFiles) {
  const urlPath = fileToUrlPath(filePath);
  const is404 = urlPath === '/404.html' || urlPath === '/404/' || urlPath.includes('_not-found');
  const isPreview = urlPath.includes('/ui-preview');
  const content = fs.readFileSync(filePath, 'utf-8');

  // --- 1. Canonical tag check ---
  if (!is404 && !isPreview) {
    const canonicalMatches = content.match(/<link[^>]+rel=["']canonical["'][^>]*>/gi) ||
      content.match(/<link[^>]+href=["'][^"']*["'][^>]+rel=["']canonical["'][^>]*>/gi);

    if (!canonicalMatches || canonicalMatches.length === 0) {
      errors.missingCanonical.push({ urlPath, issue: 'Missing <link rel="canonical">' });
    } else {
      const canonicalTag = canonicalMatches[0];
      const href = getAttribute(canonicalTag, 'href');
      if (!href) {
        errors.missingCanonical.push({ urlPath, issue: 'Canonical link missing href attribute' });
      } else if (!href.startsWith(SITE_BASE_URL)) {
        errors.missingCanonical.push({ urlPath, issue: `Canonical URL does not start with ${SITE_BASE_URL}: "${href}"` });
      }
    }
  }

  // --- 2. Hreflang alternates check ---
  if (!is404 && !isPreview) {
    const alternateTags = content.match(/<link[^>]+rel=["']alternate["'][^>]*>/gi) || [];
    const hreflangsFound = new Set();

    for (const tag of alternateTags) {
      const hreflang = getAttribute(tag, 'hreflang');
      if (hreflang) {
        hreflangsFound.add(hreflang.toLowerCase());
      }
    }

    const missingLangs = [];
    if (!hreflangsFound.has('ar')) missingLangs.push('ar');
    if (!hreflangsFound.has('en')) missingLangs.push('en');
    if (!hreflangsFound.has('x-default')) missingLangs.push('x-default');

    if (missingLangs.length > 0) {
      errors.missingHreflang.push({
        urlPath,
        issue: `Missing alternate hreflangs: [${missingLangs.join(', ')}]`,
      });
    }
  }

  // --- 3. Title check & duplicates ---
  if (!isPreview && !is404) {
    const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    if (!title) {
      errors.h1Issues.push({ urlPath, issue: 'Missing or empty <title>' });
    } else {
      if (!titleMap.has(title)) {
        titleMap.set(title, []);
      }
      titleMap.get(title).push(urlPath);
    }
  }

  // --- 4. H1 tag check ---
  if (!is404 && !isPreview) {
    const h1Matches = [...content.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
    if (h1Matches.length === 0) {
      errors.h1Issues.push({ urlPath, issue: 'No <h1> tag found on page' });
    } else if (h1Matches.length > 1) {
      errors.h1Issues.push({
        urlPath,
        issue: `Multiple <h1> tags found (${h1Matches.length}): "${h1Matches.map(m => m[1].replace(/<[^>]+>/g, '').trim()).join(' | ')}"`,
      });
    } else {
      const h1Text = h1Matches[0][1].replace(/<[^>]+>/g, '').trim();
      if (!h1Text) {
        errors.h1Issues.push({ urlPath, issue: 'Empty <h1> tag' });
      }
    }
  }

  // --- 5. Internal link crawling ---
  const aTagMatches = content.matchAll(/<a[^>]+href=["']([^"']*)["'][^>]*>/gi);
  for (const match of aTagMatches) {
    const rawHref = match[1].trim();

    // Skip empty, javascript, mailto, tel, anchors
    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:') ||
        rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('whatsapp:')) {
      continue;
    }

    let targetPath = rawHref;

    // If absolute URL to current domain, convert to path
    if (targetPath.startsWith(SITE_BASE_URL)) {
      targetPath = targetPath.slice(SITE_BASE_URL.length) || '/';
    } else if (targetPath.startsWith('http://') || targetPath.startsWith('https://')) {
      // External link - skip
      continue;
    }

    // Resolve relative path if needed
    if (!targetPath.startsWith('/')) {
      const currentDir = urlPath.endsWith('/') ? urlPath : path.dirname(urlPath) + '/';
      targetPath = path.posix.join(currentDir, targetPath);
    }

    // Verify existence in out
    if (!targetExists(targetPath)) {
      errors.brokenLinks.push({
        source: urlPath,
        link: rawHref,
        resolved: targetPath,
      });
    }
  }
}

// Check titleMap for duplicates across different URLs
for (const [title, urlPaths] of titleMap.entries()) {
  if (urlPaths.length > 1) {
    // If the URLs are not just canonical equivalents (which shouldn't happen anyway since ar and en are separate)
    errors.duplicateTitles.push({
      title,
      count: urlPaths.length,
      pages: urlPaths,
    });
  }
}

// Print Results Report
console.log('='.repeat(70));
console.log('                   FULL QA AUDIT REPORT                   ');
console.log('='.repeat(70));

console.log(`\n1. CANONICAL TAGS:`);
if (errors.missingCanonical.length === 0) {
  console.log(`   ✓ All canonical tags present and valid across all production pages.`);
} else {
  console.log(`   ✗ Found ${errors.missingCanonical.length} canonical issue(s):`);
  errors.missingCanonical.slice(0, 10).forEach(e => console.log(`     - [${e.urlPath}] ${e.issue}`));
  if (errors.missingCanonical.length > 10) console.log(`     ... and ${errors.missingCanonical.length - 10} more`);
}

console.log(`\n2. HREFLANG ALTERNATES:`);
if (errors.missingHreflang.length === 0) {
  console.log(`   ✓ All alternate hreflang pairs (ar, en, x-default) verified.`);
} else {
  console.log(`   ✗ Found ${errors.missingHreflang.length} hreflang issue(s):`);
  errors.missingHreflang.slice(0, 10).forEach(e => console.log(`     - [${e.urlPath}] ${e.issue}`));
  if (errors.missingHreflang.length > 10) console.log(`     ... and ${errors.missingHreflang.length - 10} more`);
}

console.log(`\n3. H1 HEADINGS:`);
if (errors.h1Issues.length === 0) {
  console.log(`   ✓ Exactly one unique H1 found on every production page.`);
} else {
  console.log(`   ✗ Found ${errors.h1Issues.length} H1 issue(s):`);
  errors.h1Issues.slice(0, 10).forEach(e => console.log(`     - [${e.urlPath}] ${e.issue}`));
  if (errors.h1Issues.length > 10) console.log(`     ... and ${errors.h1Issues.length - 10} more`);
}

console.log(`\n4. DUPLICATE TITLES:`);
if (errors.duplicateTitles.length === 0) {
  console.log(`   ✓ Every audited page has a globally unique title.`);
} else {
  console.log(`   ✗ Found ${errors.duplicateTitles.length} duplicate title(s):`);
  errors.duplicateTitles.slice(0, 10).forEach(e => {
    console.log(`     - "${e.title}" (${e.count} times):`);
    e.pages.slice(0, 3).forEach(p => console.log(`       * ${p}`));
  });
  if (errors.duplicateTitles.length > 10) console.log(`     ... and ${errors.duplicateTitles.length - 10} more`);
}

console.log(`\n5. INTERNAL LINKS INTEGRITY:`);
if (errors.brokenLinks.length === 0) {
  console.log(`   ✓ All internal links resolve to valid exported static files.`);
} else {
  console.log(`   ✗ Found ${errors.brokenLinks.length} broken link(s):`);
  errors.brokenLinks.slice(0, 15).forEach(e => {
    console.log(`     - From [${e.source}] -> "${e.link}" (resolved: ${e.resolved})`);
  });
  if (errors.brokenLinks.length > 15) console.log(`     ... and ${errors.brokenLinks.length - 15} more`);
}

console.log('\n' + '='.repeat(70));

const totalErrors =
  errors.brokenLinks.length +
  errors.missingCanonical.length +
  errors.missingHreflang.length +
  errors.duplicateTitles.length +
  errors.h1Issues.length;

if (totalErrors === 0) {
  console.log('🎉 AUDIT PASSED: Zero defects found across all audited static pages!');
  console.log('='.repeat(70) + '\n');
  process.exit(0);
} else {
  console.error(`💥 AUDIT FAILED: ${totalErrors} defect(s) detected.`);
  console.log('='.repeat(70) + '\n');
  process.exit(1);
}
