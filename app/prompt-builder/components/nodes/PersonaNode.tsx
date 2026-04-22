'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function PersonaNode({ id, data, selected }: NodeProps & { data: NodeData }) {
  const preview = [data.personaName, data.role].filter(Boolean).join(' · ')
  return (
    <BaseNode
      id={id}
      selected={!!selected}
      color="#ea580c"
      icon="🧑"
      label="Persona"
      preview={preview}
    />
  )
}
