'use client'

import { useRouter } from 'next/navigation'

const vaultImages: string[] = [
  '/images/case-studies/work/Ni2.png',
  '/images/case-studies/work/Ni3.png',
  '/images/case-studies/work/Ni4.png',
  '/images/case-studies/work/Ni5.png',
  '/images/case-studies/work/Ni6.png',
  '/images/case-studies/work/Ni7.png',
  '/images/case-studies/work/Ni8.png',
  '/images/case-studies/work/Ni9.png',
  '/images/case-studies/work/Ni10.png',
  '/images/case-studies/work/Ni11.png',
  '/images/case-studies/work/Ni12.png',
  // Newly requested image
  '/images/case-studies/MN1.png'
]

export default function VaultRedirectPage() {
  const router = useRouter()
  // Immediately redirect to new route to avoid confusion
  if (typeof window !== 'undefined') {
    router.replace('/gallery')
  }
  return null
}


