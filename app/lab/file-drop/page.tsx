'use client'

import { useState, useRef, useCallback, useEffect, DragEvent, ChangeEvent } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

// ─── Types ────────────────────────────────────────────────────────────────────

type FileStatus = 'pending' | 'uploading' | 'done' | 'error' | 'removing'

interface FileEntry {
  id: number
  file: File
  status: FileStatus
  progress: number
  error?: string
  entered: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(file: File): string {
  const t = file.type
  if (t.startsWith('image/')) return '🖼'
  if (t.startsWith('video/')) return '🎬'
  if (t.startsWith('audio/')) return '🎵'
  if (t === 'application/pdf') return '📄'
  if (t.includes('zip') || t.includes('tar') || t.includes('gzip')) return '📦'
  if (t.includes('json') || t.includes('javascript') || t.includes('typescript') || t.includes('text')) return '📝'
  if (t.includes('spreadsheet') || t.includes('excel') || t.includes('csv')) return '📊'
  if (t.includes('presentation') || t.includes('powerpoint')) return '📑'
  if (t.includes('word') || t.includes('document')) return '📃'
  return '📎'
}

function getExt(file: File): string {
  const parts = file.name.split('.')
  return parts.length > 1 ? `.${parts[parts.length - 1].toUpperCase()}` : ''
}

// ─── Progress Ring ────────────────────────────────────────────────────────────

function ProgressRing({ progress, size = 20, stroke = 2 }: { progress: number; size?: number; stroke?: number }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (progress / 100) * circ

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(10,10,10,0.08)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="#0a0a0a"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 80ms linear' }}
      />
    </svg>
  )
}

// ─── File Row ─────────────────────────────────────────────────────────────────

function FileRow({ entry, onRemove }: { entry: FileEntry; onRemove: (id: number) => void }) {
  const isRemoving = entry.status === 'removing' || !entry.entered
  const isDone = entry.status === 'done'
  const isError = entry.status === 'error'
  const isUploading = entry.status === 'uploading'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      borderRadius: '10px',
      background: isError ? 'rgba(220,38,38,0.04)' : 'rgba(10,10,10,0.02)',
      border: `1px solid ${isError ? 'rgba(220,38,38,0.12)' : 'rgba(10,10,10,0.06)'}`,
      transform: isRemoving ? 'scale(0.96) translateX(-4px)' : 'scale(1) translateX(0)',
      opacity: isRemoving ? 0 : 1,
      transition: 'transform 220ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms ease, background 150ms ease',
      overflow: 'hidden',
      willChange: 'transform, opacity',
    }}>
      {/* Icon */}
      <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, userSelect: 'none' }}>
        {getFileIcon(entry.file)}
      </span>

      {/* Name + size */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: '13px',
          fontWeight: 500,
          color: isError ? '#dc2626' : '#0a0a0a',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '18px',
          fontFamily: FONT,
        }}>
          {entry.file.name}
        </p>
        <p style={{
          margin: 0,
          fontSize: '11px',
          fontWeight: 500,
          color: isError ? 'rgba(220,38,38,0.7)' : 'rgba(10,10,10,0.4)',
          letterSpacing: '-0.01em',
          lineHeight: '16px',
          fontFamily: FONT,
        }}>
          {isError ? (entry.error ?? 'Upload failed') : `${formatSize(entry.file.size)} · ${getExt(entry.file)}`}
        </p>
      </div>

      {/* Status */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isUploading && <ProgressRing progress={entry.progress} />}

        {isDone && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#16a34a',
            flexShrink: 0,
          }}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}

        {isError && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#dc2626',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 700,
            flexShrink: 0,
          }}>!</span>
        )}

        <button
          onClick={() => onRemove(entry.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            borderRadius: '5px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'rgba(10,10,10,0.35)',
            fontSize: '12px',
            lineHeight: 1,
            flexShrink: 0,
            transition: 'color 120ms ease, background 120ms ease',
            fontFamily: FONT,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#0a0a0a'
            e.currentTarget.style.background = 'rgba(10,10,10,0.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(10,10,10,0.35)'
            e.currentTarget.style.background = 'transparent'
          }}
          aria-label="Remove file"
        >✕</button>
      </div>

      {/* Upload progress underline */}
      {isUploading && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          width: `${entry.progress}%`,
          background: 'rgba(10,10,10,0.15)',
          transition: 'width 80ms linear',
          borderRadius: '0 0 10px 10px',
        }} />
      )}
    </div>
  )
}

// ─── Drop Zone ────────────────────────────────────────────────────────────────

function FileDrop() {
  const [entries, setEntries] = useState<FileEntry[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [dragDepth, setDragDepth] = useState(0)
  const counterRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const rafMap = useRef<Map<number, number>>(new Map())

  const isDragging = dragDepth > 0

  const simulateUpload = useCallback((id: number) => {
    const startTime = performance.now()
    const duration = 1200 + Math.random() * 1200

    const willError = Math.random() < 0.15

    const tick = (now: number) => {
      const elapsed = now - startTime
      const raw = Math.min(elapsed / duration, 1)
      const eased = raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw
      const progress = Math.round(eased * (willError ? 60 + Math.random() * 20 : 100))

      setEntries(prev => prev.map(e => {
        if (e.id !== id) return e
        if (raw >= 1) {
          return {
            ...e,
            status: willError ? 'error' : 'done',
            progress: willError ? progress : 100,
            error: willError ? 'Server rejected file' : undefined,
          }
        }
        return { ...e, progress }
      }))

      if (raw < 1 && !willError) {
        rafMap.current.set(id, requestAnimationFrame(tick))
      } else if (raw >= 1 && willError) {
        // Stop
      } else if (!willError && raw >= 1) {
        rafMap.current.delete(id)
      }
    }

    rafMap.current.set(id, requestAnimationFrame(tick))
  }, [])

  useEffect(() => {
    return () => {
      rafMap.current.forEach(raf => cancelAnimationFrame(raf))
    }
  }, [])

  const addFiles = useCallback((files: File[]) => {
    const toAdd: FileEntry[] = []

    for (const file of files) {
      if (file.size > MAX_SIZE_BYTES) {
        const id = ++counterRef.current
        toAdd.push({
          id,
          file,
          status: 'error',
          progress: 0,
          error: `Exceeds ${MAX_SIZE_MB} MB limit`,
          entered: false,
        })
      } else {
        const id = ++counterRef.current
        toAdd.push({ id, file, status: 'uploading', progress: 0, entered: false })
      }
    }

    setEntries(prev => [...prev, ...toAdd])

    // Stagger enter animations
    toAdd.forEach((entry, i) => {
      setTimeout(() => {
        setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, entered: true } : e))
        if (entry.status === 'uploading') {
          setTimeout(() => simulateUpload(entry.id), 50)
        }
      }, i * 40 + 16)
    })
  }, [simulateUpload])

  const removeEntry = useCallback((id: number) => {
    const raf = rafMap.current.get(id)
    if (raf) { cancelAnimationFrame(raf); rafMap.current.delete(id) }

    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'removing' } : e))
    setTimeout(() => {
      setEntries(prev => prev.filter(e => e.id !== id))
    }, 250)
  }, [])

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragDepth(0)
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length) addFiles(files)
  }, [addFiles])

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragDepth(d => d + 1)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragDepth(d => {
      const next = d - 1
      return next < 0 ? 0 : next
    })
  }, [])

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length) addFiles(files)
    e.target.value = ''
  }, [addFiles])

  const clearAll = useCallback(() => {
    rafMap.current.forEach(raf => cancelAnimationFrame(raf))
    rafMap.current.clear()
    setEntries(prev => prev.map(e => ({ ...e, status: 'removing' })))
    setTimeout(() => setEntries([]), 260)
  }, [])

  const liveCount = entries.filter(e => e.status !== 'removing').length
  const doneCount = entries.filter(e => e.status === 'done').length
  const errorCount = entries.filter(e => e.status === 'error').length

  return (
    <div style={{
      width: '460px',
      maxWidth: 'calc(100vw - 48px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      fontFamily: FONT,
    }}>
      {/* Drop target */}
      <div
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
        style={{
          position: 'relative',
          borderRadius: '14px',
          border: `1.5px dashed ${isDragging ? 'rgba(10,10,10,0.40)' : 'rgba(10,10,10,0.14)'}`,
          background: isDragging ? 'rgba(10,10,10,0.04)' : '#fff',
          padding: '36px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          transition: 'border-color 180ms ease, background 180ms ease, transform 180ms ease',
          transform: isDragging ? 'scale(1.008)' : 'scale(1)',
          boxShadow: isDragging
            ? '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)'
            : '0 1px 4px rgba(0,0,0,0.04)',
          userSelect: 'none',
        }}
      >
        {/* Upload icon */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: isDragging ? 'rgba(10,10,10,0.08)' : 'rgba(10,10,10,0.04)',
          border: '1px solid rgba(10,10,10,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 180ms ease, transform 180ms ease',
          transform: isDragging ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 13V7M10 7L7.5 9.5M10 7L12.5 9.5" stroke={isDragging ? '#0a0a0a' : 'rgba(10,10,10,0.45)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 180ms ease' }} />
            <path d="M4.5 13.5C3.12 13.5 2 12.38 2 11a2.5 2.5 0 012.18-2.48A4 4 0 0110 5a4 4 0 015.82 3.52A2.5 2.5 0 0118 11c0 1.38-1.12 2.5-2.5 2.5" stroke={isDragging ? '#0a0a0a' : 'rgba(10,10,10,0.45)'} strokeWidth="1.5" strokeLinecap="round" style={{ transition: 'stroke 180ms ease' }} />
          </svg>
        </div>

        {/* Label */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: 600,
            color: isDragging ? '#0a0a0a' : 'rgba(10,10,10,0.75)',
            letterSpacing: '-0.01em',
            transition: 'color 180ms ease',
          }}>
            {isDragging ? 'Release to upload' : 'Drop files here or click to browse'}
          </p>
          <p style={{
            margin: '3px 0 0',
            fontSize: '12px',
            fontWeight: 500,
            color: 'rgba(10,10,10,0.35)',
            letterSpacing: '-0.01em',
          }}>
            Any file type · up to {MAX_SIZE_MB} MB each
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleInputChange}
          style={{ display: 'none' }}
          aria-hidden
        />
      </div>

      {/* File list */}
      {entries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
          {entries.map(entry => (
            <FileRow key={entry.id} entry={entry} onRemove={removeEntry} />
          ))}

          {/* Summary row */}
          {liveCount >= 2 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 4px 0',
            }}>
              <p style={{
                margin: 0,
                fontSize: '11px',
                fontWeight: 500,
                color: 'rgba(10,10,10,0.35)',
                letterSpacing: '-0.01em',
                fontFamily: FONT,
              }}>
                {doneCount}/{liveCount} uploaded
                {errorCount > 0 && ` · ${errorCount} failed`}
              </p>
              <button
                onClick={clearAll}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '2px 4px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'rgba(10,10,10,0.35)',
                  letterSpacing: '-0.01em',
                  fontFamily: FONT,
                  transition: 'color 120ms ease, background 120ms ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#0a0a0a'
                  e.currentTarget.style.background = 'rgba(10,10,10,0.05)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(10,10,10,0.35)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useCallback, useEffect, DragEvent, ChangeEvent } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

type FileStatus = 'pending' | 'uploading' | 'done' | 'error' | 'removing'

interface FileEntry {
  id: number
  file: File
  status: FileStatus
  progress: number
  error?: string
  entered: boolean
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return \`\${bytes} B\`
  if (bytes < 1024 * 1024) return \`\${(bytes / 1024).toFixed(1)} KB\`
  return \`\${(bytes / (1024 * 1024)).toFixed(1)} MB\`
}

function getFileIcon(file: File): string {
  const t = file.type
  if (t.startsWith('image/')) return '🖼'
  if (t.startsWith('video/')) return '🎬'
  if (t.startsWith('audio/')) return '🎵'
  if (t === 'application/pdf') return '📄'
  if (t.includes('zip') || t.includes('tar') || t.includes('gzip')) return '📦'
  if (t.includes('json') || t.includes('javascript') || t.includes('text')) return '📝'
  if (t.includes('spreadsheet') || t.includes('excel') || t.includes('csv')) return '📊'
  return '📎'
}

function getExt(file: File): string {
  const parts = file.name.split('.')
  return parts.length > 1 ? \`.\${parts[parts.length - 1].toUpperCase()}\` : ''
}

function ProgressRing({ progress, size = 20, stroke = 2 }: { progress: number; size?: number; stroke?: number }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (progress / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(10,10,10,0.08)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#0a0a0a" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 80ms linear' }} />
    </svg>
  )
}

function FileRow({ entry, onRemove }: { entry: FileEntry; onRemove: (id: number) => void }) {
  const isRemoving = entry.status === 'removing' || !entry.entered
  const isDone = entry.status === 'done'
  const isError = entry.status === 'error'
  const isUploading = entry.status === 'uploading'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '10px 12px', borderRadius: '10px',
      background: isError ? 'rgba(220,38,38,0.04)' : 'rgba(10,10,10,0.02)',
      border: \`1px solid \${isError ? 'rgba(220,38,38,0.12)' : 'rgba(10,10,10,0.06)'}\`,
      transform: isRemoving ? 'scale(0.96) translateX(-4px)' : 'scale(1) translateX(0)',
      opacity: isRemoving ? 0 : 1,
      transition: 'transform 220ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms ease',
      overflow: 'hidden', position: 'relative',
    }}>
      <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, userSelect: 'none' }}>
        {getFileIcon(entry.file)}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: isError ? '#dc2626' : '#0a0a0a', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '18px', fontFamily: FONT }}>
          {entry.file.name}
        </p>
        <p style={{ margin: 0, fontSize: '11px', fontWeight: 500, color: isError ? 'rgba(220,38,38,0.7)' : 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em', lineHeight: '16px', fontFamily: FONT }}>
          {isError ? (entry.error ?? 'Upload failed') : \`\${formatSize(entry.file.size)} · \${getExt(entry.file)}\`}
        </p>
      </div>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isUploading && <ProgressRing progress={entry.progress} />}
        {isDone && (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', background: '#16a34a', flexShrink: 0 }}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
        {isError && (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', background: '#dc2626', color: '#fff', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>!</span>
        )}
        <button onClick={() => onRemove(entry.id)} aria-label="Remove file"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '5px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(10,10,10,0.35)', fontSize: '12px', lineHeight: 1, flexShrink: 0, fontFamily: FONT }}>
          ✕
        </button>
      </div>
      {isUploading && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', width: \`\${entry.progress}%\`, background: 'rgba(10,10,10,0.15)', transition: 'width 80ms linear', borderRadius: '0 0 10px 10px' }} />
      )}
    </div>
  )
}

export function FileDrop({ maxSizeMB = 10 }: { maxSizeMB?: number }) {
  const maxBytes = maxSizeMB * 1024 * 1024
  const [entries, setEntries] = useState<FileEntry[]>([])
  const [dragDepth, setDragDepth] = useState(0)
  const counterRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const rafMap = useRef<Map<number, number>>(new Map())

  const isDragging = dragDepth > 0

  // Replace this with your real upload logic
  const simulateUpload = useCallback((id: number) => {
    const start = performance.now()
    const duration = 1200 + Math.random() * 1200
    const tick = (now: number) => {
      const raw = Math.min((now - start) / duration, 1)
      const progress = Math.round((-1 + (4 - 2 * raw) * raw) * 100) // ease-in-out
      setEntries(prev => prev.map(e => e.id !== id ? e : raw >= 1
        ? { ...e, status: 'done', progress: 100 }
        : { ...e, progress }
      ))
      if (raw < 1) rafMap.current.set(id, requestAnimationFrame(tick))
      else rafMap.current.delete(id)
    }
    rafMap.current.set(id, requestAnimationFrame(tick))
  }, [])

  useEffect(() => () => { rafMap.current.forEach(cancelAnimationFrame) }, [])

  const addFiles = useCallback((files: File[]) => {
    const toAdd: FileEntry[] = files.map(file => ({
      id: ++counterRef.current, file, entered: false,
      status: file.size > maxBytes ? 'error' : 'uploading',
      progress: 0,
      error: file.size > maxBytes ? \`Exceeds \${maxSizeMB} MB limit\` : undefined,
    }))
    setEntries(prev => [...prev, ...toAdd])
    toAdd.forEach((entry, i) => {
      setTimeout(() => {
        setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, entered: true } : e))
        if (entry.status === 'uploading') setTimeout(() => simulateUpload(entry.id), 50)
      }, i * 40 + 16)
    })
  }, [maxBytes, maxSizeMB, simulateUpload])

  const removeEntry = useCallback((id: number) => {
    const raf = rafMap.current.get(id)
    if (raf) { cancelAnimationFrame(raf); rafMap.current.delete(id) }
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'removing' } : e))
    setTimeout(() => setEntries(prev => prev.filter(e => e.id !== id)), 250)
  }, [])

  const clearAll = useCallback(() => {
    rafMap.current.forEach(cancelAnimationFrame); rafMap.current.clear()
    setEntries(prev => prev.map(e => ({ ...e, status: 'removing' })))
    setTimeout(() => setEntries([]), 260)
  }, [])

  return (
    <div style={{ width: '460px', maxWidth: 'calc(100vw - 48px)', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: FONT }}>
      <div
        onDrop={e => { e.preventDefault(); setDragDepth(0); addFiles(Array.from(e.dataTransfer.files)) }}
        onDragEnter={e => { e.preventDefault(); setDragDepth(d => d + 1) }}
        onDragLeave={e => { e.preventDefault(); setDragDepth(d => Math.max(0, d - 1)) }}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        style={{
          borderRadius: '14px',
          border: \`1.5px dashed \${isDragging ? 'rgba(10,10,10,0.40)' : 'rgba(10,10,10,0.14)'}\`,
          background: isDragging ? 'rgba(10,10,10,0.04)' : '#fff',
          padding: '36px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
          cursor: 'pointer',
          transition: 'border-color 180ms ease, background 180ms ease, transform 180ms ease',
          transform: isDragging ? 'scale(1.008)' : 'scale(1)',
          boxShadow: isDragging ? '0 8px 32px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
          userSelect: 'none',
        }}
      >
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: isDragging ? 'rgba(10,10,10,0.08)' : 'rgba(10,10,10,0.04)', border: '1px solid rgba(10,10,10,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 180ms ease, transform 180ms ease', transform: isDragging ? 'translateY(-2px) scale(1.05)' : 'none' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 13V7M10 7L7.5 9.5M10 7L12.5 9.5" stroke={isDragging ? '#0a0a0a' : 'rgba(10,10,10,0.45)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.5 13.5C3.12 13.5 2 12.38 2 11a2.5 2.5 0 012.18-2.48A4 4 0 0110 5a4 4 0 015.82 3.52A2.5 2.5 0 0118 11c0 1.38-1.12 2.5-2.5 2.5" stroke={isDragging ? '#0a0a0a' : 'rgba(10,10,10,0.45)'} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: isDragging ? '#0a0a0a' : 'rgba(10,10,10,0.75)', letterSpacing: '-0.01em', transition: 'color 180ms ease' }}>
            {isDragging ? 'Release to upload' : 'Drop files here or click to browse'}
          </p>
          <p style={{ margin: '3px 0 0', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', letterSpacing: '-0.01em' }}>
            Any file type · up to {maxSizeMB} MB each
          </p>
        </div>
        <input ref={inputRef} type="file" multiple onChange={e => { addFiles(Array.from(e.target.files ?? [])); e.target.value = '' }} style={{ display: 'none' }} />
      </div>

      {entries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {entries.map(entry => (
            <FileRow key={entry.id} entry={entry} onRemove={removeEntry} />
          ))}
          {entries.filter(e => e.status !== 'removing').length >= 2 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px 0' }}>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', letterSpacing: '-0.01em', fontFamily: FONT }}>
                {entries.filter(e => e.status === 'done').length}/{entries.filter(e => e.status !== 'removing').length} uploaded
              </p>
              <button onClick={clearAll} style={{ background: 'none', border: 'none', padding: '2px 4px', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', letterSpacing: '-0.01em', fontFamily: FONT }}>
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Usage:
// <FileDrop maxSizeMB={10} />`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FileDropPage() {
  return (
    <main style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      fontFamily: FONT,
    }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: '0',
      }}>
        <FileDrop />
        <p style={{
          marginTop: '28px',
          fontSize: '12px',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: FONT,
          textAlign: 'center',
        }}>
          Drag files onto the zone · or click to browse · files over 10 MB show an error state
        </p>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px',
          fontFamily: FONT,
        }}>
          Source
        </p>
        <div style={{
          background: '#0a0a0a',
          borderRadius: '12px',
          padding: '20px',
          overflowX: 'auto',
        }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize: '12px',
            lineHeight: '1.65',
            color: '#e5e5e5',
            whiteSpace: 'pre',
            overflowX: 'auto',
          }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
