'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function FunnelSignalNode(props: NodeProps & { data: NodeData }) {
  const preview = [props.data.stage, props.data.signal].filter(Boolean).join(' · ')
  return <BaseNode {...props} color="#dc2626" icon="📡" label="Funnel Signal" preview={preview} />
}
