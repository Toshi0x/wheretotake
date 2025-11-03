## SEO & Structured Data

Findings
- Title/description standardized; OG/Twitter tags added in `app/layout.tsx:1`.
- Place pages now include JSON-LD `Place` + `AggregateRating` when reviews exist: `app/place/[slug]/page.tsx:1`.
- Added `next-sitemap` config (`next-sitemap.config.js`). Consider running `next-sitemap` postbuild to emit sitemap/robots.

Proposed code diffs (already applied)
- Add metadata in layout and canonical.
- Inject JSON-LD script in Place pages.

Next steps
- Provide a site-wide OG image.
- Add explicit `<link rel="canonical">` per dynamic route if multiple filter URLs are indexable.

