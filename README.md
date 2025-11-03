# Where To Take

Three date options in 30 seconds. Next.js 14 + TypeScript + Tailwind + shadcn‑style UI.

## Quick Start

Prereqs: Node 18+, pnpm 8+.

```bash
pnpm install
pnpm dev
```

Build and start:

```bash
pnpm build
pnpm start
```

## Audits and QA

- Typecheck: `pnpm run type-check`
- Lint: `pnpm run lint`
- Generate inventories: `pnpm run audit:inventory` → writes `reports/routes.md` and `reports/components.md`
- E2E tests: `pnpm run audit:e2e`
- Axe a11y subset: `pnpm run audit:axe`
- Lighthouse CI: Start the app (`npm run build && npm run start`) then run `pnpm run audit:lh`. Reports saved to `reports/lighthouse/`.

## Scaffold Commands (reference)

These were the intended scaffolding commands if starting fresh:

```
pnpm dlx create-next-app where-to-take --ts --app --tailwind --eslint
pnpm add lucide-react class-variance-authority tailwind-merge next-themes
pnpm add -D @types/node
npx shadcn@latest init
npx shadcn@latest add button card input textarea select badge dialog sheet toast
```

This repo already includes shadcn‑style UI components in `components/ui`.

## Data

- Edit seed places in `data/places.json` (16+ London spots).
- Seed reviews in `data/reviews.json`.
- Client‑added reviews are stored in `localStorage` under the `localReviews` key and merged on the place page.

## Planner

Pure functions live in `lib/planner.ts`.
- Custom price overlap with fallback bands: level 1→12..25, 2→25..45, 3→45..75.
- Lead time requires `place.lead_time_days <= daysUntil(selectedDate)`.
- When = tonight|weekend|daytime impacts scoring.
- Builds a 3‑step itinerary with realistic hops.

## Analytics (stubs)

`lib/utils.ts` exports `track(event, payload)` which logs to console. Call sites include planner results, booking and route clicks, filter apply, and email capture.

## Acceptance checks

- `pnpm dev` runs with zero TypeScript errors.
- Home: “Deal me 3” yields 1–3 itineraries and “Copy plan” copies the `1. … 2. … 3. …` list.
- Custom Price: Enter Min=15 Max=30 on `/london` to filter and confirm planner respects ranges.
- Date: Selecting a date 14 days ahead allows places with `lead_time_days <= 14` only.
- Place page shows merged reviews and new review submission updates immediately.
- URL params on `/london` preserve filters across reloads.
- Mobile has sticky filter bar, visible focus rings, and large tap targets.

## Environment / Plausible

Plausible is stubbed via `track()`; add your script and keys later.
