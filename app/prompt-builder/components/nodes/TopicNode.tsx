'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function TopicNode({ id, data, selected }: NodeProps & { data: NodeData }) {
  const preview = data.topic || ''
  return (
    <BaseNode
      id={id}
      selected={!!selected}
      color="#0891b2"
      icon="💡"
      label="Topic"
      preview={preview}
    />
  )
}
