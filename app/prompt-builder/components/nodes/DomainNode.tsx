'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function DomainNode({ id, data, selected }: NodeProps & { data: NodeData }) {
  return (
    <BaseNode
      id={id}
      selected={!!selected}
      color="#2563eb"
      icon="🌐"
      label="Domain"
      preview={data.domain || ''}
    />
  )
}
