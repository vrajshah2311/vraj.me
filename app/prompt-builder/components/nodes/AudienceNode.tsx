'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function AudienceNode(props: NodeProps & { data: NodeData }) {
  const preview = [props.data.audience, props.data.ageRange].filter(Boolean).join(' · ')
  return <BaseNode {...props} color="#9333ea" icon="👥" label="Audience" preview={preview} />
}
