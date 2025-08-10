import React from 'react'

export default function NsavePage() {
  return (
    <main className="bg-white relative overflow-auto">
      <div className="flex justify-center">
        <div className="w-full max-w-[600px]">
          <div className="pt-[80px] pb-2">
            <a href="/" className="text-[13px] text-neutral-600" style={{ fontWeight: 500, fontVariationSettings: "'wght' 500" }}>← Back</a>
          </div>
          <h1 className="text-[18px] text-black mb-3" style={{ fontWeight: 500, fontVariationSettings: "'wght' 500" }}>nsave</h1>
          <p className="text-[15px] text-black mb-6" style={{ fontWeight: 500, fontVariationSettings: "'wght' 500" }}>
            Case study page coming soon.
          </p>
          <div className="rounded-lg overflow-hidden border border-black/5">
            <img src="/nsave.webp" alt="nsave preview" className="w-full h-auto object-contain" />
          </div>
        </div>
      </div>
    </main>
  )
}