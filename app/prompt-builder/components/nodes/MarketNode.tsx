'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function MarketNode({ id, data, selected }: NodeProps & { data: NodeData }) {
  const preview = [data.market, data.region].filter(Boolean).join(' · ')
  return (
    <BaseNode
      id={id}
      selected={!!selected}
      color="#16a34a"
      icon="📍"
      label="Market"
      preview={preview}
    />
  )
}
