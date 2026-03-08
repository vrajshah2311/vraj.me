"use client"

import React, { useState } from "react"
import Image from "next/image"
import ImageLightbox from "../../components/ImageLightbox"

const images: string[] = [
  '/images/case-studies/mn1.png',
  '/images/case-studies/exp1.png',
  '/images/case-studies/exp2.png',
  '/images/case-studies/exp3.png',
  '/images/case-studies/exp4.png',
  '/images/case-studies/exp5.png',
  '/images/case-studies/work/wh1.png',
  '/images/case-studies/work/el1.png',
  '/images/case-studies/work/co1.png',
  '/images/case-studies/work/co2.png',
  '/images/case-studies/nsave/ns1.png',
  '/images/case-studies/nsave/ns2.png',
  '/images/case-studies/nsave/ns3.png',
  '/images/case-studies/nsave/ns4.png',
  '/images/case-studies/nsave/ns5.png',
  '/images/case-studies/nsave/ns6.png',
  '/images/case-studies/nsave/ns7.png',
  '/images/case-studies/nsave/ns8.png',
  '/images/case-studies/nsave/ns9.png',
  '/images/case-studies/nsave/ns10.png',
  '/images/case-studies/nsave/ns11.png',
  '/images/case-studies/profound/pr1.png',
  '/images/case-studies/profound/pr2.png',
  '/images/case-studies/profound/pr3.png',
  '/images/case-studies/profound/pr4.png',
  '/images/case-studies/profound/pr5.png',
  '/images/case-studies/profound/pr6.png',
  '/images/case-studies/profound/pr7.png',
  '/images/case-studies/profound/pem1.png',
  '/images/case-studies/profound/pem2.png',
  '/images/case-studies/profound/pem3.png',
  '/images/case-studies/profound/pem4.png',
  '/images/case-studies/profound/pem5.png',
  '/images/case-studies/profound/pem6.png',
  '/images/case-studies/ex1.png',
  '/images/case-studies/ln1.png',
  '/images/case-studies/ln2.png',
  '/images/case-studies/ln3.png',
  '/images/case-studies/work/ni2.png',
  '/images/case-studies/work/ni3.png',
  '/images/case-studies/work/ni4.png',
  '/images/case-studies/work/ni5.png',
  '/images/case-studies/work/ni6.png',
  '/images/case-studies/work/ni7.png',
  '/images/case-studies/work/ni8.png',
  '/images/case-studies/work/ni9.png',
  '/images/case-studies/work/ni10.png',
  '/images/case-studies/work/ni11.png',
  '/images/case-studies/work/ni12.png',
  '/images/case-studies/work/ni14.png',
  '/images/case-studies/work/ni15.png',
  '/images/case-studies/work/ni16.png',
  '/images/case-studies/work/ni17.png',
  '/images/case-studies/work/ni18.png',
]

export default function AllWorkPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <main style={{ backgroundColor: 'var(--bg)', padding: '4px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: '4px' }}>
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              className="aspect-video rounded-[8px] overflow-hidden relative w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--link)]"
              style={{ border: '1px solid var(--border-cell)' }}
              onClick={() => setLightboxIndex(i)}
            >
              <Image src={src} alt={`All work ${i + 1}`} width={400} height={225} className="w-full h-full object-cover block rounded-[8px]" loading={i < 9 ? 'eager' : 'lazy'} unoptimized />
            </button>
          ))}
          {Array.from({ length: (3 - (images.length % 3)) % 3 }, (_, i) => (
            <div key={`empty-${i}`} className="aspect-video rounded-[8px] overflow-hidden relative" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-cell)' }} aria-hidden />
          ))}
        </div>

        {lightboxIndex !== null && (
          <ImageLightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
            altPrefix="All work"
          />
        )}
      </main>
    </>
  )
}
