Fix Report — Where To Take (Dealme3)

Summary
- Added multi‑city Browse with region switcher and region‑aware ranking.
- Upgraded Reviews page with tokenized search, facets, and panel scaffold.
- Improved Planner with live feasibility, derived info, previews, and sticky CTA.
- Standardized field styles, focus rings, and dark/light tokens.
- Added JSON‑LD helpers, analytics stub, and several UI/accessibility fixes.

Key Changes
- app/[region]/page.tsx: New dynamic Browse; uses CitySwitcher, CategoryPills; supports travel‑time filtering and neighbor suggestions; deleted app/london/page.tsx.
- components/CitySwitcher.tsx: Searchable combobox, “Use my location”; default label “Enter location”.
- lib/region.config.ts, lib/geo.ts, lib/rank.ts: Region config, distance/minutes, and ranking.
- Reviews: app/reviews/page.tsx with ReviewSearchBar, FiltersBar, PlaceReviewCard, ReviewsPanel, SkeletonCard; ItemList JSON‑LD injection.
- Planner: app/plan/page.tsx with PlanPreviewCard and StickyPlannerCta; PlannerForm shows feasibility pill, end time, est hops; geolocation origin and transport select.
- Tokens/Fields: app/globals.css adds field/focus tokens; input/select/textarea use `.field` with hover/focus ring.
- Cards/Images: Place card uses consistent actions, review snippet, Next/Image sizes; Featured image gets sizes/priority.
- SEO/Analytics: lib/seo.ts (ItemList/Place LD), lib/analytics.ts (console stub).

A11y & Consistency
- Labeled inputs and combos; chips are buttons with `aria-pressed`.
- Added aria‑label to rating lines; visible focus rings via tokenised `.focus-ring` and `.field`.

Performance
- Prevent CLS with explicit width/height and sizes on images; prefetch detail routes on intersection.

Home Quick Finder
- Consolidated budget controls to a single “Spend per person → Amount” input to remove duplication.

Health Checks
- `pnpm build` and `pnpm type-check` pass locally; ESLint not configured (Next interactive prompt) — deferred.

