'use client'

import { useEffect, useState } from 'react'

export default function PrintButton() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  const handle = async () => {
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: 'Vraj Shah — Resume',
          text: 'Resume of Vraj Shah, Founding Designer',
          url: window.location.href,
        })
        return
      } catch {}
    }
    window.print()
  }

  return (
    <div className="no-print" style={{ position: 'fixed', top: 20, right: 20, zIndex: 100 }}>
      <button
        onClick={handle}
        style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
      >
        {isMobile ? 'Share / Save' : 'Save PDF'}
      </button>
    </div>
  )
}
