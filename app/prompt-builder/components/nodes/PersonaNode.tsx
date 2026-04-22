'use client'

import { type NodeProps } from '@xyflow/react'
import BaseNode from './BaseNode'
import { type NodeData } from '../../store/useBuilderStore'

export default function PersonaNode(props: NodeProps & { data: NodeData }) {
  const preview = [props.data.personaName, props.data.role].filter(Boolean).join(' · ')
  return <BaseNode {...props} color="#ea580c" icon="🧑" label="Persona" preview={preview} />
}
