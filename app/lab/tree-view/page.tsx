'use client'

import { useState } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ────────────────────────────────────────────────────────────────────

export type FileNode = {
  id: string
  name: string
  type: 'folder' | 'file'
  ext?: string
  children?: FileNode[]
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const TREE: FileNode[] = [
  { id: '1', name: 'src', type: 'folder', children: [
    { id: '2', name: 'components', type: 'folder', children: [
      { id: '3', name: 'Button.tsx', type: 'file', ext: 'tsx' },
      { id: '4', name: 'Input.tsx', type: 'file', ext: 'tsx' },
      { id: '5', name: 'Modal.tsx', type: 'file', ext: 'tsx' },
    ]},
    { id: '6', name: 'hooks', type: 'folder', children: [
      { id: '7', name: 'useDebounce.ts', type: 'file', ext: 'ts' },
      { id: '8', name: 'useLocalStorage.ts', type: 'file', ext: 'ts' },
    ]},
    { id: '9', name: 'app.tsx', type: 'file', ext: 'tsx' },
    { id: '10', name: 'index.ts', type: 'file', ext: 'ts' },
  ]},
  { id: '11', name: 'public', type: 'folder', children: [
    { id: '12', name: 'logo.svg', type: 'file', ext: 'svg' },
    { id: '13', name: 'favicon.ico', type: 'file', ext: 'ico' },
  ]},
  { id: '14', name: 'package.json', type: 'file', ext: 'json' },
  { id: '15', name: 'tsconfig.json', type: 'file', ext: 'json' },
  { id: '16', name: 'README.md', type: 'file', ext: 'md' },
]

// ─── Extension mappings ───────────────────────────────────────────────────────

const EXT_COLORS: Record<string, string> = {
  tsx: '#61dafb', jsx: '#61dafb',
  ts: '#3178c6', js: '#f7df1e',
  json: '#f59e0b', md: '#7c3aed',
  css: '#264de4', scss: '#cd6799',
  svg: '#ff7700', html: '#e34f26',
  ico: '#9ca3af',
}

const EXT_LABELS: Record<string, string> = {
  tsx: 'TypeScript JSX', jsx: 'JavaScript JSX',
  ts: 'TypeScript', js: 'JavaScript',
  json: 'JSON', md: 'Markdown',
  css: 'CSS', scss: 'SCSS',
  svg: 'SVG', html: 'HTML',
  ico: 'Icon file',
}

function extColor(ext?: string): string {
  return ext ? (EXT_COLORS[ext.toLowerCase()] ?? '#9ca3af') : '#9ca3af'
}

function extLabel(ext?: string): string {
  return ext ? (EXT_LABELS[ext.toLowerCase()] ?? ext.toUpperCase()) : 'File'
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function FileIcon({ ext, size = 13 }: { ext?: string; size?: number }) {
  const c = extColor(ext)
  const h = Math.round(size * 14 / 13)
  return (
    <svg width={size} height={h} viewBox="0 0 13 14" fill="none" style={{ flexShrink: 0 }}>
      <rect x="0.5" y="0.5" width="12" height="13" rx="2.5" fill="white" stroke="rgba(10,10,10,0.1)" strokeWidth="0.8"/>
      <rect x="3" y="4.5" width="7" height="1" rx="0.5" fill={c} opacity="0.85"/>
      <rect x="3" y="6.5" width="5" height="1" rx="0.5" fill={c} opacity="0.55"/>
      <rect x="3" y="8.5" width="6" height="1" rx="0.5" fill={c} opacity="0.35"/>
    </svg>
  )
}

function FolderIcon({ open, size = 14 }: { open: boolean; size?: number }) {
  const h = Math.round(size * 12 / 14)
  return (
    <svg width={size} height={h} viewBox="0 0 14 12" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M0.5 2.5C0.5 1.948 0.948 1.5 1.5 1.5H5.2L6.5 2.8C6.69 2.97 6.86 3 7.07 3H12.5C13.052 3 13.5 3.448 13.5 4V10C13.5 10.552 13.052 11 12.5 11H1.5C0.948 11 0.5 10.552 0.5 10V2.5Z"
        fill={open ? '#fde68a' : '#fef3c7'}
        stroke="#d97706"
        strokeWidth="0.7"
      />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 10 10" fill="none"
      style={{
        flexShrink: 0,
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform 200ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <path d="M3.5 2L6.5 5L3.5 8" stroke="rgba(10,10,10,0.28)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ─── TreeNode ─────────────────────────────────────────────────────────────────

function TreeNode({
  node, depth, selectedId, onSelect, initOpen = false,
}: {
  node: FileNode
  depth: number
  selectedId: string | null
  onSelect: (node: FileNode) => void
  initOpen?: boolean
}) {
  const [open, setOpen] = useState(initOpen)
  const [hovered, setHovered] = useState(false)
  const isFolder = node.type === 'folder'
  const isSelected = selectedId === node.id

  return (
    <div>
      <button
        onClick={() => { if (isFolder) setOpen(v => !v); onSelect(node) }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 6px 3px ' + (6 + depth * 14) + 'px',
          background: isSelected ? 'rgba(99,102,241,0.09)' : hovered ? 'rgba(10,10,10,0.04)' : 'transparent',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          textAlign: 'left' as const,
          fontFamily: FONT,
          outline: 'none',
          transition: 'background 120ms ease',
          minWidth: 0,
        }}
      >
        {isFolder ? <ChevronIcon open={open} /> : <div style={{ width: 10, flexShrink: 0 }} />}
        {isFolder ? <FolderIcon open={open} /> : <FileIcon ext={node.ext} />}
        <span style={{
          fontSize: '13px',
          fontWeight: isSelected ? 500 : 400,
          letterSpacing: '-0.01em',
          color: isSelected ? '#0a0a0a' : 'rgba(10,10,10,0.72)',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap' as const,
          transition: 'color 120ms ease',
        }}>
          {node.name}
        </span>
      </button>

      {isFolder && node.children && (
        <div style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 220ms cubic-bezier(0.4,0,0.2,1)',
        }}>
          <div style={{ overflow: 'hidden' }}>
            {node.children.map(child => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── TreeView ─────────────────────────────────────────────────────────────────

export function TreeView({
  nodes,
  defaultOpenIds = [],
  onSelect,
}: {
  nodes: FileNode[]
  defaultOpenIds?: string[]
  onSelect?: (node: FileNode) => void
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelect = (node: FileNode) => {
    setSelectedId(node.id)
    onSelect?.(node)
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '12px',
      padding: '6px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      userSelect: 'none' as const,
      fontFamily: FONT,
    }}>
      <div style={{
        padding: '7px 6px 6px',
        borderBottom: '1px solid rgba(10,10,10,0.06)',
        marginBottom: '4px',
      }}>
        <span style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: 'rgba(10,10,10,0.35)',
          fontFamily: FONT,
        }}>
          Explorer
        </span>
      </div>
      {nodes.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          selectedId={selectedId}
          onSelect={handleSelect}
          initOpen={defaultOpenIds.includes(node.id)}
        />
      ))}
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  const [selected, setSelected] = useState<FileNode | null>(null)

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
    }}>
      <div style={{ width: '230px' }}>
        <TreeView nodes={TREE} defaultOpenIds={['1', '2']} onSelect={setSelected} />
      </div>

      <div style={{
        width: '210px',
        minHeight: '180px',
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column' as const,
      }}>
        <div style={{
          padding: '7px 12px 6px',
          borderBottom: '1px solid rgba(10,10,10,0.06)',
        }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            color: 'rgba(10,10,10,0.35)',
            fontFamily: FONT,
          }}>Details</span>
        </div>

        {!selected ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
          }}>
            <span style={{
              fontSize: '12px',
              color: 'rgba(10,10,10,0.28)',
              fontFamily: FONT,
              letterSpacing: '-0.01em',
              textAlign: 'center' as const,
              lineHeight: '1.5',
            }}>
              Click any item<br />to see details
            </span>
          </div>
        ) : (
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {selected.type === 'folder'
                ? <FolderIcon open size={18} />
                : <FileIcon ext={selected.ext} size={16} />
              }
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0a0a0a',
                  letterSpacing: '-0.01em',
                  fontFamily: FONT,
                  lineHeight: '1.3',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap' as const,
                }}>
                  {selected.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(10,10,10,0.4)',
                  letterSpacing: '-0.01em',
                  fontFamily: FONT,
                  marginTop: '1px',
                }}>
                  {selected.type === 'folder' ? 'Folder' : extLabel(selected.ext)}
                </div>
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(10,10,10,0.06)' }} />

            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
              {(selected.type === 'folder' ? [
                ['Type', 'Directory', false],
                ['Contents', String(selected.children?.length ?? 0) + ' items', false],
              ] : [
                ['Extension', '.' + (selected.ext ?? ''), true],
                ['Language', extLabel(selected.ext), false],
                ['Encoding', 'UTF-8', false],
              ]).map(([label, value, isExt]) => (
                <div key={label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.4)', fontFamily: FONT, letterSpacing: '-0.01em', flexShrink: 0 }}>
                    {label}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: isExt ? extColor(selected.ext) : '#0a0a0a',
                    fontFamily: isExt ? 'ui-monospace, "SF Mono", Menlo, monospace' : FONT,
                    letterSpacing: '-0.01em',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap' as const,
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {selected.type === 'file' && (
              <div style={{
                height: '3px',
                borderRadius: '2px',
                background: extColor(selected.ext),
                opacity: 0.55,
              }} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

export type FileNode = {
  id: string
  name: string
  type: 'folder' | 'file'
  ext?: string
  children?: FileNode[]
}

const EXT_COLORS: Record<string, string> = {
  tsx: '#61dafb', jsx: '#61dafb',
  ts: '#3178c6', js: '#f7df1e',
  json: '#f59e0b', md: '#7c3aed',
  css: '#264de4', scss: '#cd6799',
  svg: '#ff7700', html: '#e34f26',
  ico: '#9ca3af',
}

const EXT_LABELS: Record<string, string> = {
  tsx: 'TypeScript JSX', jsx: 'JavaScript JSX',
  ts: 'TypeScript', js: 'JavaScript',
  json: 'JSON', md: 'Markdown',
  css: 'CSS', scss: 'SCSS',
  svg: 'SVG', html: 'HTML',
  ico: 'Icon file',
}

function extColor(ext?: string): string {
  return ext ? (EXT_COLORS[ext.toLowerCase()] ?? '#9ca3af') : '#9ca3af'
}

function extLabel(ext?: string): string {
  return ext ? (EXT_LABELS[ext.toLowerCase()] ?? ext.toUpperCase()) : 'File'
}

function FileIcon({ ext, size = 13 }: { ext?: string; size?: number }) {
  const c = extColor(ext)
  const h = Math.round(size * 14 / 13)
  return (
    <svg width={size} height={h} viewBox="0 0 13 14" fill="none" style={{ flexShrink: 0 }}>
      <rect x="0.5" y="0.5" width="12" height="13" rx="2.5" fill="white" stroke="rgba(10,10,10,0.1)" strokeWidth="0.8"/>
      <rect x="3" y="4.5" width="7" height="1" rx="0.5" fill={c} opacity="0.85"/>
      <rect x="3" y="6.5" width="5" height="1" rx="0.5" fill={c} opacity="0.55"/>
      <rect x="3" y="8.5" width="6" height="1" rx="0.5" fill={c} opacity="0.35"/>
    </svg>
  )
}

function FolderIcon({ open, size = 14 }: { open: boolean; size?: number }) {
  const h = Math.round(size * 12 / 14)
  return (
    <svg width={size} height={h} viewBox="0 0 14 12" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M0.5 2.5C0.5 1.948 0.948 1.5 1.5 1.5H5.2L6.5 2.8C6.69 2.97 6.86 3 7.07 3H12.5C13.052 3 13.5 3.448 13.5 4V10C13.5 10.552 13.052 11 12.5 11H1.5C0.948 11 0.5 10.552 0.5 10V2.5Z"
        fill={open ? '#fde68a' : '#fef3c7'}
        stroke="#d97706"
        strokeWidth="0.7"
      />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 10 10" fill="none"
      style={{
        flexShrink: 0,
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform 200ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <path d="M3.5 2L6.5 5L3.5 8" stroke="rgba(10,10,10,0.28)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function TreeNode({
  node, depth, selectedId, onSelect, initOpen = false,
}: {
  node: FileNode
  depth: number
  selectedId: string | null
  onSelect: (node: FileNode) => void
  initOpen?: boolean
}) {
  const [open, setOpen] = useState(initOpen)
  const [hovered, setHovered] = useState(false)
  const isFolder = node.type === 'folder'
  const isSelected = selectedId === node.id

  return (
    <div>
      <button
        onClick={() => { if (isFolder) setOpen(v => !v); onSelect(node) }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 6px 3px ' + (6 + depth * 14) + 'px',
          background: isSelected ? 'rgba(99,102,241,0.09)' : hovered ? 'rgba(10,10,10,0.04)' : 'transparent',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: FONT,
          outline: 'none',
          transition: 'background 120ms ease',
          minWidth: 0,
        }}
      >
        {isFolder ? <ChevronIcon open={open} /> : <div style={{ width: 10, flexShrink: 0 }} />}
        {isFolder ? <FolderIcon open={open} /> : <FileIcon ext={node.ext} />}
        <span style={{
          fontSize: '13px',
          fontWeight: isSelected ? 500 : 400,
          letterSpacing: '-0.01em',
          color: isSelected ? '#0a0a0a' : 'rgba(10,10,10,0.72)',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          transition: 'color 120ms ease',
        }}>
          {node.name}
        </span>
      </button>

      {isFolder && node.children && (
        <div style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 220ms cubic-bezier(0.4,0,0.2,1)',
        }}>
          <div style={{ overflow: 'hidden' }}>
            {node.children.map(child => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function TreeView({
  nodes,
  defaultOpenIds = [],
  onSelect,
}: {
  nodes: FileNode[]
  defaultOpenIds?: string[]
  onSelect?: (node: FileNode) => void
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelect = (node: FileNode) => {
    setSelectedId(node.id)
    onSelect?.(node)
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '12px',
      padding: '6px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      userSelect: 'none',
      fontFamily: FONT,
    }}>
      <div style={{
        padding: '7px 6px 6px',
        borderBottom: '1px solid rgba(10,10,10,0.06)',
        marginBottom: '4px',
      }}>
        <span style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.35)',
          fontFamily: FONT,
        }}>
          Explorer
        </span>
      </div>
      {nodes.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          selectedId={selectedId}
          onSelect={handleSelect}
          initOpen={defaultOpenIds.includes(node.id)}
        />
      ))}
    </div>
  )
}

// ── Usage ─────────────────────────────────────────────────────────────────────
//
// const tree: FileNode[] = [
//   { id: '1', name: 'src', type: 'folder', children: [
//     { id: '2', name: 'components', type: 'folder', children: [
//       { id: '3', name: 'Button.tsx', type: 'file', ext: 'tsx' },
//     ]},
//     { id: '4', name: 'index.ts', type: 'file', ext: 'ts' },
//   ]},
//   { id: '5', name: 'package.json', type: 'file', ext: 'json' },
// ]
//
// <TreeView nodes={tree} defaultOpenIds={['1']} onSelect={node => console.log(node)} />`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TreeViewPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: '20px',
      }}>
        <p style={{
          margin: 0,
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.35)',
          fontFamily: FONT,
        }}>
          Tree View — click folders to expand, files to inspect
        </p>
        <Demo />
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
