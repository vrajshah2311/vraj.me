'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function OutputNode(props: NodeProps & { data: NodeData }) {
  const preview = [props.data.format, props.data.tone].filter(Boolean).join(' · ')
  return <BaseNode {...props} color="#475569" icon="📝" label="Output" preview={preview} />
}
