'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function VolumeNode(props: NodeProps & { data: NodeData }) {
  const preview = props.data.searchVolume ? `${props.data.searchVolume} / ${props.data.unit}` : ''
  return <BaseNode {...props} color="#d97706" icon="📊" label="Volume" preview={preview} />
}
