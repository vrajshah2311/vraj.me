'use client'

import dynamic from 'next/dynamic'

// Skip SSR — React Flow relies on browser layout APIs that break with Next.js hydration
const PromptBuilderCanvas = dynamic(() => import('./PromptBuilderCanvas'), { ssr: false })

export default function PromptBuilderPage() {
  return <PromptBuilderCanvas />
}
