export function addHoursToTime(hhmm: string, hours: number): string {
  const [h,m] = (hhmm || '19:00').split(':').map(Number)
  const total = (h*60 + (m||0)) + Math.round(hours*60)
  const H = Math.floor((total/60)%24)
  const M = Math.round(total%60)
  return `${String(H).padStart(2,'0')}:${String(M).padStart(2,'0')}`
}

