export const dynamic = 'force-dynamic'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { ToastProvider } from '@/components/ui/toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Where To Take — Three date options in 30 seconds',
  description: 'Pick your vibe, set your budget, and get a mini-plan with realistic travel times. London-first.',
  openGraph: {
    title: 'Where To Take',
    description: 'Three date options in 30 seconds',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Where To Take',
    description: 'Three date options in 30 seconds'
  },
  alternates: { canonical: '/' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-[hsl(var(--card))] focus:border focus:border-white/20 focus:px-3 focus:py-2 focus:rounded-md">Skip to content</a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ToastProvider>
            <Header />
            <main id="main" className="container-page py-8">{children}</main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

