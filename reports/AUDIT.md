# Where To Take — Production Audit

Scores (target → status)
- UX: 85/100 → Solid core, minor clarity fixes applied
- Accessibility: 94/100 → Blockers fixed (focus, links). Axe clean on / (baseline)
- Performance: pending LHCI → configured via `lighthouserc.json`
- SEO: 92/100 → Metadata + JSON-LD added; sitemap configured

Top 10 Issues (fixed unless noted)
1) Broken price formatting and symbols (Blocker)
   - Repro: Prices rendered as replacement characters (�) across app.
   - Fix: Standardized ASCII-safe formatting and currency rendering.
   - Files: lib/utils.ts:1, components/place-card.tsx:1, components/itinerary-card.tsx:1, app/place/[slug]/page.tsx:1, app/london/page.tsx:1, components/sticky-filter-bar.tsx:1, app/page.tsx:1, components/collections-grid.tsx:1, components/reviews.tsx:1, components/footer.tsx:1
   - Patch: patches/01-price-formatting.diff

2) External links missing `rel="noopener noreferrer"` (Major, security)
   - Repro: `Book`/`Route` anchor tags opened new tabs without `noopener`.
   - Fix: Added `rel="noopener noreferrer"` to all external anchors.
   - Files: components/place-card.tsx:1, app/place/[slug]/page.tsx:1
   - Patch: patches/02-noopener.diff

3) Default date should be today +14 days (Major, requirement)
   - Repro: QuickFinder and Planner defaulted to today.
   - Fix: Default to `today + 14d`, min stays `today`. Planner logic already honors `lead_time_days <= daysUntil`.
   - Files: components/quick-finder.tsx:1, app/plan/page.tsx:1
   - Patch: patches/03-default-date.diff

4) Modal focus return (Major, a11y)
   - Repro: Dialog trigger was a hidden span; closing didn’t restore focus to the invoking control.
   - Fix: Keep a ref to "Deal me 3" button and restore focus on close.
   - Files: components/quick-finder.tsx:1
   - Patch: patches/04-dialog-focus.diff

5) Inconsistent price overlap logic (Minor → Correctness)
   - Repro: `/london` duplicated band mapping inline.
   - Fix: Use shared `priceBandFromLevel` from `lib/utils`.
   - Files: app/london/page.tsx:1
   - Patch: patches/05-price-overlap-london.diff

6) Place page SEO (Major)
   - Repro: No JSON-LD; metadata basic.
   - Fix: Added `Place` JSON-LD with optional `AggregateRating`.
   - Files: app/place/[slug]/page.tsx:1
   - Patch: patches/06-place-jsonld.diff

7) App-wide metadata and skip link (Major, a11y/SEO)
   - Repro: Title had bad characters; no skip link.
   - Fix: Clean metadata, OG/Twitter tags, canonical; added skip link.
   - Files: app/layout.tsx:1
   - Patch: patches/07-metadata-skip.diff

8) Axe: basic route scan and Playwright scaffolding (Major)
   - Added Playwright + @axe-core/playwright; tests for key flows A–E and axe scan for `/`.
   - Files: playwright.config.ts, e2e/*.spec.ts

9) LHCI config + reports dir (Minor)
   - Added `lighthouserc.json` writing to `reports/lighthouse/`.

10) Inventories (Minor)
   - Auto-generates `reports/routes.md` and `reports/components.md`.
   - Script: `node scripts/generate-inventories.cjs`

Open Items / Suggestions
- Add keyboard tests for sticky filter bar chips.
- Consider adding per-route axe scans (@axe tag) and expanding color-contrast checks.
- Optionally prefetch place pages on viewport for perceived speed.

How to run audits
- Typecheck: `pnpm run type-check`
- Lint: `pnpm run lint`
- Inventories: `pnpm run audit:inventory`
- E2E: `pnpm run audit:e2e`
- Axe subset: `pnpm run audit:axe`
- Lighthouse CI: `pnpm run audit:lh` (ensure `next start` is running on :3000)

