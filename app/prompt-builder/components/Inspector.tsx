'use client'

import { useBuilderStore, type NodeData, type BlockType } from '../store/useBuilderStore'

const STAGE_OPTIONS = ['awareness', 'consideration', 'decision', 'retention']
const UNIT_OPTIONS = ['monthly', 'weekly', 'daily']
const FORMAT_OPTIONS = ['paragraph', 'bullet points', 'numbered list', 'table', 'JSON']
const LENGTH_OPTIONS = ['short', 'medium', 'long', 'comprehensive']
const TONE_OPTIONS = ['professional', 'casual', 'technical', 'conversational', 'authoritative']

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 10, fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '7px 10px',
  borderRadius: 7,
  border: '1px solid rgba(0,0,0,0.1)',
  fontSize: 12,
  fontWeight: 500,
  color: '#171717',
  background: '#fff',
  outline: 'none',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
  boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a3a3a3' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
  paddingRight: 28,
}

interface InspectorFieldsProps {
  blockType: BlockType
  data: NodeData
  onChange: (field: string, value: string) => void
}

function InspectorFields({ blockType, data, onChange }: InspectorFieldsProps) {
  switch (blockType) {
    case 'domain':
      return (
        <Field label="Domain">
          <input
            style={inputStyle}
            placeholder="e.g. example.com"
            value={(data.domain as string) || ''}
            onChange={(e) => onChange('domain', e.target.value)}
          />
        </Field>
      )

    case 'audience':
      return (
        <>
          <Field label="Audience">
            <input
              style={inputStyle}
              placeholder="e.g. B2B marketing managers"
              value={(data.audience as string) || ''}
              onChange={(e) => onChange('audience', e.target.value)}
            />
          </Field>
          <Field label="Age Range">
            <input
              style={inputStyle}
              placeholder="e.g. 25–45"
              value={(data.ageRange as string) || ''}
              onChange={(e) => onChange('ageRange', e.target.value)}
            />
          </Field>
        </>
      )

    case 'market':
      return (
        <>
          <Field label="Market">
            <input
              style={inputStyle}
              placeholder="e.g. SaaS / FinTech"
              value={(data.market as string) || ''}
              onChange={(e) => onChange('market', e.target.value)}
            />
          </Field>
          <Field label="Region">
            <input
              style={inputStyle}
              placeholder="e.g. North America"
              value={(data.region as string) || ''}
              onChange={(e) => onChange('region', e.target.value)}
            />
          </Field>
        </>
      )

    case 'persona':
      return (
        <>
          <Field label="Name">
            <input
              style={inputStyle}
              placeholder="e.g. Alex"
              value={(data.personaName as string) || ''}
              onChange={(e) => onChange('personaName', e.target.value)}
            />
          </Field>
          <Field label="Role">
            <input
              style={inputStyle}
              placeholder="e.g. CMO at a Series B startup"
              value={(data.role as string) || ''}
              onChange={(e) => onChange('role', e.target.value)}
            />
          </Field>
          <Field label="Pain Points">
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 64 }}
              placeholder="e.g. Needs ROI proof, limited budget"
              value={(data.painPoints as string) || ''}
              onChange={(e) => onChange('painPoints', e.target.value)}
            />
          </Field>
        </>
      )

    case 'funnelSignal':
      return (
        <>
          <Field label="Stage">
            <select
              style={selectStyle}
              value={(data.stage as string) || 'awareness'}
              onChange={(e) => onChange('stage', e.target.value)}
            >
              {STAGE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </Field>
          <Field label="Signal">
            <input
              style={inputStyle}
              placeholder="e.g. Visited pricing page"
              value={(data.signal as string) || ''}
              onChange={(e) => onChange('signal', e.target.value)}
            />
          </Field>
        </>
      )

    case 'volume':
      return (
        <>
          <Field label="Search Volume">
            <input
              style={inputStyle}
              placeholder="e.g. 10,000"
              value={(data.searchVolume as string) || ''}
              onChange={(e) => onChange('searchVolume', e.target.value)}
            />
          </Field>
          <Field label="Unit">
            <select
              style={selectStyle}
              value={(data.unit as string) || 'monthly'}
              onChange={(e) => onChange('unit', e.target.value)}
            >
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
              ))}
            </select>
          </Field>
        </>
      )

    case 'topic':
      return (
        <>
          <Field label="Topic">
            <input
              style={inputStyle}
              placeholder="e.g. AI in marketing"
              value={(data.topic as string) || ''}
              onChange={(e) => onChange('topic', e.target.value)}
            />
          </Field>
          <Field label="Keywords">
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 64 }}
              placeholder="e.g. automation, personalization, ROI"
              value={(data.keywords as string) || ''}
              onChange={(e) => onChange('keywords', e.target.value)}
            />
          </Field>
        </>
      )

    case 'output':
      return (
        <>
          <Field label="Format">
            <select
              style={selectStyle}
              value={(data.format as string) || 'paragraph'}
              onChange={(e) => onChange('format', e.target.value)}
            >
              {FORMAT_OPTIONS.map((f) => (
                <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
              ))}
            </select>
          </Field>
          <Field label="Length">
            <select
              style={selectStyle}
              value={(data.length as string) || 'medium'}
              onChange={(e) => onChange('length', e.target.value)}
            >
              {LENGTH_OPTIONS.map((l) => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </Field>
          <Field label="Tone">
            <select
              style={selectStyle}
              value={(data.tone as string) || 'professional'}
              onChange={(e) => onChange('tone', e.target.value)}
            >
              {TONE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </Field>
        </>
      )

    default:
      return null
  }
}

const colorForType: Record<BlockType, string> = {
  domain: '#2563eb',
  audience: '#9333ea',
  market: '#16a34a',
  persona: '#ea580c',
  funnelSignal: '#dc2626',
  volume: '#d97706',
  topic: '#0891b2',
  output: '#475569',
}

const iconForType: Record<BlockType, string> = {
  domain: '🌐',
  audience: '👥',
  market: '📍',
  persona: '🧑',
  funnelSignal: '📡',
  volume: '📊',
  topic: '💡',
  output: '📝',
}

export default function Inspector() {
  const { nodes, selectedNodeId, updateNodeData } = useBuilderStore()
  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  return (
    <aside
      style={{
        width: 260,
        flexShrink: 0,
        background: '#fafafa',
        borderLeft: '1px solid rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: '#a3a3a3', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
          Inspector
        </p>
      </div>

      {!selectedNode ? (
        <div style={{ padding: '20px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 24 }}>
          <span style={{ fontSize: 24, opacity: 0.3 }}>🔍</span>
          <p style={{ fontSize: 12, color: '#c3c3c3', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
            Select a block on the canvas to edit its properties
          </p>
        </div>
      ) : (
        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: `${colorForType[selectedNode.data.blockType]}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
              }}
            >
              {iconForType[selectedNode.data.blockType]}
            </span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#171717', margin: 0 }}>
                {selectedNode.data.label as string}
              </p>
              <p style={{ fontSize: 10, color: '#a3a3a3', margin: 0 }}>
                {selectedNode.id}
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <InspectorFields
              blockType={selectedNode.data.blockType}
              data={selectedNode.data}
              onChange={(field, value) => updateNodeData(selectedNode.id, { [field]: value })}
            />
          </div>
        </div>
      )}
    </aside>
  )
}
