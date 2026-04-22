'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import { useBuilderStore, type NodeData } from '../../store/useBuilderStore'

interface BaseNodeProps extends NodeProps {
  data: NodeData
  color: string
  icon: string
  label: string
  preview: string
}

export default function BaseNode({ id, selected, color, icon, label, preview }: BaseNodeProps) {
  const selectNode = useBuilderStore((s) => s.selectNode)

  return (
    <div
      onClick={() => selectNode(id)}
      style={{
        width: 200,
        background: '#fff',
        border: selected ? `1.5px solid ${color}` : '1.5px solid rgba(0,0,0,0.08)',
        borderRadius: 10,
        boxShadow: selected
          ? `0 0 0 3px ${color}22, 0 4px 12px rgba(0,0,0,0.08)`
          : '0 2px 8px rgba(0,0,0,0.06)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, border-color 0.15s',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: color, border: '2px solid #fff', width: 10, height: 10 }}
      />

      <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: `${color}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
            }}
          >
            {icon}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            {label}
          </span>
        </div>
      </div>

      <div style={{ padding: '8px 12px 10px' }}>
        <p style={{ fontSize: 12, color: preview ? '#171717' : '#a3a3a3', margin: 0, lineHeight: 1.4, fontWeight: 500 }}>
          {preview || 'Not configured'}
        </p>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: color, border: '2px solid #fff', width: 10, height: 10 }}
      />
    </div>
  )
}
