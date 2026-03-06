'use client'

import { useState, useRef, useEffect } from 'react'

const TAG_COLORS = [
  { bg: '#EEF2FF', text: '#4338CA', dot: '#818CF8' },
  { bg: '#DBEAFE', text: '#1D4ED8', dot: '#60A5FA' },
  { bg: '#D1FAE5', text: '#065F46', dot: '#34D399' },
  { bg: '#FEF9C3', text: '#854D0E', dot: '#FCD34D' },
  { bg: '#FEE2E2', text: '#991B1B', dot: '#FCA5A5' },
  { bg: '#FCE7F3', text: '#9D174D', dot: '#F9A8D4' },
  { bg: '#F3E8FF', text: '#6B21A8', dot: '#C084FC' },
  { bg: '#FFEDD5', text: '#9A3412', dot: '#FB923C' },
  { bg: '#CCFBF1', text: '#134E4A', dot: '#2DD4BF' },
  { bg: '#F1F5F9', text: '#334155', dot: '#94A3B8' },
]

type Tag = { id: string; label: string; colorIndex: number }

const initialAvailable: Tag[] = [
  { id: 'a1', label: 'Electric vehicles', colorIndex: 1 },
  { id: 'a2', label: 'Branded', colorIndex: 3 },
  { id: 'a3', label: 'Car models', colorIndex: 2 },
  { id: 'a4', label: 'Electric services', colorIndex: 0 },
  { id: 'a5', label: 'Maintenance', colorIndex: 6 },
  { id: 'a6', label: 'Finance offers', colorIndex: 7 },
  { id: 'a7', label: 'Test drive', colorIndex: 8 },
]

const initialCurrent: Tag[] = [
  { id: 'c1', label: 'Branded', colorIndex: 3 },
  { id: 'c2', label: 'Non-branded', colorIndex: 2 },
  { id: 'c3', label: 'Informative', colorIndex: 0 },
  { id: 'c4', label: 'Active', colorIndex: 6 },
]

const font: React.CSSProperties = { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif', letterSpacing: '-0.015em' }

function TagPill({ tag, onRemove, onClick }: { tag: Tag; onRemove?: () => void; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)
  const c = TAG_COLORS[tag.colorIndex]
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 7px 3px 6px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, background: c.bg, color: c.text, cursor: 'pointer', userSelect: 'none', border: `1px solid ${c.dot}22`, ...font }}
    >
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {tag.label}
      {onRemove && hovered && (
        <button
          onClick={e => { e.stopPropagation(); onRemove() }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '13px', height: '13px', borderRadius: '3px', background: `${c.dot}33`, border: 'none', cursor: 'pointer', color: c.text, padding: 0, fontSize: '12px', lineHeight: 1 }}
        >×</button>
      )}
    </span>
  )
}

function TagDropdown({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('')
  const [current, setCurrent] = useState<Tag[]>(initialCurrent)
  const [available, setAvailable] = useState<Tag[]>(initialAvailable)
  const [editing, setEditing] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editColor, setEditColor] = useState(0)
  const [hoveredAvail, setHoveredAvail] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const currentIds = new Set(current.map(t => t.label.toLowerCase()))
  const filteredAvailable = available.filter(t => !currentIds.has(t.label.toLowerCase()) && t.label.toLowerCase().includes(search.toLowerCase()))
  const filteredCurrent = current.filter(t => t.label.toLowerCase().includes(search.toLowerCase()))
  const canCreate = search.trim() && ![...current, ...available].some(t => t.label.toLowerCase() === search.trim().toLowerCase())

  const addTag = (tag: Tag) => setCurrent(c => [...c, tag])
  const removeTag = (id: string) => { setCurrent(c => c.filter(t => t.id !== id)); if (editing === id) setEditing(null) }
  const deleteTag = (id: string) => { setAvailable(a => a.filter(t => t.id !== id)); setCurrent(c => c.filter(t => t.id !== id)); if (editing === id) setEditing(null) }
  const saveEdit = () => {
    const update = (tags: Tag[]) => tags.map(t => t.id === editing ? { ...t, label: editLabel, colorIndex: editColor } : t)
    setCurrent(update); setAvailable(update); setEditing(null)
  }
  const createTag = () => {
    const label = search.trim(); if (!label) return
    const newTag: Tag = { id: `new-${Date.now()}`, label, colorIndex: Math.floor(Math.random() * TAG_COLORS.length) }
    setAvailable(a => [...a, newTag]); setCurrent(c => [...c, newTag]); setSearch('')
  }
  const startEdit = (tag: Tag) => { setEditing(tag.id); setEditLabel(tag.label); setEditColor(tag.colorIndex) }

  const editingTag = editing ? [...current, ...available].find(t => t.id === editing) : null
  const editC = TAG_COLORS[editColor]

  return (
    <div ref={ref} style={{ width: '260px', background: '#fff', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 0 0 1px rgba(0,0,0,0.02), 0 4px 8px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 13px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.25, flexShrink: 0 }}>
          <circle cx="6.5" cy="6.5" r="5" stroke="#000" strokeWidth="1.6" />
          <path d="M10.5 10.5L14 14" stroke="#000" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && canCreate) createTag(); if (e.key === 'Escape') onClose() }}
          placeholder="Search or create tags"
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', fontWeight: 500, color: '#111', background: 'transparent', ...font }}
        />
      </div>

      {/* Edit panel */}
      {editing && editingTag && (
        <div style={{ padding: '12px 13px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#FAFAFA' }}>
          {/* Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 10px', background: '#fff', borderRadius: '9px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', marginBottom: '11px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: editC.dot, flexShrink: 0 }} />
            <input
              autoFocus
              value={editLabel}
              onChange={e => setEditLabel(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(null) }}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', fontWeight: 500, color: '#111', background: 'transparent', ...font }}
            />
            <button onClick={saveEdit} style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '6px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer', letterSpacing: '-0.01em', ...font }}>Save</button>
          </div>

          {/* Color label */}
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.28)', marginBottom: '8px', ...font }}>Choose color</p>

          {/* Color swatches */}
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '11px' }}>
            {TAG_COLORS.map((c, i) => (
              <button
                key={i}
                onClick={() => setEditColor(i)}
                title={`Color ${i + 1}`}
                style={{ width: '20px', height: '20px', borderRadius: '50%', background: c.bg, border: editColor === i ? `2px solid ${c.dot}` : '1.5px solid rgba(0,0,0,0.08)', cursor: 'pointer', padding: 0, outline: 'none', position: 'relative', boxShadow: editColor === i ? `0 0 0 2px #fff, 0 0 0 3.5px ${c.dot}` : 'none', transition: 'box-shadow 0.12s' }}
              />
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={() => { removeTag(editing!); setEditing(null) }} style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(0,0,0,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, ...font }}>Remove tag</button>
            <span style={{ width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(0,0,0,0.2)' }} />
            <button onClick={() => deleteTag(editing!)} style={{ fontSize: '12px', fontWeight: 500, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0, ...font }}>Delete tag</button>
          </div>
        </div>
      )}

      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>

        {/* Current tags */}
        {filteredCurrent.length > 0 && (
          <div style={{ padding: '10px 13px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(0,0,0,0.28)', letterSpacing: '0.07em', textTransform: 'uppercase', ...font }}>Current tags</span>
              <button onClick={() => setCurrent([])} style={{ fontSize: '11.5px', fontWeight: 500, color: 'rgba(0,0,0,0.35)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, ...font }}>Remove all</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {filteredCurrent.map(tag => (
                <TagPill key={tag.id} tag={tag} onRemove={() => removeTag(tag.id)} onClick={() => editing === tag.id ? setEditing(null) : startEdit(tag)} />
              ))}
            </div>
          </div>
        )}

        {/* Create new */}
        {canCreate && (
          <div style={{ padding: '4px 13px' }}>
            <button
              onClick={createTag}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: '#111', background: 'none', border: 'none', cursor: 'pointer', padding: '5px 0', width: '100%', textAlign: 'left', ...font }}
            >
              <span style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: 'rgba(0,0,0,0.4)', flexShrink: 0 }}>+</span>
              <span>Create <span style={{ color: 'rgba(0,0,0,0.5)' }}>&ldquo;{search.trim()}&rdquo;</span></span>
            </button>
          </div>
        )}

        {/* Divider */}
        {filteredCurrent.length > 0 && filteredAvailable.length > 0 && (
          <div style={{ margin: '0 13px', height: '1px', background: 'rgba(0,0,0,0.05)' }} />
        )}

        {/* Available tags */}
        {filteredAvailable.length > 0 && (
          <div style={{ padding: '8px 13px 10px' }}>
            <span style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: 'rgba(0,0,0,0.28)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '5px', ...font }}>Available tags</span>
            {filteredAvailable.map(tag => {
              const isHovered = hoveredAvail === tag.id
              return (
                <div
                  key={tag.id}
                  onMouseEnter={() => setHoveredAvail(tag.id)}
                  onMouseLeave={() => setHoveredAvail(null)}
                  onClick={() => addTag(tag)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer', background: isHovered ? 'rgba(0,0,0,0.04)' : 'transparent' }}
                >
                  <TagPill tag={tag} />
                  {isHovered && (
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '-0.01em', ...font }}>Add tag</span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {filteredCurrent.length === 0 && filteredAvailable.length === 0 && !canCreate && (
          <div style={{ padding: '24px 13px', textAlign: 'center', fontSize: '13px', color: 'rgba(0,0,0,0.2)', fontWeight: 500, ...font }}>No tags found</div>
        )}
      </div>

      {/* Footer */}
      {current.length > 0 && (
        <div style={{ padding: '9px 13px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11.5px', color: 'rgba(0,0,0,0.3)', fontWeight: 500, ...font }}>{current.length} tag{current.length !== 1 ? 's' : ''} applied</span>
          <button onClick={() => { setCurrent([]); setAvailable([]) }} style={{ fontSize: '11.5px', fontWeight: 500, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0, ...font }}>
            Delete all
          </button>
        </div>
      )}
    </div>
  )
}

export default function DropdownPage() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #F5F6F8 0%, #ECEEF2 100%)' }}>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 13px', borderRadius: '9px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', fontSize: '13px', fontWeight: 500, color: '#111', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', ...font }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.4 }}>
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Tags
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.35, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 50 }}>
            <TagDropdown onClose={() => setOpen(false)} />
          </div>
        )}
      </div>
    </div>
  )
}
