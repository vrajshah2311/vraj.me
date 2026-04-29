'use client'

export type AgentState = null | 'listening' | 'talking'

interface OrbProps {
  size?: number
  colors?: [string, string]
  seed?: number
  agentState?: AgentState
}

export function Orb({ size = 11 }: OrbProps) {
  const id = `orb-${size}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="63 39 284 284"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <defs>
        <radialGradient id={`${id}-g0`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(232.499 154) rotate(99.2423) scale(171.223)">
          <stop stopColor="#31B5FF"/>
          <stop offset="1" stopColor="#FF87C8"/>
        </radialGradient>
        <radialGradient id={`${id}-g1`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(150.999 103) rotate(60.5646) scale(160.751)">
          <stop stopColor="#5200FF"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`${id}-g2`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(346.999 133) rotate(123.521) scale(94.1608 113.335)">
          <stop stopColor="white"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`${id}-g3`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(213.999 161) rotate(106.479) scale(162.161 155.919)">
          <stop offset="0.619792" stopColor="white" stopOpacity="0"/>
          <stop offset="0.796875" stopColor="white" stopOpacity="0"/>
          <stop offset="1" stopColor="white"/>
        </radialGradient>
        <radialGradient id={`${id}-g4`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(305.697 464.403) rotate(90) scale(155.316 170.863)">
          <stop stopColor="#FFE600"/>
          <stop offset="1" stopColor="#FFE600" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`${id}-g5`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(113.5 266.5) rotate(90) scale(111.5 114.28)">
          <stop stopColor="white"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`${id}-g6`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(286.499 80) rotate(90) scale(80 82.0598)">
          <stop stopColor="white"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <mask id={`${id}-mask`} style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="62" y="39" width="285" height="284">
          <circle cx="204.999" cy="181" r="142" fill="white"/>
        </mask>
      </defs>

      {/* Base blue→pink */}
      <circle cx="204.999" cy="181" r="142" fill={`url(#${id}-g0)`}/>
      {/* Purple overlay */}
      <circle cx="204.999" cy="181" r="142" fill={`url(#${id}-g1)`}/>
      {/* White right highlight */}
      <circle cx="204.999" cy="181" r="142" fill={`url(#${id}-g2)`}/>
      {/* Masked: edge glow + yellow accent */}
      <g mask={`url(#${id}-mask)`}>
        <circle cx="204.999" cy="181" r="142" fill={`url(#${id}-g3)`}/>
        <rect x="135.999" y="309.087" width="339.394" height="310.631" transform="rotate(-56.5217 135.999 309.087)" fill={`url(#${id}-g4)`}/>
      </g>
      {/* White corner glows */}
      <rect y="155" width="227" height="223" fill={`url(#${id}-g5)`}/>
      <rect x="204.999" width="163" height="160" fill={`url(#${id}-g6)`}/>
    </svg>
  )
}
