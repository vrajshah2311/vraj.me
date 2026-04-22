'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function VolumeNode({ id, data, selected }: NodeProps & { data: NodeData }) {
  const preview = data.searchVolume ? `${data.searchVolume} / ${data.unit}` : ''
  return (
    <BaseNode
      id={id}
      selected={!!selected}
      color="#d97706"
      icon="📊"
      label="Volume"
      preview={preview}
    />
  )
}
