'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function AudienceNode({ id, data, selected }: NodeProps & { data: NodeData }) {
  const preview = [data.audience, data.ageRange].filter(Boolean).join(' · ')
  return (
    <BaseNode
      id={id}
      selected={!!selected}
      color="#9333ea"
      icon="👥"
      label="Audience"
      preview={preview}
    />
  )
}
