export default function Steps() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { t: 'Tell us the vibe', d: 'Set budget, area, and when.' },
        { t: 'Deal you three', d: 'Realistic hops and timings.' },
        { t: 'Book or wander', d: 'Copy your plan and go.' }
      ].map((s,i) => (
        <div key={i} className="card p-5">
          <div className="text-2xl font-bold mb-2">{i+1}</div>
          <div className="font-semibold">{s.t}</div>
          <div className="text-white/70 text-sm">{s.d}</div>
        </div>
      ))}
    </div>
  )
}

