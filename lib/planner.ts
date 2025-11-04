import { Place, Vibe } from './types'
import { distanceKm, daysUntil, priceBandFromLevel } from './utils'
import { getAllPlaces } from './data'

export type When = 'tonight'|'weekend'|'daytime'

export interface PlannerInput {
  dateISO: string
  budgetMin?: number
  budgetMax?: number
  area?: string
  vibes: Vibe[]
  when: When
}

export interface ItineraryStep {
  place: Place
  arriveAt: string
  departAt: string
  travelMinutes: number
}

export interface Itinerary {
  steps: ItineraryStep[]
  totalMinutes: number
  perPersonEstimate: [number, number]
}

function overlaps(min?: number, max?: number, pMin?: number, pMax?: number, level?: 1|2|3) {
  const [bandMin, bandMax] = level ? priceBandFromLevel(level) : [undefined, undefined]
  const a = pMin ?? bandMin!
  const b = pMax ?? bandMax!
  if (min == null && max == null) return true
  if (min == null) return a <= (max as number)
  if (max == null) return (min as number) <= b
  return Math.max(min, a) <= Math.min(max, b)
}

function vibeMatch(sel: Vibe[], p: Place) {
  if (!sel.length) return true
  return sel.some(v => p.vibe_tags.includes(v))
}

function areaMatch(area: string | undefined, p: Place) {
  if (!area) return true
  const q = area.toLowerCase()
  return p.area.toLowerCase().includes(q) || p.borough.toLowerCase().includes(q)
}

function whenWeight(when: When, p: Place) {
  if (when === 'tonight') return p.lead_time_days <= 0 ? 2 : 0
  if (when === 'daytime') return ['activity','view','dessert','walk'].includes(p.category) ? 2 : 1
  return 1
}

export async function plan(input: PlannerInput): Promise<Itinerary[]> {
  const all = await getAllPlaces()
  const days = daysUntil(input.dateISO)

  const filtered = all.filter(p => {
    const priceOk = overlaps(input.budgetMin, input.budgetMax, p.budget_min, p.budget_max, p.price_level)
    const areaOk = areaMatch(input.area, p)
    const vibeOk = vibeMatch(input.vibes, p)
    const leadOk = p.lead_time_days <= days
    return priceOk && areaOk && vibeOk && leadOk
  })

  // score for sorting
  const scored = filtered.map(p => ({
    p,
    score: whenWeight(input.when, p) + (p.vibe_tags.some(v => input.vibes.includes(v)) ? 1 : 0)
  }))
  scored.sort((a,b) => b.score - a.score)
  const candidates = scored.map(s => s.p)

  // helper to get a place by categories without duplicates
  const take = (pool: Place[], cats: Place['category'][], used: Set<string>) => {
    for (const p of pool) {
      if (used.has(p.id)) continue
      if (cats.includes(p.category)) return p
    }
    return undefined
  }

  const itineraries: Itinerary[] = []
  const maxItins = 3
  const pool = candidates
  for (let i=0; i<maxItins; i++) {
    const used = new Set<string>()
    const pre = take(pool, ['bar','activity'], used) || take(pool, ['activity','bar'], used)
    if (!pre) break
    used.add(pre.id)
    // choose main close to pre
    const nearMain = pool
      .filter(p => !used.has(p.id) && ['restaurant','activity'].includes(p.category))
      .sort((a,b) => (distanceKm(pre,a) ?? 1) - (distanceKm(pre,b) ?? 1))
    const main = nearMain[0]
    if (!main) break
    used.add(main.id)

    const nearEnd = pool
      .filter(p => !used.has(p.id) && ['dessert','walk','view'].includes(p.category))
      .sort((a,b) => (distanceKm(main,a) ?? 1) - (distanceKm(main,b) ?? 1))
    const end = nearEnd[0]
    if (!end) break
    used.add(end.id)

    const hop = (a?: Place, b?: Place) => {
      if (!a || !b) return 10
      const km = distanceKm(a,b)
      if (km == null) return 8 + Math.round(Math.random()*10)
      return Math.min(20, Math.max(5, Math.round(km * 12))) // ~12 min/km walking
    }

    const total = 120
    const start = new Date()
    const fmt = (d: Date) => d.toTimeString().slice(0,5)

    const step1End = new Date(start.getTime() + 35*60000)
    const step2Start = new Date(step1End.getTime() + hop(pre, main)*60000)
    const step2End = new Date(step2Start.getTime() + 55*60000)
    const step3Start = new Date(step2End.getTime() + hop(main, end)*60000)
    const step3End = new Date(step3Start.getTime() + 30*60000)

    const range = (p: Place): [number, number] => [p.budget_min ?? priceBandFromLevel(p.price_level)[0], p.budget_max ?? priceBandFromLevel(p.price_level)[1]]
    const estimate: [number, number] = [
      Math.round((range(pre)[0] + range(main)[0] + range(end)[0]) / 3),
      Math.round((range(pre)[1] + range(main)[1] + range(end)[1]) / 3)
    ]

    itineraries.push({
      steps: [
        { place: pre, arriveAt: fmt(start), departAt: fmt(step1End), travelMinutes: hop(pre, main) },
        { place: main, arriveAt: fmt(step2Start), departAt: fmt(step2End), travelMinutes: hop(main, end) },
        { place: end, arriveAt: fmt(step3Start), departAt: fmt(step3End), travelMinutes: 0 },
      ],
      totalMinutes: total,
      perPersonEstimate: estimate
    })
  }

  return itineraries.length ? itineraries.slice(0,3) : []
}


// ----------------- DEALME3 Planner v2 helpers and types -----------------

export type VibeKey = 'low_key'|'playful'|'bougie'|'romantic'|'rainy_safe'|'hidden_gem'|'outdoors'

export interface PlannerV2Place {
  id: string;
  slug: string;
  name: string;
  area: string;
  priceMin?: number;
  priceMax?: number;
  priceLevel?: 1|2|3|4;
  leadTimeDays: number;
  vibes: VibeKey[];
  noise?: 'quiet'|'moderate'|'loud';
  stepFree?: boolean;
  alcoholOk?: boolean;
  dietary?: Array<'halal'|'no_pork'|'vegetarian'>;
  lat?: number; lng?: number;
  blurb?: string;
  bookingUrl?: string;
}

export interface PlanFormState {
  dateISO: string;
  startTime: string; // "19:00"
  budgetMin?: number;
  budgetMax?: number;
  area?: string;
  when: 'Tonight'|'Weeknight'|'Weekend'|'Date';
  durationHrs: number;    // 1.5–4
  maxTravelMins: number;  // 5–25
  walkInOnly: boolean;
  quiet?: boolean;
  stepFree?: boolean;
  alcoholOk?: boolean;
  vegetarian?: boolean;
  vibes?: VibeKey[];
  lockStep?: 1|2|3;
  // New optional UX fields
  originLat?: number;
  originLng?: number;
  transport?: 'walk'|'public'|'drive';
}

export interface PlanStep {
  place: PlannerV2Place;
  start: string; // "19:10"
  end: string;   // "20:00"
  confidence: number; // 0–100
  leadBadge: 'Walk-in'|'Book 1–2d'|'Book 3–7d'|'Book 1–2w';
}

export interface PlanResult { steps: PlanStep[]; note?: string; }

import rawPlaces from '@/data/places.json'
import { distanceKm as _distanceKm, priceBandFromLevel as _priceBandFromLevel } from './utils'

export function overlapsBudget(p: PlannerV2Place, min?: number, max?: number): boolean {
  const [bandMin, bandMax] = _priceBandFromLevel((p.priceLevel as 1|2|3) ?? 2)
  const a = p.priceMin ?? bandMin
  const b = p.priceMax ?? bandMax
  if (min == null && max == null) return true
  if (min == null) return a <= (max as number)
  if (max == null) return (min as number) <= b
  return Math.max(min, a) <= Math.min(max, b)
}

export function leadBadgeFor(days: number): PlanStep['leadBadge'] {
  if (days <= 0) return 'Walk-in'
  if (days <= 2) return 'Book 1–2d'
  if (days <= 7) return 'Book 3–7d'
  return 'Book 1–2w'
}

export function minutesBetween(a: PlannerV2Place, b: PlannerV2Place): number {
  if (a.lat && a.lng && b.lat && b.lng) {
    const km = _distanceKm({lat:a.lat,lng:a.lng}, {lat:b.lat,lng:b.lng})
    if (km != null) return Math.max(3, Math.round(km * 12))
  }
  // heuristic by area similarity
  if (a.area && b.area && a.area === b.area) return 7 + Math.round(Math.random()*4)
  return 12 + Math.round(Math.random()*6)
}

export function confidenceFor(p: PlannerV2Place, travelMins: number, opts?: { quiet?: boolean }): number {
  let c = 100
  if (p.leadTimeDays > 0) c -= Math.min(25, 10 + p.leadTimeDays)
  if (travelMins > 12) c -= Math.min(20, Math.round((travelMins-12) * 1.2))
  if (opts?.quiet && p.noise && p.noise !== 'quiet') c -= 10
  return Math.max(0, Math.min(100, c))
}

export function scheduleSteps(places: PlannerV2Place[], form: PlanFormState): PlanResult {
  const steps: PlanStep[] = []
  const [hStr,mStr] = form.startTime.split(':')
  let t = new Date()
  t.setHours(Number(hStr)||19, Number(mStr)||0, 0, 0)
  const durations = [0.25, 0.45, 0.30].map(x => Math.round(x * form.durationHrs * 60))

  const chosen = places.slice(0,3)
  for (let i=0; i<chosen.length; i++) {
    const p = chosen[i]
    const start = new Date(t)
    const travel = i>0 ? minutesBetween(chosen[i-1], p) : 0
    if (i>0) t = new Date(t.getTime() + travel*60000)
    const end = new Date(t.getTime() + (durations[i]||30)*60000)
    const fmt = (d: Date) => d.toTimeString().slice(0,5)
    const conf = confidenceFor(p, travel, { quiet: form.quiet })
    steps.push({ place: p, start: fmt(new Date(t)), end: fmt(end), confidence: conf, leadBadge: leadBadgeFor(p.leadTimeDays) })
    t = end
  }

  let note: string | undefined
  if (chosen.length>=2) {
    const m1 = minutesBetween(chosen[0], chosen[1])
    const m2 = chosen[2] ? minutesBetween(chosen[1], chosen[2]) : 0
    const over = Math.max(0, m1 - form.maxTravelMins, m2 - form.maxTravelMins)
    if (over > 0 && over <= 3) note = `+${over}m travel buffer`
  }
  return { steps, note }
}

// Feasibility + candidates for previews
export function feasibilityScore(form: PlanFormState): { plans: number; reasons?: string[] } {
  const base = loadPlaces()
  const filtered = applyConstraints(base, form)
  // quick estimate: proportion of filtered places ^ steps
  const ratio = filtered.length / Math.max(1, base.length)
  const approx = Math.round(Math.max(0, ratio) * 8)
  const reasons: string[] = []
  if (!filtered.length) {
    if (form.budgetMin!=null || form.budgetMax!=null) reasons.push('Tight budget')
    if (form.area) reasons.push(`Area filter “${form.area}”`)
    if (form.walkInOnly && form.when==='Tonight') reasons.push('Walk-in only tonight')
    if (form.quiet) reasons.push('Quiet constraint')
  }
  return { plans: approx, reasons: reasons.length?reasons:undefined }
}

export function generateCandidates(form: PlanFormState, n = 3): PlanResult[] {
  const base = applyConstraints(loadPlaces(), form)
  const res = scheduleSteps(base, form)
  return [res, res, res].slice(0, n)
}

export function applyConstraints(places: PlannerV2Place[], form: PlanFormState): PlannerV2Place[] {
  const q = (form.area || '').toLowerCase()
  return places.filter(p => {
    if (form.walkInOnly && p.leadTimeDays > 0) return false
    if (!overlapsBudget(p, form.budgetMin, form.budgetMax)) return false
    if (q && !(p.area.toLowerCase().includes(q))) return false
    if (form.quiet && p.noise === 'loud') return false
    if (form.stepFree && p.stepFree === false) return false
    if (form.alcoholOk === false && p.alcoholOk) return false
    if (form.vegetarian && !(p.dietary||[]).includes('vegetarian')) return false
    if (form.vibes && form.vibes.length && !form.vibes.some(v => (p.vibes||[]).includes(v))) return false
    return true
  })
}

export function loadPlaces(): PlannerV2Place[] {
  const arr: any[] = rawPlaces as any
  return arr.map((p:any): PlannerV2Place => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    area: p.area,
    priceMin: p.budget_min,
    priceMax: p.budget_max,
    priceLevel: p.price_level,
    leadTimeDays: p.lead_time_days,
    vibes: p.vibe_tags,
    noise: undefined,
    stepFree: undefined,
    alcoholOk: undefined,
    dietary: undefined,
    lat: p.lat,
    lng: p.lng,
    blurb: p.review_blurb,
    bookingUrl: p.booking_url,
  }))
}

export function readFormFromURL(): Partial<PlanFormState> {
  if (typeof window === 'undefined') return {}
  const sp = new URLSearchParams(window.location.search)
  return {
    budgetMin: sp.get('min') ? Number(sp.get('min')) : undefined,
    budgetMax: sp.get('max') ? Number(sp.get('max')) : undefined,
    area: sp.get('area') || undefined,
    when: (sp.get('when') as any) || undefined,
    durationHrs: sp.get('dur') ? Number(sp.get('dur')) : undefined,
    startTime: sp.get('start') || undefined,
    maxTravelMins: sp.get('travel') ? Number(sp.get('travel')) : undefined,
    walkInOnly: sp.get('walkin') === '1',
    quiet: sp.get('quiet') === '1',
    stepFree: sp.get('stepfree') === '1',
    alcoholOk: sp.get('alcohol') === '1' ? true : (sp.get('alcohol') === '0' ? false : undefined),
    vegetarian: sp.get('veg') === '1',
  }
}

export function writeFormToURL(s: PlanFormState): void {
  if (typeof window === 'undefined') return
  const sp = new URLSearchParams(window.location.search)
  const set = (k:string,v:any)=>{ if(v==null||v==='') sp.delete(k); else sp.set(k,String(v)) }
  set('min', s.budgetMin)
  set('max', s.budgetMax)
  set('area', s.area)
  set('when', s.when)
  set('dur', s.durationHrs)
  set('start', s.startTime)
  set('travel', s.maxTravelMins)
  set('walkin', s.walkInOnly?1:undefined)
  set('quiet', s.quiet?1:undefined)
  set('stepfree', s.stepFree?1:undefined)
  set('alcohol', s.alcoholOk===true?1:(s.alcoholOk===false?0:undefined))
  set('veg', s.vegetarian?1:undefined)
  const url = `${window.location.pathname}?${sp.toString()}`
  window.history.replaceState({}, '', url)
}

export function persistForm(s: PlanFormState): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem('planner:last', JSON.stringify(s)) } catch {}
}
export function restoreForm(): Partial<PlanFormState> {
  if (typeof window === 'undefined') return {}
  try { const v = localStorage.getItem('planner:last'); return v? JSON.parse(v) : {} } catch { return {} }
}
