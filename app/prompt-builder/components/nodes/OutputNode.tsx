'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function OutputNode({ id, data, selected }: NodeProps & { data: NodeData }) {
  const preview = [data.format, data.tone].filter(Boolean).join(' · ')
  return (
    <BaseNode
      id={id}
      selected={!!selected}
      color="#475569"
      icon="📝"
      label="Output"
      preview={preview}
    />
  )
}
