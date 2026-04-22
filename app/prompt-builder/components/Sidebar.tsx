'use client'

import { type BlockType } from '../store/useBuilderStore'

interface BlockDef {
  type: BlockType
  label: string
  icon: string
  color: string
  description: string
}

const blocks: BlockDef[] = [
  { type: 'domain', label: 'Domain', icon: '🌐', color: '#2563eb', description: 'Brand or website domain' },
  { type: 'audience', label: 'Audience', icon: '👥', color: '#9333ea', description: 'Target audience segment' },
  { type: 'market', label: 'Market', icon: '📍', color: '#16a34a', description: 'Geographic or vertical market' },
  { type: 'persona', label: 'Persona', icon: '🧑', color: '#ea580c', description: 'User persona definition' },
  { type: 'funnelSignal', label: 'Funnel Signal', icon: '📡', color: '#dc2626', description: 'Funnel stage signal' },
  { type: 'volume', label: 'Volume', icon: '📊', color: '#d97706', description: 'Search or traffic volume' },
  { type: 'topic', label: 'Topic', icon: '💡', color: '#0891b2', description: 'Prompt topic or theme' },
  { type: 'output', label: 'Output', icon: '📝', color: '#475569', description: 'Output format and tone' },
]

interface SidebarProps {
  onDragStart: (e: React.DragEvent, blockType: BlockType) => void
}

export default function Sidebar({ onDragStart }: SidebarProps) {
  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        background: '#fafafa',
        borderRight: '1px solid rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
          Blocks
        </p>
      </div>

      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {blocks.map((block) => (
          <div
            key={block.type}
            draggable
            onDragStart={(e) => onDragStart(e, block.type)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              borderRadius: 8,
              cursor: 'grab',
              userSelect: 'none',
              transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                background: `${block.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {block.icon}
            </span>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#171717', margin: 0, lineHeight: 1.3 }}>
                {block.label}
              </p>
              <p style={{ fontSize: 10, color: '#a3a3a3', margin: 0, lineHeight: 1.3, marginTop: 1 }}>
                {block.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', padding: '12px 14px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <p style={{ fontSize: 10, color: '#c3c3c3', margin: 0, lineHeight: 1.5 }}>
          Drag blocks onto the canvas to build your prompt structure.
        </p>
      </div>
    </aside>
  )
}
