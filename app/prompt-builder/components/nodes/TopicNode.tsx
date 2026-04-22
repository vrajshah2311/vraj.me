'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function TopicNode(props: NodeProps & { data: NodeData }) {
  return <BaseNode {...props} color="#0891b2" icon="💡" label="Topic" preview={props.data.topic || ''} />
}
