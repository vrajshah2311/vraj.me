'use client'

import React, { useEffect, useState } from 'react'

interface PerformanceMetrics {
  fcp: number | null
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
}

const PerformanceOptimizer: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  })

  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return

    // Measure First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }))
      }
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    // Measure Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
      }
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // Measure First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming
          if (fidEntry.processingStart) {
            setMetrics(prev => ({ ...prev, fid: fidEntry.processingStart - fidEntry.startTime }))
          }
        }
      })
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // Measure Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
          setMetrics(prev => ({ ...prev, cls: clsValue }))
        }
      })
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // Measure Time to First Byte (TTFB)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      setMetrics(prev => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }))
    }

    // Cleanup
    return () => {
      fcpObserver.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
    }
  }, [])

  // Log performance issues to console in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (metrics.fcp && metrics.fcp > 2000) {
        console.warn('⚠️ FCP is slow:', metrics.fcp, 'ms (should be < 2000ms)')
      }
      if (metrics.lcp && metrics.lcp > 4000) {
        console.warn('⚠️ LCP is slow:', metrics.lcp, 'ms (should be < 4000ms)')
      }
      if (metrics.fid && metrics.fid > 100) {
        console.warn('⚠️ FID is slow:', metrics.fid, 'ms (should be < 100ms)')
      }
      if (metrics.cls && metrics.cls > 0.1) {
        console.warn('⚠️ CLS is poor:', metrics.cls, '(should be < 0.1)')
      }
    }
  }, [metrics])

  return null // This component doesn't render anything
}

export default PerformanceOptimizer
