export function buildGmapsDirections(steps: { name: string; lat?: number; lng?: number; address?: string }[], mode: 'walk'|'public'|'drive'='walk') {
  const travelmode = mode==='drive'?'driving':(mode==='public'?'transit':'walking')
  const waypoints = steps.map(s => encodeURIComponent(s.address || `${s.lat},${s.lng}`)).filter(Boolean)
  const origin = waypoints.shift() || ''
  const destination = waypoints.pop() || origin
  const wp = waypoints.length ? `&waypoints=${waypoints.join('|')}` : ''
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${wp}&travelmode=${travelmode}`
}

