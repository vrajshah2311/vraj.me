'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type FileStatus = 'pending' | 'uploading' | 'done'

interface FileItem {
  id: string
  file: File
  status: FileStatus
  progress: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return '⬡'
  if (type.startsWith('video/')) return '▶'
  if (type.startsWith('audio/')) return '♪'
  if (type === 'application/pdf') return '◈'
  if (type.includes('zip') || type.includes('tar') || type.includes('gz')) return '⊞'
  if (type.includes('text') || type.includes('document')) return '☰'
  return '◇'
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

// ─── ProgressBar ──────────────────────────────────────────────────────────────

function ProgressBar({ progress, done }: { progress: number; done: boolean }) {
  return (
    <div style={{
      height: '2px',
      background: 'rgba(10,10,10,0.08)',
      borderRadius: '2px',
      overflow: 'hidden',
      marginTop: '5px',
    }}>
      <div style={{
        height: '100%',
        width: progress + '%',
        background: done ? '#16a34a' : 'rgba(10,10,10,0.55)',
        borderRadius: '2px',
        transition: 'width 200ms ease, background 400ms ease',
      }} />
    </div>
  )
}

// ─── FileRow ──────────────────────────────────────────────────────────────────

function FileRow({ item, onRemove }: { item: FileItem; onRemove: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)
  const showProgress = item.status === 'uploading' || item.status === 'done'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 12px',
        background: hovered ? 'rgba(10,10,10,0.02)' : 'transparent',
        transition: 'background 150ms ease',
      }}
    >
      {/* Icon badge */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: item.status === 'done' ? 'rgba(22,163,74,0.08)' : 'rgba(10,10,10,0.04)',
        border: '1px solid ' + (item.status === 'done' ? 'rgba(22,163,74,0.2)' : 'rgba(10,10,10,0.07)'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: '13px',
        color: item.status === 'done' ? '#16a34a' : '#0a0a0a',
        transition: 'background 400ms ease, border-color 400ms ease, color 400ms ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        {item.status === 'done' ? '✓' : getFileIcon(item.file.type)}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 500,
          color: '#0a0a0a',
          letterSpacing: '-0.01em',
          lineHeight: '18px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}>
          {item.file.name}
        </div>
        <div style={{
          fontSize: '11px',
          fontWeight: 500,
          color: item.status === 'done' ? '#16a34a' : 'rgba(10,10,10,0.4)',
          letterSpacing: '-0.01em',
          lineHeight: '16px',
          transition: 'color 400ms ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}>
          {formatSize(item.file.size)}
          {item.status === 'uploading' ? ' · ' + Math.round(item.progress) + '%' : ''}
          {item.status === 'done' ? ' · Uploaded' : ''}
        </div>
        {showProgress && <ProgressBar progress={item.progress} done={item.status === 'done'} />}
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 6px',
          color: hovered ? 'rgba(10,10,10,0.45)' : 'rgba(10,10,10,0.18)',
          fontSize: '12px',
          lineHeight: 1,
          borderRadius: '4px',
          flexShrink: 0,
          transition: 'color 150ms ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        ✕
      </button>
    </div>
  )
}

// ─── FileUploadDropzone ───────────────────────────────────────────────────────

function FileUploadDropzone() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCountRef = useRef(0)
  const timersRef = useRef<Record<string, ReturnType<typeof setInterval>>>({})

  const simulateUpload = useCallback((id: string) => {
    let progress = 0
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading' as FileStatus, progress: 0 } : f))
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 7
      if (progress >= 100) {
        clearInterval(interval)
        delete timersRef.current[id]
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'done' as FileStatus, progress: 100 } : f))
      } else {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress } : f))
      }
    }, 180)
    timersRef.current[id] = interval
  }, [])

  const addFiles = useCallback((newFiles: File[]) => {
    const items: FileItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      status: 'pending' as FileStatus,
      progress: 0,
    }))
    setFiles(prev => [...prev, ...items])
    items.forEach(item => setTimeout(() => simulateUpload(item.id), 80))
  }, [simulateUpload])

  const removeFile = useCallback((id: string) => {
    if (timersRef.current[id]) { clearInterval(timersRef.current[id]); delete timersRef.current[id] }
    setFiles(prev => prev.filter(f => f.id !== id))
  }, [])

  useEffect(() => () => { Object.values(timersRef.current).forEach(clearInterval) }, [])

  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); dragCountRef.current++; setDragging(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); dragCountRef.current--; if (dragCountRef.current === 0) setDragging(false) }
  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault() }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dragCountRef.current = 0
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    if (dropped.length) addFiles(dropped)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length) addFiles(selected)
    e.target.value = ''
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>
      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: '1.5px dashed ' + (dragging ? 'rgba(10,10,10,0.45)' : 'rgba(10,10,10,0.18)'),
          borderRadius: '14px',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          background: dragging ? 'rgba(10,10,10,0.035)' : 'rgba(255,255,255,0.5)',
          transition: 'border-color 200ms ease, background 200ms ease, transform 200ms cubic-bezier(0.32,0.72,0,1)',
          transform: dragging ? 'scale(1.015)' : 'scale(1)',
          userSelect: 'none',
        }}
      >
        {/* Icon */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: dragging ? 'rgba(10,10,10,0.08)' : 'rgba(10,10,10,0.04)',
          border: '1px solid ' + (dragging ? 'rgba(10,10,10,0.12)' : 'rgba(10,10,10,0.07)'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 200ms ease, border-color 200ms ease, transform 200ms cubic-bezier(0.32,0.72,0,1)',
          transform: dragging ? 'translateY(-3px)' : 'translateY(0)',
        }}>
          <svg
            width="20" height="20" viewBox="0 0 20 20" fill="none"
            style={{ color: dragging ? '#0a0a0a' : 'rgba(10,10,10,0.4)', transition: 'color 200ms ease' }}
          >
            <path d="M10 13V4M10 4L7 7M10 4L13 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 14.5v1A2.5 2.5 0 0 0 6.5 18h7A2.5 2.5 0 0 0 16 15.5v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        {/* Label */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '18px' }}>
            {dragging ? 'Release to upload' : 'Drop files or click to browse'}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em' }}>
            Any file type · up to 10 MB each
          </p>
        </div>

        <input ref={inputRef} type="file" multiple onChange={handleInputChange} style={{ display: 'none' }} />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div style={{
          marginTop: '8px',
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}>
          {files.map((item, i) => (
            <div key={item.id}>
              {i > 0 && <div style={{ height: '1px', background: 'rgba(10,10,10,0.05)', margin: '0 12px' }} />}
              <FileRow item={item} onRemove={removeFile} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

type FileStatus = 'pending' | 'uploading' | 'done'

interface FileItem {
  id: string
  file: File
  status: FileStatus
  progress: number
}

function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return '⬡'
  if (type.startsWith('video/')) return '▶'
  if (type.startsWith('audio/')) return '♪'
  if (type === 'application/pdf') return '◈'
  if (type.includes('zip') || type.includes('tar') || type.includes('gz')) return '⊞'
  if (type.includes('text') || type.includes('document')) return '☰'
  return '◇'
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

function ProgressBar({ progress, done }: { progress: number; done: boolean }) {
  return (
    <div style={{ height: '2px', background: 'rgba(10,10,10,0.08)', borderRadius: '2px', overflow: 'hidden', marginTop: '5px' }}>
      <div style={{
        height: '100%',
        width: progress + '%',
        background: done ? '#16a34a' : 'rgba(10,10,10,0.55)',
        borderRadius: '2px',
        transition: 'width 200ms ease, background 400ms ease',
      }} />
    </div>
  )
}

function FileRow({ item, onRemove }: { item: FileItem; onRemove: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)
  const showProgress = item.status === 'uploading' || item.status === 'done'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 12px',
        background: hovered ? 'rgba(10,10,10,0.02)' : 'transparent',
        transition: 'background 150ms ease',
      }}
    >
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: item.status === 'done' ? 'rgba(22,163,74,0.08)' : 'rgba(10,10,10,0.04)',
        border: '1px solid ' + (item.status === 'done' ? 'rgba(22,163,74,0.2)' : 'rgba(10,10,10,0.07)'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: '13px',
        color: item.status === 'done' ? '#16a34a' : '#0a0a0a',
        transition: 'background 400ms ease, border-color 400ms ease, color 400ms ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        {item.status === 'done' ? '✓' : getFileIcon(item.file.type)}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 500,
          color: '#0a0a0a',
          letterSpacing: '-0.01em',
          lineHeight: '18px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}>
          {item.file.name}
        </div>
        <div style={{
          fontSize: '11px',
          fontWeight: 500,
          color: item.status === 'done' ? '#16a34a' : 'rgba(10,10,10,0.4)',
          letterSpacing: '-0.01em',
          lineHeight: '16px',
          transition: 'color 400ms ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}>
          {formatSize(item.file.size)}
          {item.status === 'uploading' ? ' · ' + Math.round(item.progress) + '%' : ''}
          {item.status === 'done' ? ' · Uploaded' : ''}
        </div>
        {showProgress && <ProgressBar progress={item.progress} done={item.status === 'done'} />}
      </div>

      <button
        onClick={() => onRemove(item.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 6px',
          color: hovered ? 'rgba(10,10,10,0.45)' : 'rgba(10,10,10,0.18)',
          fontSize: '12px',
          lineHeight: 1,
          borderRadius: '4px',
          flexShrink: 0,
          transition: 'color 150ms ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >✕</button>
    </div>
  )
}

export function FileUploadDropzone() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCountRef = useRef(0)
  const timersRef = useRef<Record<string, ReturnType<typeof setInterval>>>({})

  const simulateUpload = useCallback((id: string) => {
    let progress = 0
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading' as FileStatus, progress: 0 } : f))
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 7
      if (progress >= 100) {
        clearInterval(interval)
        delete timersRef.current[id]
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'done' as FileStatus, progress: 100 } : f))
      } else {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress } : f))
      }
    }, 180)
    timersRef.current[id] = interval
  }, [])

  const addFiles = useCallback((newFiles: File[]) => {
    const items: FileItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      status: 'pending' as FileStatus,
      progress: 0,
    }))
    setFiles(prev => [...prev, ...items])
    items.forEach(item => setTimeout(() => simulateUpload(item.id), 80))
  }, [simulateUpload])

  const removeFile = useCallback((id: string) => {
    if (timersRef.current[id]) { clearInterval(timersRef.current[id]); delete timersRef.current[id] }
    setFiles(prev => prev.filter(f => f.id !== id))
  }, [])

  useEffect(() => () => { Object.values(timersRef.current).forEach(clearInterval) }, [])

  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); dragCountRef.current++; setDragging(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); dragCountRef.current--; if (dragCountRef.current === 0) setDragging(false) }
  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault() }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dragCountRef.current = 0
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    if (dropped.length) addFiles(dropped)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length) addFiles(selected)
    e.target.value = ''
  }

  return (
    <div style={{ width: '100%', maxWidth: '400px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: '1.5px dashed ' + (dragging ? 'rgba(10,10,10,0.45)' : 'rgba(10,10,10,0.18)'),
          borderRadius: '14px',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          background: dragging ? 'rgba(10,10,10,0.035)' : 'rgba(255,255,255,0.5)',
          transition: 'border-color 200ms ease, background 200ms ease, transform 200ms cubic-bezier(0.32,0.72,0,1)',
          transform: dragging ? 'scale(1.015)' : 'scale(1)',
          userSelect: 'none',
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: dragging ? 'rgba(10,10,10,0.08)' : 'rgba(10,10,10,0.04)',
          border: '1px solid ' + (dragging ? 'rgba(10,10,10,0.12)' : 'rgba(10,10,10,0.07)'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 200ms ease, border-color 200ms ease, transform 200ms cubic-bezier(0.32,0.72,0,1)',
          transform: dragging ? 'translateY(-3px)' : 'translateY(0)',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
            style={{ color: dragging ? '#0a0a0a' : 'rgba(10,10,10,0.4)', transition: 'color 200ms ease' }}>
            <path d="M10 13V4M10 4L7 7M10 4L13 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 14.5v1A2.5 2.5 0 0 0 6.5 18h7A2.5 2.5 0 0 0 16 15.5v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '18px' }}>
            {dragging ? 'Release to upload' : 'Drop files or click to browse'}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em' }}>
            Any file type · up to 10 MB each
          </p>
        </div>

        <input ref={inputRef} type="file" multiple onChange={handleInputChange} style={{ display: 'none' }} />
      </div>

      {files.length > 0 && (
        <div style={{
          marginTop: '8px',
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}>
          {files.map((item, i) => (
            <div key={item.id}>
              {i > 0 && <div style={{ height: '1px', background: 'rgba(10,10,10,0.05)', margin: '0 12px' }} />}
              <FileRow item={item} onRemove={removeFile} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FileUploadPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg, #ffffff)', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: '24px',
      }}>
        <FileUploadDropzone />
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}>
          Drag files onto the zone, or click to open the file picker
        </p>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-muted, rgba(10,10,10,0.4))',
          marginBottom: '12px',
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
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
