import type { Metadata } from 'next'
import './globals.css'
import { ScrollProvider } from '../components/ScrollContext'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import PerformanceOptimizer from '../components/PerformanceOptimizer'

export const metadata: Metadata = {
  title: 'Vraj - Designer & Developer',
  description: 'Portfolio of Vraj - A creative designer and developer building beautiful digital experiences.',
  keywords: ['designer', 'developer', 'portfolio', 'web design', 'UI/UX'],
  authors: [{ name: 'Vraj' }],
  creator: 'Vraj',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vraj.me',
    title: 'Vraj - Designer & Developer',
    description: 'Portfolio of Vraj - A creative designer and developer building beautiful digital experiences.',
    siteName: 'Vraj Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vraj - Designer & Developer',
    description: 'Portfolio of Vraj - A creative designer and developer building beautiful digital experiences.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <Analytics mode="production" />
      </head>
      <body className="antialiased">
        <ScrollProvider>
          {children}
        </ScrollProvider>
        <PerformanceOptimizer />
        <SpeedInsights />
      </body>
    </html>
  )
} 