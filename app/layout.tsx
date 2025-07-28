import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
} 