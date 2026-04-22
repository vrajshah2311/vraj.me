import { create } from 'zustand'
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react'

export type BlockType =
  | 'domain'
  | 'audience'
  | 'market'
  | 'persona'
  | 'funnelSignal'
  | 'volume'
  | 'topic'
  | 'output'

export interface NodeData extends Record<string, unknown> {
  label: string
  blockType: BlockType
  // Domain
  domain?: string
  // Audience
  audience?: string
  ageRange?: string
  // Market
  market?: string
  region?: string
  // Persona
  personaName?: string
  role?: string
  painPoints?: string
  // Funnel Signal
  stage?: string
  signal?: string
  // Volume
  searchVolume?: string
  unit?: string
  // Topic
  topic?: string
  keywords?: string
  // Output
  format?: string
  length?: string
  tone?: string
}

interface BuilderState {
  nodes: Node<NodeData>[]
  edges: Edge[]
  selectedNodeId: string | null
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  selectNode: (id: string | null) => void
  addNode: (blockType: BlockType, position: { x: number; y: number }) => void
  updateNodeData: (id: string, data: Partial<NodeData>) => void
  getConfig: () => object
}

const defaultDataForType: Record<BlockType, Partial<NodeData>> = {
  domain: { domain: '' },
  audience: { audience: '', ageRange: '' },
  market: { market: '', region: '' },
  persona: { personaName: '', role: '', painPoints: '' },
  funnelSignal: { stage: 'awareness', signal: '' },
  volume: { searchVolume: '', unit: 'monthly' },
  topic: { topic: '', keywords: '' },
  output: { format: 'paragraph', length: 'medium', tone: 'professional' },
}

const labelForType: Record<BlockType, string> = {
  domain: 'Domain',
  audience: 'Audience',
  market: 'Market',
  persona: 'Persona',
  funnelSignal: 'Funnel Signal',
  volume: 'Volume',
  topic: 'Topic',
  output: 'Output',
}

let nodeIdCounter = 1

export const useBuilderStore = create<BuilderState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) as Node<NodeData>[] })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (connection) =>
    set((state) => ({ edges: addEdge({ ...connection, animated: true }, state.edges) })),

  selectNode: (id) => set({ selectedNodeId: id }),

  addNode: (blockType, position) => {
    const id = `${blockType}-${nodeIdCounter++}`
    const newNode: Node<NodeData> = {
      id,
      type: blockType,
      position,
      data: {
        label: labelForType[blockType],
        blockType,
        ...defaultDataForType[blockType],
      },
    }
    set((state) => ({ nodes: [...state.nodes, newNode], selectedNodeId: id }))
  },

  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  getConfig: () => {
    const { nodes, edges } = get()
    return {
      nodes: nodes.map((n) => ({ id: n.id, type: n.type, data: n.data })),
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
    }
  },
}))
