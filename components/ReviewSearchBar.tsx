"use client"
import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { expandQueryTokens } from '@/lib/search'
import { track } from '@/lib/analytics'

export function Highlighter({ text, tokens }: { text: string; tokens: string[] }) {
  if (!tokens?.length || !text) return <>{text}</>
  const parts: React.ReactNode[] = []
  let remaining = text
  const regex = new RegExp(`(${tokens.map(t=>escapeRegExp(t)).join('|')})`, 'ig')
  let m: RegExpExecArray | null
  let lastIndex = 0
  while ((m = regex.exec(text)) !== null) {
    const start = m.index
    const end = regex.lastIndex
    if (start > lastIndex) parts.push(text.slice(lastIndex, start))
    parts.push(<mark key={start} className="bg-accent/20 px-0.5 rounded">{text.slice(start, end)}</mark>)
    lastIndex = end
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return <>{parts}</>
}

function escapeRegExp(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

export default function ReviewSearchBar({
  defaultQuery = '',
  onChange,
}: { defaultQuery?: string; onChange: (out: { tokens: string[]; query: string }) => void }) {
  const [query, setQuery] = React.useState(defaultQuery)
  const [tokens, setTokens] = React.useState<string[]>(expandQueryTokens(defaultQuery))
  const [recents, setRecents] = React.useState<string[]>([])
  const [showRecents, setShowRecents] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem('recentSearches')
    setRecents(raw ? JSON.parse(raw) : [])
  }, [])

  React.useEffect(() => { onChange({ tokens, query }) }, [tokens, query, onChange])

  function commit(q: string) {
    const t = expandQueryTokens(q)
    setTokens(t)
    setQuery(q)
    if (typeof window !== 'undefined') {
      const next = [q, ...recents.filter(x=>x!==q)].slice(0,5)
      setRecents(next)
      localStorage.setItem('recentSearches', JSON.stringify(next))
    }
    track('search', { tokens: t })
  }

  function removeToken(tok: string) {
    const t = tokens.filter(x => x.toLowerCase() !== tok.toLowerCase())
    setTokens(t)
    const rest = (query || '').split(/\s+/).filter(x=>!!x && !equalsToken(x, tok)).join(' ')
    setQuery(rest)
  }

  function equalsToken(a: string, b: string) {
    return a.replaceAll('"','').toLowerCase() === b.replaceAll('"','').toLowerCase()
  }

  return (
    <div className="space-y-2">
      <label htmlFor="reviews-search" className="text-sm">Search</label>
      <div className="relative">
        <Input
          id="reviews-search"
          value={query}
          onChange={(e)=> setQuery(e.target.value)}
          onKeyDown={(e)=>{ if (e.key==='Enter') commit(query) }}
          onFocus={()=> setShowRecents(true)}
          onBlur={()=> setTimeout(()=>setShowRecents(false), 120)}
          placeholder='e.g., "quiet" ramen soho'
          aria-label="Search reviews"
        />
        {showRecents && recents.length>0 && (
          <div className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-card shadow-soft">
            <div className="p-2 text-xs text-textDim">Recent searches</div>
            <ul>
              {recents.map((r,i)=> (
                <li key={i}>
                  <button type="button" className="w-full text-left px-3 py-2 hover:bg-muted" onMouseDown={()=>commit(r)}>{r}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {tokens.length>0 && (
        <div className="flex flex-wrap gap-2">
          {tokens.map(t => (
            <button key={t} type="button" className="rounded-full bg-muted text-textDim px-3 py-1 focus-ring" onClick={()=>removeToken(t)} aria-label={`Remove ${t}`}>
              {t} <span aria-hidden>×</span>
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <button type="button" className="rounded-xl bg-muted text-text px-3 py-1 focus-ring" onClick={()=>commit(query)}>Apply</button>
        <button type="button" className="rounded-xl bg-muted text-textDim px-3 py-1 focus-ring" onClick={()=>{ setQuery(''); setTokens([]); }}>Reset</button>
      </div>
    </div>
  )
}

