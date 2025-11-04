export function buildIcs(plan: { title: string; startISO: string; endISO: string; description?: string; location?: string }) {
  const dt = (s: string) => s.replace(/[-:]/g, '').split('.')[0] + 'Z'
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WhereTo//Planner//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@whereto`,
    `DTSTAMP:${dt(new Date().toISOString())}`,
    `DTSTART:${dt(plan.startISO)}`,
    `DTEND:${dt(plan.endISO)}`,
    `SUMMARY:${escape(plan.title)}`,
    plan.location ? `LOCATION:${escape(plan.location)}` : '',
    plan.description ? `DESCRIPTION:${escape(plan.description)}` : '',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean)
  return lines.join('\r\n')
}

function escape(s: string) { return s.replace(/[\n,;]/g, ' ') }

