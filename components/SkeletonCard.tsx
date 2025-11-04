export default function SkeletonCard() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="h-40 w-full rounded-lg bg-muted" />
      <div className="mt-3 h-4 w-1/2 bg-muted rounded" />
      <div className="mt-2 h-3 w-2/3 bg-muted rounded" />
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-muted" />
        <div className="h-6 w-20 rounded-full bg-muted" />
      </div>
      <div className="mt-3 h-8 w-28 rounded bg-muted" />
    </div>
  )
}

