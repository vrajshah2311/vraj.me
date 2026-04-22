'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function FunnelSignalNode({ id, data, selected }: NodeProps & { data: NodeData }) {
  const preview = [data.stage, data.signal].filter(Boolean).join(' · ')
  return (
    <BaseNode
      id={id}
      selected={!!selected}
      color="#dc2626"
      icon="📡"
      label="Funnel Signal"
      preview={preview}
    />
  )
}
