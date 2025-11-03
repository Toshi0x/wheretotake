/*
 Simple internal link and anchor checker for the Next.js dev server.
 - Crawls pages starting from BASE (http://localhost:3000 by default)
 - Follows same-origin links only
 - Validates fragments (e.g. #reviews) exist as an id on the page
 - Classifies pages as ok, placeholder (our 404 UI), or broken
 Usage: node scripts/check-links.mjs [baseUrl]
*/

const BASE = process.argv[2] || process.env.BASE_URL || 'http://localhost:3000';
const maxPages = Number(process.env.MAX_PAGES || 50);

/** @param {string} url */
function norm(url) {
  try {
    const u = new URL(url, BASE);
    u.hash = ''; // strip fragment for fetch
    // only same-origin
    const b = new URL(BASE);
    if (u.origin !== b.origin) return null;
    // remove trailing slash except for root
    if (u.pathname.length > 1 && u.pathname.endsWith('/')) u.pathname = u.pathname.slice(0, -1);
    return u.toString();
  } catch {
    return null;
  }
}

/** @param {string} html @param {string} id */
function hasId(html, id) {
  const pattern = new RegExp(`id=["']${id}["']`, 'i');
  return pattern.test(html);
}

async function main() {
  const toVisit = new Set([norm(BASE)]);
  const visited = new Set();
  const ok = new Set();
  const placeholder = new Map(); // url -> status
  const broken = new Map(); // url -> status or error

  while (toVisit.size && visited.size < maxPages) {
    const url = toVisit.values().next().value; toVisit.delete(url);
    if (!url || visited.has(url)) continue;
    visited.add(url);
    let res, html = '';
    try {
      res = await fetch(url, { redirect: 'manual' });
      html = await res.text();
    } catch (e) {
      broken.set(url, String(e));
      continue;
    }
    // classify
    if (res.status >= 500) {
      broken.set(url, res.status);
    } else if (res.status >= 400) {
      // our not-found placeholder is OK-as-placeholder
      if (/Page not found/i.test(html)) {
        placeholder.set(url, res.status);
      } else {
        broken.set(url, res.status);
      }
    } else {
      ok.add(url);
      // collect links
      const linkRe = /<a[^>]+href=["']([^"'#]+(?:#[^"']*)?)["'][^>]*>/gi;
      let m;
      while ((m = linkRe.exec(html))) {
        const href = m[1];
        // skip mailto/tel/js
        if (/^(mailto:|tel:|javascript:)/i.test(href)) continue;
        const target = norm(href);
        if (target && !visited.has(target)) toVisit.add(target);
        // check fragments
        if (href.includes('#')) {
          const frag = href.split('#')[1];
          if (frag && !hasId(html, frag)) {
            // anchor missing on this page; mark as placeholder category
            placeholder.set(`${target}#${frag}`, 'missing-id');
          }
        }
      }
    }
  }

  // report
  console.log(`Checked ${visited.size} page(s) (limit ${maxPages}).`);
  console.log(`OK: ${ok.size}`);
  console.log(`Placeholders: ${placeholder.size}`);
  console.log(`Broken: ${broken.size}`);
  if (placeholder.size) {
    console.log('\nPlaceholders:');
    for (const [u, s] of placeholder) console.log('-', u, '->', s);
  }
  if (broken.size) {
    console.log('\nBroken:');
    for (const [u, s] of broken) console.log('-', u, '->', s);
    process.exitCode = 1;
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

