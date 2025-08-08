'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

type ScrollContextValue = {
  isScrolled: boolean
  register: (el: HTMLElement) => void
  unregister: (el: HTMLElement) => void
}

const ScrollContext = createContext<ScrollContextValue | null>(null)

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containersRef = useRef<Set<HTMLElement>>(new Set())
  const [isScrolled, setIsScrolled] = useState(false)

  const recomputeIsScrolled = useCallback(() => {
    const anyScrolled = Array.from(containersRef.current).some((el) => (el?.scrollTop ?? 0) > 2)
    setIsScrolled(anyScrolled)
  }, [])

  const onScroll = useCallback(() => {
    recomputeIsScrolled()
  }, [recomputeIsScrolled])

  const register = useCallback((el: HTMLElement) => {
    if (!el || containersRef.current.has(el)) return
    containersRef.current.add(el)
    el.addEventListener('scroll', onScroll, { passive: true })
    // Initial compute after registering
    recomputeIsScrolled()
  }, [onScroll, recomputeIsScrolled])

  const unregister = useCallback((el: HTMLElement) => {
    if (!el || !containersRef.current.has(el)) return
    el.removeEventListener('scroll', onScroll as EventListener)
    containersRef.current.delete(el)
    // Recompute after unregister
    recomputeIsScrolled()
  }, [onScroll, recomputeIsScrolled])

  // As a fallback, also listen to window scroll to catch page-level scroll if used
  useEffect(() => {
    const handleWindowScroll = () => recomputeIsScrolled()
    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [recomputeIsScrolled])

  const value = useMemo(() => ({ isScrolled, register, unregister }), [isScrolled, register, unregister])

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  )
}

export const useScroll = () => {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useScroll must be used within ScrollProvider')
  return ctx
}

export const useRegisterScrollContainer = (ref: React.RefObject<HTMLElement>) => {
  const { register, unregister } = useScroll()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    register(el)
    return () => {
      unregister(el)
    }
  }, [ref, register, unregister])
}

