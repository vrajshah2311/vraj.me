'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function MarketNode(props: NodeProps & { data: NodeData }) {
  const preview = [props.data.market, props.data.region].filter(Boolean).join(' · ')
  return <BaseNode {...props} color="#16a34a" icon="📍" label="Market" preview={preview} />
}
