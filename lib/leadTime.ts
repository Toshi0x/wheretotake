export function leadTimeBadge(d?: number) {
  if (d == null) return null
  if (d <= 0) return 'Walk-in'
  if (d <= 2) return 'Book 1–2d'
  if (d <= 7) return 'Book 3–7d'
  return 'Book 1–2w'
}

