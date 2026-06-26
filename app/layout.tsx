import type { Metadata } from 'next'
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: 'Vraj Shah — Founding Product Designer | AI · Fintech · 0→1',
  description: 'Founding Designer working on 0→1 products at fast-moving startups across AI, fintech, and health. Currently at Peec AI, Berlin.',
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
    <html lang="en" className={cn("scroll-smooth", "font-sans", GeistSans.variable, GeistMono.variable)}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <Analytics mode="production" />
      </head>
      <body className="antialiased">
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
} 