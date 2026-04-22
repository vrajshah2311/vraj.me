'use client'

import { useCallback, useRef } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useBuilderStore, type BlockType } from './store/useBuilderStore'
import Sidebar from './components/Sidebar'
import Inspector from './components/Inspector'
import DomainNode from './components/nodes/DomainNode'
import AudienceNode from './components/nodes/AudienceNode'
import MarketNode from './components/nodes/MarketNode'
import PersonaNode from './components/nodes/PersonaNode'
import FunnelSignalNode from './components/nodes/FunnelSignalNode'
import VolumeNode from './components/nodes/VolumeNode'
import TopicNode from './components/nodes/TopicNode'
import OutputNode from './components/nodes/OutputNode'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes: NodeTypes = {
  domain: DomainNode as any,
  audience: AudienceNode as any,
  market: MarketNode as any,
  persona: PersonaNode as any,
  funnelSignal: FunnelSignalNode as any,
  volume: VolumeNode as any,
  topic: TopicNode as any,
  output: OutputNode as any,
}

function FlowCanvas() {
  const { screenToFlowPosition } = useReactFlow()
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, selectNode, addNode, getConfig } =
    useBuilderStore()

  const dragTypeRef = useRef<BlockType | null>(null)

  const onDragStart = useCallback((e: React.DragEvent, blockType: BlockType) => {
    dragTypeRef.current = blockType
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const blockType = dragTypeRef.current
      if (!blockType) return
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      addNode(blockType, position)
      dragTypeRef.current = null
    },
    [addNode, screenToFlowPosition]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => selectNode(node.id),
    [selectNode]
  )

  const onPaneClick = useCallback(() => selectNode(null), [selectNode])

  const handleGenerate = useCallback(() => {
    const config = getConfig()
    console.log('Prompt Builder Config:', JSON.stringify(config, null, 2))
    alert('Config logged to console — open DevTools to inspect.')
  }, [getConfig])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 52, borderBottom: '1px solid rgba(0,0,0,0.08)', flexShrink: 0, background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="/" style={{ fontSize: 12, color: '#a3a3a3', textDecoration: 'none' }}>← Back</a>
          <span style={{ color: '#e5e5e5' }}>|</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#171717', letterSpacing: '-0.01em' }}>Prompt Builder</span>
        </div>
        <button
          onClick={handleGenerate}
          style={{ padding: '7px 16px', borderRadius: 8, background: '#171717', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          Generate ↗
        </button>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <Sidebar onDragStart={onDragStart} />

        <div style={{ flex: 1, position: 'relative', minWidth: 0 }} onDragOver={onDragOver} onDrop={onDrop}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{ animated: true, style: { stroke: '#d4d4d4', strokeWidth: 1.5 } }}
            style={{ width: '100%', height: '100%' }}
          >
            <Background color="#e5e5e5" gap={20} size={1} />
            <Controls style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, overflow: 'hidden' }} />
            <MiniMap
              nodeColor={(node) => {
                const colors: Record<string, string> = {
                  domain: '#2563eb', audience: '#9333ea', market: '#16a34a',
                  persona: '#ea580c', funnelSignal: '#dc2626', volume: '#d97706',
                  topic: '#0891b2', output: '#475569',
                }
                return colors[node.type as string] || '#d4d4d4'
              }}
              style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, overflow: 'hidden' }}
            />
          </ReactFlow>

          {nodes.length === 0 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', gap: 8 }}>
              <span style={{ fontSize: 32, opacity: 0.15 }}>⬡</span>
              <p style={{ fontSize: 13, color: '#c3c3c3', margin: 0 }}>Drag blocks from the left panel to get started</p>
            </div>
          )}
        </div>

        <Inspector />
      </div>
    </div>
  )
}

export default function PromptBuilderCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  )
}
