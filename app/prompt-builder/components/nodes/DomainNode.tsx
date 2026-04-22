'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function DomainNode(props: NodeProps & { data: NodeData }) {
  return <BaseNode {...props} color="#2563eb" icon="🌐" label="Domain" preview={props.data.domain || ''} />
}
