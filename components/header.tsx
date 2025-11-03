"use client"
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'

const nav = [
  { href: '/collections', label: 'Collections' },
  { href: '/london', label: 'London' },
  { href: '/how', label: 'How it works' },
  { href: '/plan', label: 'Open App' }
]

export default function Header() {
  return (
    <header className="border-b border-white/5">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-extrabold tracking-tight">WHERE TO TAKE</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          {nav.map(i => <Link key={i.href} href={i.href} className="hover:text-white">{i.label}</Link>)}
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="mt-10 flex flex-col gap-4 text-lg">
                {nav.map(i => <Link key={i.href} href={i.href} className="py-2">{i.label}</Link>)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

