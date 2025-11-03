"use client"
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

const nav = [
  { href: '/reviews', label: 'Reviews' },
  { href: '/london', label: 'London' },
  { href: '/how', label: 'How it works' },
  { href: '/plan', label: 'Planner' }
]

export default function Header() {
  return (
    <header className="border-b border-border bg-bg">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-extrabold tracking-tight">DEALME3</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-textDim">
          {nav.map(i => <Link key={i.href} href={i.href} className="hover:text-text">{i.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
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
      </div>
    </header>
  )
}



