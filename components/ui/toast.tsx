"use client"
import * as React from 'react'
import { cn } from '@/lib/utils'

type Toast = { id: number; title: string; description?: string }

const ToastContext = React.createContext<{ notify: (t: Omit<Toast,'id'>) => void }|null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const notify = React.useCallback((t: Omit<Toast,'id'>) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, ...t }])
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3500)
  }, [])
  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={cn('rounded-xl bg-card border border-border px-4 py-3 shadow-soft')}
            role="status" aria-live="polite">
            <div className="text-sm font-semibold">{t.title}</div>
            {t.description && <div className="text-xs text-textDim">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
