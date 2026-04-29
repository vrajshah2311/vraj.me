'use client'

import { useState, useRef, useEffect } from 'react'

const font = 'Geist, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif'


const ALL_ICON_PAGES = [
  [
    ['IconBell',       'IconCoin1',          'IconArrowOutOfBox',       'IconChevronGrabberVertical','IconCreditCardAdd', 'IconUserGroup',    'IconSettingsSliderHor','IconEyeOpen'   ],
    ['IconHome',       'IconArrowLeft',      'IconArrowRight',          'IconBell2',                 'IconArrowUpRight',  'IconArrowLeftRight','IconBarsThree',       'IconPencil'    ],
    ['IconGlobe',      'IconDollar',         'IconUser',                'IconCircleQuestionmark',    'IconBlock',         'IconShieldCheck',  'IconTrending1',       'IconTag'        ],
    ['IconArrowsRepeat','IconUserAdd',        'IconArrowRotateClockwise','IconEmojiSmiley',           'IconTarget',        'IconTarget2',      'IconArrowBottomTop',  'IconArrowBoxLeft'],
    ['IconCalendar1',  'IconArrowInbox',     'IconTrashCan',            'IconPlusMedium',            'IconMinusMedium',   'IconStar',         'IconInsights',        'IconArrowOutOfBox'],
  ],
  [
    ['IconCode',       'IconBug',            'IconGlobe2',              'IconMagnifyingGlass',       'IconFilter1',       'IconLayersThree',  'IconColumns3',        'IconCrop'       ],
    ['IconCamera1',    'IconImages1',        'IconBrush',               'IconDraw',                  'IconNote1',         'IconListBullets',  'IconBookmark',        'IconFlag1'      ],
    ['IconHeadphones', 'IconMicrophone',     'IconBluetooth',           'IconAirdrop',               'IconCloud',         'IconCloudUpload',  'IconCloudDownload',   'IconCloudSync'  ],
    ['IconMap',        'IconMapPin',         'IconCompassRound',        'IconLocation',              'IconDirection1',    'IconDirection2',   'IconGlobe',           'IconGlobe2'     ],
    ['IconCalendar2',  'IconCalendarCheck',  'IconClock',               'IconClockAlert',            'IconCalendarDays',  'IconCalendarAdd4', 'IconCalendarEdit',    'IconCalendarRepeat'],
  ],
  [
    ['IconCar1',       'IconCar2',           'IconCar3',                'IconBike',                  'IconBus',           'IconAirplane',     'IconRocket',          'IconAnchor1'    ],
    ['IconCrown',      'IconDiamond',        'IconGift1',               'IconBalloon',               'IconFire1',         'IconBag',          'IconCocktail',        'IconCup'        ],
    ['IconChart1',     'IconChart2',         'IconChart3',              'IconChart4',                'IconAnalytics',     'IconChartWaterfall','IconBank',            'IconCryptoCoin' ],
    ['IconBatteryFull','IconBatteryMedium',  'IconBatteryLow',          'IconBatteryEmpty',          'IconWifiFull',      'IconBell',         'IconBellOff',         'IconBellCheck'  ],
    ['IconBookmark',   'IconBookmarkPlus',   'IconBookmarkCheck',       'IconFlag1',                 'IconFlag2',         'IconCrown',        'IconStar',            'IconDiamondShine'],
  ],
]

const ALL_ROWS = ALL_ICON_PAGES.flat(1)
const PERSONAS = ['Young professional', 'Family buyer', 'Fleet manager']

const ITEM_H = 30   // clickable row height
const GAP    = 1    // gap between rows
const SLOT   = ITEM_H + GAP  // 31px per row slot
const PAGE_H = SLOT * 5      // 155px per page

// top of row[idx] inside a section with 4px padding + 28px header + 1px gap
const rowTop = (idx: number) => 4 + 28 + GAP + idx * SLOT

export default function Canvas() {
  const [query,             setQuery]             = useState('')
  const [showPanel,         setShowPanel]         = useState(false)
  const [showIntentPanel,   setShowIntentPanel]   = useState(false)
  const [hoveredIntent,     setHoveredIntent]     = useState<string | null>(null)
  const [hoveredAddIntent,  setHoveredAddIntent]  = useState(false)
  const [showBrandPanel,    setShowBrandPanel]    = useState(false)
  const [hoveredBrand,      setHoveredBrand]      = useState<string | null>(null)
  const [view,              setView]              = useState<'personas' | 'icons'>('personas')
  const [hoveredPersona,    setHoveredPersona]    = useState<string | null>(null)
  const [hoveredLabel,      setHoveredLabel]      = useState<string | null>(null)
  const [hoveredAddPersona, setHoveredAddPersona] = useState(false)
  const [hoveredBack,       setHoveredBack]       = useState(false)
  const [hoveredIcon,       setHoveredIcon]       = useState<string | null>(null)
  const [shimmer,           setShimmer]           = useState<{ label: string; id: number } | null>(null)
  const [selectedPersona,   setSelectedPersona]   = useState('Young professional')
  const [personaIcons,      setPersonaIcons]      = useState<Record<string, string>>({
    'Young professional': 'IconUser',
    'Family buyer':       'IconUser',
    'Fleet manager':      'IconUser',
  })

  const rowsInnerRef   = useRef<HTMLDivElement>(null)
  const offsetRef      = useRef(0)
  const idleTimer      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const panelsRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (panelsRef.current && !panelsRef.current.contains(e.target as Node)) {
        setShowPanel(false); setShowIntentPanel(false); setShowBrandPanel(false); setView('personas'); setQuery('')
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const handleIconSelect = (icon: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPersonaIcons(prev => ({ ...prev, [selectedPersona]: icon }))
    setShowPanel(false); setView('personas'); setQuery('')
    setShimmer({ label: 'Persona', id: Date.now() })
    setTimeout(() => setShimmer(null), 1200)
  }

  const setScrollOffset = (offset: number, animate: boolean) => {
    const el = rowsInnerRef.current
    if (!el) return
    el.style.transition = animate ? 'transform 0.32s cubic-bezier(0.25,0,0,1)' : 'none'
    el.style.transform  = `translateY(-${offset}px)`
  }

  const openIconView = (persona: string) => {
    setSelectedPersona(persona); setQuery(''); setView('icons')
    offsetRef.current = 0
    requestAnimationFrame(() => setScrollOffset(0, false))
    setTimeout(() => searchInputRef.current?.focus(), 160)
  }

  const allFlat = ALL_ROWS.flat()
  const searchRows: string[][] = query
    ? allFlat
        .filter(ic => ic.replace('Icon', '').toLowerCase().includes(query.toLowerCase()))
        .reduce((acc: string[][], ic, i) => { if (i % 8 === 0) acc.push([]); acc[acc.length - 1].push(ic); return acc }, [])
    : []

  const handleIconGridWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (query) return
    const maxOffset = PAGE_H * (ALL_ICON_PAGES.length - 1)
    const next = Math.max(0, Math.min(offsetRef.current + e.deltaY, maxOffset))
    offsetRef.current = next
    setScrollOffset(next, false)
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => {
      const page   = Math.round(offsetRef.current / PAGE_H)
      const snapped = page * PAGE_H
      offsetRef.current = snapped
      setScrollOffset(snapped, true)
    }, 120)
  }

  // Shared highlight style
  const highlight = (visible: boolean, top: number, h = ITEM_H): React.CSSProperties => ({
    position: 'absolute', left: 4, right: 4, top, height: h,
    borderRadius: 10, background: 'rgba(23,23,23,0.04)',
    opacity: visible ? 1 : 0,
    transition: 'top 0.12s cubic-bezier(0.25,0,0,1), opacity 0.08s ease',
    pointerEvents: 'none',
  })

  const LABEL_ITEMS = ['Intent types', 'Persona', 'Brand signal']
  const activeLabel = hoveredLabel ?? (showIntentPanel ? 'Intent types' : showPanel ? 'Persona' : showBrandPanel ? 'Brand signal' : shimmer ? shimmer.label : null)
  const labelIdx    = activeLabel ? LABEL_ITEMS.indexOf(activeLabel) : 0
  const personaIdx  = hoveredPersona ? PERSONAS.indexOf(hoveredPersona) : 0

  return (
    <main style={{ minHeight: '100vh', background: '#FDFDFD', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <style>{`
        .icon-search::placeholder { color: rgba(23,23,23,0.40); }
        @keyframes stepIn { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
        @keyframes countPop {
          0%   { transform: scale(1); }
          45%  { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes shimmerBg {
          0%   { opacity: 0; }
          8%   { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes shimmerSweep {
          0%   { transform: translateX(-110%); }
          100% { transform: translateX(210%); }
        }
      `}</style>

      <div ref={panelsRef} onMouseLeave={() => { setShowPanel(false); setShowIntentPanel(false); setShowBrandPanel(false); setHoveredPersona(null) }}
        style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', transform: 'translateX(-112px)' }}>

        {/* ── Edit labels ── */}
        <div style={{
          width: 224, flexShrink: 0,
          background: '#FDFDFD',
          boxShadow: '0px 8px 10px -6px rgba(23,23,23,0.10), 0px 20px 25px -5px rgba(23,23,23,0.08), 0px 0px 0px 1px rgba(23,23,23,0.08)',
          borderRadius: 14,
        }}>
          <div style={{ position: 'relative', padding: 4, display: 'flex', flexDirection: 'column', gap: GAP }}>
            <div style={highlight(!!activeLabel, rowTop(labelIdx))} />
            <div style={{ height: 28, paddingLeft: 8, paddingRight: 8, display: 'flex', alignItems: 'center' }}>
              <span style={{ color: 'rgba(23,23,23,0.50)', fontSize: 13, fontFamily: font, fontWeight: 500, lineHeight: '18px' }}>Edit labels</span>
            </div>
            {[
              { icon: 'IconInsights', label: 'Intent types', count: 3 },
              { icon: 'IconUser',     label: 'Persona',      count: 3 },
              { icon: 'IconStar',     label: 'Brand signal', count: 2 },
            ].map(item => {
              const active  = (item.label === 'Persona' && (showPanel || shimmer?.label === 'Persona')) || (item.label === 'Intent types' && (showIntentPanel || shimmer?.label === 'Intent types')) || (item.label === 'Brand signal' && (showBrandPanel || shimmer?.label === 'Brand signal'))
              const hovered = hoveredLabel === item.label
              return (
                <div key={item.label}
                  onMouseEnter={() => {
                    setHoveredLabel(item.label)
                    if (item.label === 'Intent types')  { setShowIntentPanel(true);  setShowPanel(false);       setShowBrandPanel(false); setView('personas'); setQuery('') }
                    if (item.label === 'Persona')        { setShowPanel(true);        setShowIntentPanel(false);  setShowBrandPanel(false) }
                    if (item.label === 'Brand signal')   { setShowBrandPanel(true);   setShowIntentPanel(false);  setShowPanel(false);      setView('personas'); setQuery('') }
                  }}
                  onMouseLeave={() => setHoveredLabel(null)}
                  style={{ height: ITEM_H, paddingLeft: 8, paddingRight: 8, paddingTop: 5, paddingBottom: 5, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', position: 'relative', zIndex: 1, overflow: 'hidden' }}
                >
                  {shimmer?.label === item.label && (
                    <div key={shimmer.id} style={{ position: 'absolute', inset: 0, borderRadius: 10, pointerEvents: 'none', overflow: 'hidden', background: 'rgba(23,23,23,0.01)', animation: 'shimmerBg 1.2s ease both' }}>
                      <div style={{ position: 'absolute', top: 0, bottom: 0, width: '70%', background: 'linear-gradient(90deg, transparent 0%, transparent 10%, rgba(255,255,255,0.32) 40%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0.32) 60%, transparent 90%, transparent 100%)', animation: 'shimmerSweep 1.0s linear 0.05s both' }} />
                    </div>
                  )}
                  <img src={`/icons/${item.icon}.svg`} width={16} height={16} style={{ opacity: active || hovered ? 1 : 0.5, flexShrink: 0, transition: 'opacity 0.12s ease', animation: shimmer?.label === item.label ? 'countPop 0.55s cubic-bezier(0.37,0,0.63,1) 0.2s both' : undefined }} />
                  <div style={{ flex: '1 1 0' }}>
                    <span style={{ color: '#171717', fontSize: 14, fontFamily: font, fontWeight: 500, lineHeight: '20px' }}>{item.label}</span>
                  </div>
                  <div style={{ paddingLeft: 4, paddingRight: 4, paddingTop: 1, paddingBottom: 1, background: 'rgba(23,23,23,0.04)', borderRadius: 6, outline: '1px rgba(23,23,23,0.08) solid', outlineOffset: -1, display: 'flex', alignItems: 'center' }}>
                    <span key={shimmer?.label === item.label ? shimmer.id : undefined} style={{ color: active || hovered ? '#171717' : 'rgba(23,23,23,0.60)', fontSize: 11, fontFamily: font, fontWeight: 500, lineHeight: '16px', transition: 'color 0.12s ease', animation: shimmer?.label === item.label ? 'countPop 0.55s cubic-bezier(0.37,0,0.63,1) 0.55s both' : undefined }}>{item.count}</span>
                  </div>
                  <img src="/icons/IconChevronRightMedium.svg" width={16} height={16} style={{ opacity: active || hovered ? 1 : 0.5, flexShrink: 0, transition: 'opacity 0.12s ease' }} />
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Intent types panel ── */}
        {(() => {
          const INTENTS = ['Transactional', 'Commercial', 'Informational']
          const INTENT_ICONS = ['IconCreditCardAdd', 'IconShoppingBag1', 'IconCircleInfo']
          const intentIdx = hoveredIntent ? INTENTS.indexOf(hoveredIntent) : 0
          return (
            <div style={{
              position: 'absolute', left: 220, top: rowTop(0), width: 224,
              opacity: showIntentPanel ? 1 : 0,
              transform: showIntentPanel ? 'translateY(0)' : 'translateY(4px)',
              pointerEvents: showIntentPanel ? 'auto' : 'none',
              transition: 'opacity 0.15s ease, transform 0.15s ease',
              background: '#FDFDFD',
              boxShadow: '0px 8px 10px -6px rgba(23,23,23,0.10), 0px 20px 25px -5px rgba(23,23,23,0.08), 0px 0px 0px 1px rgba(23,23,23,0.08)',
              borderRadius: 14, overflow: 'hidden',
            }}>
              <div style={{ position: 'relative', padding: 4, borderBottom: '1px rgba(23,23,23,0.06) solid', display: 'flex', flexDirection: 'column', gap: GAP }}>
                <div style={highlight(!!hoveredIntent, rowTop(intentIdx))} />
                <div style={{ height: 28, paddingLeft: 8, paddingRight: 8, display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(23,23,23,0.50)', fontSize: 13, fontFamily: font, fontWeight: 500, lineHeight: '18px' }}>All intent types</span>
                </div>
                {INTENTS.map((intent, i) => (
                  <div key={intent}
                    onMouseEnter={() => setHoveredIntent(intent)}
                    onMouseLeave={() => setHoveredIntent(null)}
                    onClick={() => { setShimmer({ label: 'Intent types', id: Date.now() }); setShowIntentPanel(false); setTimeout(() => setShimmer(null), 1200) }}
                    style={{ height: ITEM_H, paddingLeft: 8, paddingRight: 8, paddingTop: 5, paddingBottom: 5, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', position: 'relative', zIndex: 1 }}
                  >
                    <img src={`/icons/${INTENT_ICONS[i]}.svg`} width={16} height={16} style={{ opacity: hoveredIntent === intent ? 1 : 0.5, flexShrink: 0, transition: 'opacity 0.12s ease' }} />
                    <div style={{ flex: '1 1 0', color: '#171717', fontSize: 14, fontFamily: font, fontWeight: 500, lineHeight: '20px' }}>{intent}</div>
                  </div>
                ))}
              </div>
              <div style={{ position: 'relative', padding: 4 }}>
                <div style={highlight(hoveredAddIntent, 4)} />
                <div onMouseEnter={() => setHoveredAddIntent(true)} onMouseLeave={() => setHoveredAddIntent(false)}
                  style={{ height: ITEM_H, paddingLeft: 8, paddingRight: 8, paddingTop: 5, paddingBottom: 5, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', position: 'relative', zIndex: 1 }}>
                  <img src="/icons/IconPlusLarge.svg" width={16} height={16} style={{ opacity: hoveredAddIntent ? 1 : 0.5, flexShrink: 0, transition: 'opacity 0.12s ease' }} />
                  <div style={{ flex: '1 1 0', color: '#171717', fontSize: 14, fontFamily: font, fontWeight: 500, lineHeight: '20px' }}>Add intent type</div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* ── Brand signal panel ── */}
        {(() => {
          const BRANDS = ['Branded', 'Non branded']
          const BRAND_ICONS = ['IconStar', 'IconBlock']
          const brandIdx = hoveredBrand ? BRANDS.indexOf(hoveredBrand) : 0
          return (
            <div style={{
              position: 'absolute', left: 220, top: rowTop(2), width: 224,
              opacity: showBrandPanel ? 1 : 0,
              transform: showBrandPanel ? 'translateY(0)' : 'translateY(4px)',
              pointerEvents: showBrandPanel ? 'auto' : 'none',
              transition: 'opacity 0.15s ease, transform 0.15s ease',
              background: '#FDFDFD',
              boxShadow: '0px 8px 10px -6px rgba(23,23,23,0.10), 0px 20px 25px -5px rgba(23,23,23,0.08), 0px 0px 0px 1px rgba(23,23,23,0.08)',
              borderRadius: 14, overflow: 'hidden',
            }}>
              <div style={{ position: 'relative', padding: 4, display: 'flex', flexDirection: 'column', gap: GAP }}>
                <div style={highlight(!!hoveredBrand, rowTop(brandIdx))} />
                <div style={{ height: 28, paddingLeft: 8, paddingRight: 8, display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(23,23,23,0.50)', fontSize: 13, fontFamily: font, fontWeight: 500, lineHeight: '18px' }}>Brand signal</span>
                </div>
                {BRANDS.map((brand, i) => (
                  <div key={brand}
                    onMouseEnter={() => setHoveredBrand(brand)}
                    onMouseLeave={() => setHoveredBrand(null)}
                    onClick={() => { setShimmer({ label: 'Brand signal', id: Date.now() }); setShowBrandPanel(false); setTimeout(() => setShimmer(null), 1200) }}
                    style={{ height: ITEM_H, paddingLeft: 8, paddingRight: 8, paddingTop: 5, paddingBottom: 5, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', position: 'relative', zIndex: 1 }}
                  >
                    <img src={`/icons/${BRAND_ICONS[i]}.svg`} width={16} height={16} style={{ opacity: hoveredBrand === brand ? 1 : 0.5, flexShrink: 0, transition: 'opacity 0.12s ease' }} />
                    <div style={{ flex: '1 1 0', color: '#171717', fontSize: 14, fontFamily: font, fontWeight: 500, lineHeight: '20px' }}>{brand}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        {/* ── Personas panel ── */}
        <div style={{
          position: 'absolute', left: 220, top: rowTop(1), width: 224,
          opacity: showPanel && view === 'personas' ? 1 : 0,
          transform: showPanel && view === 'personas' ? 'translateY(0)' : 'translateY(4px)',
          pointerEvents: showPanel && view === 'personas' ? 'auto' : 'none',
          transition: 'opacity 0.15s ease, transform 0.15s ease',
          background: '#FDFDFD',
          boxShadow: '0px 8px 10px -6px rgba(23,23,23,0.10), 0px 20px 25px -5px rgba(23,23,23,0.08), 0px 0px 0px 1px rgba(23,23,23,0.08)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          <div style={{ position: 'relative', padding: 4, borderBottom: '1px rgba(23,23,23,0.06) solid', display: 'flex', flexDirection: 'column', gap: GAP }}>
            <div style={highlight(!!hoveredPersona, rowTop(personaIdx))} />
            <div style={{ height: 28, paddingLeft: 8, paddingRight: 8, display: 'flex', alignItems: 'center' }}>
              <span style={{ color: 'rgba(23,23,23,0.50)', fontSize: 13, fontFamily: font, fontWeight: 500, lineHeight: '18px' }}>All personas</span>
            </div>
            {PERSONAS.map(persona => (
              <div key={persona}
                onMouseEnter={() => setHoveredPersona(persona)}
                onMouseLeave={() => setHoveredPersona(null)}
                style={{ height: ITEM_H, paddingLeft: 8, paddingRight: 8, paddingTop: 5, paddingBottom: 5, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', position: 'relative', zIndex: 1 }}
              >
                <img src={`/icons/${personaIcons[persona]}.svg`} width={16} height={16} style={{ opacity: 0.5, flexShrink: 0 }} />
                <div style={{ flex: '1 1 0', color: '#171717', fontSize: 14, fontFamily: font, fontWeight: 500, lineHeight: '20px' }}>{persona}</div>
                <div onClick={() => openIconView(persona)}
                  style={{ width: 24, height: 24, borderRadius: 8, background: '#FDFDFD', boxShadow: '0px 1px 2px -1px rgba(23,23,23,0.08), 0px 1px 3px rgba(23,23,23,0.08), 0px 0px 0px 1px rgba(23,23,23,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: hoveredPersona === persona ? 1 : 0, transition: 'opacity 0.12s ease', cursor: 'pointer' }}>
                  <img src="/icons/IconPencil.svg" width={12} height={12} style={{ display: 'block' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ position: 'relative', padding: 4 }}>
            <div style={highlight(hoveredAddPersona, 4)} />
            <div onMouseEnter={() => setHoveredAddPersona(true)} onMouseLeave={() => setHoveredAddPersona(false)}
              style={{ height: ITEM_H, paddingLeft: 8, paddingRight: 8, paddingTop: 5, paddingBottom: 5, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', position: 'relative', zIndex: 1 }}>
              <img src="/icons/IconPlusLarge.svg" width={16} height={16} style={{ opacity: hoveredAddPersona ? 1 : 0.5, flexShrink: 0, transition: 'opacity 0.12s ease' }} />
              <div style={{ flex: '1 1 0', color: '#171717', fontSize: 14, fontFamily: font, fontWeight: 500, lineHeight: '20px' }}>Add persona</div>
            </div>
          </div>
        </div>

        {/* ── Icon picker panel ── */}
        <div style={{
          position: 'absolute', left: 220, top: rowTop(1), width: 8 * ITEM_H + 7 * 2 + 8,
          opacity: showPanel && view === 'icons' ? 1 : 0,
          pointerEvents: showPanel && view === 'icons' ? 'auto' : 'none',
          transition: 'opacity 0.14s ease',
          boxShadow: '0px 8px 10px -6px rgba(23,23,23,0.10), 0px 20px 25px -5px rgba(23,23,23,0.08), 0px 0px 0px 1px rgba(23,23,23,0.08)',
          borderRadius: 14,
        }}>
          <div style={{
            clipPath: showPanel && view === 'icons' ? 'inset(0% 0% 0% 0% round 14px)' : 'inset(0% 0% 100% 0% round 14px)',
            transition: showPanel && view === 'icons' ? 'clip-path 0.28s cubic-bezier(0.32,0,0.08,1)' : 'none',
            background: '#FDFDFD', borderRadius: 14, overflow: 'hidden',
          }}>
            <div key={`${selectedPersona}-${view}`}>

              {/* Back header */}
              <div onClick={() => { setView('personas'); setQuery(''); setHoveredBack(false) }}
                onMouseEnter={() => setHoveredBack(true)} onMouseLeave={() => setHoveredBack(false)}
                style={{ height: 40, paddingLeft: 12, paddingRight: 12, borderBottom: '1px rgba(23,23,23,0.06) solid', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', animation: 'stepIn 0.18s ease 0ms both', background: hoveredBack ? 'rgba(23,23,23,0.04)' : 'transparent', transition: 'background 0.08s ease' }}>
                <img src="/icons/IconChevronLeftMedium.svg" width={16} height={16} style={{ flexShrink: 0 }} />
                <div style={{ flex: '1 1 0', color: '#171717', fontSize: 14, fontFamily: font, fontWeight: 500, lineHeight: '20px' }}>{selectedPersona}</div>
              </div>

              {/* Search */}
              <div style={{ padding: 4, animation: 'stepIn 0.18s ease 60ms both' }}>
                <div style={{ height: ITEM_H, paddingLeft: 8, paddingRight: 8, paddingTop: 5, paddingBottom: 5, background: 'rgba(23,23,23,0.04)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <img src="/icons/IconMagnifyingGlass.svg" width={16} height={16} style={{ opacity: 0.5, flexShrink: 0 }} />
                  <input ref={searchInputRef} className="icon-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search"
                    style={{ border: 'none', outline: 'none', background: 'transparent', padding: 0, margin: 0, width: '100%', color: '#171717', fontSize: 14, fontFamily: font, fontWeight: 500, lineHeight: '20px', caretColor: '#171717' }} />
                </div>
              </div>

              {/* Icon grid */}
              <div style={{ paddingLeft: 4, paddingRight: 4, paddingBottom: 4, display: 'flex', flexDirection: 'column', gap: GAP, animation: 'stepIn 0.18s ease 100ms both' }}>
                {!(query && searchRows.length === 0) && (
                  <div style={{ height: 28, paddingLeft: 8, paddingRight: 8, display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(23,23,23,0.50)', fontSize: 13, fontFamily: font, fontWeight: 500, lineHeight: '18px' }}>Choose an icon</span>
                  </div>
                )}

                {query && searchRows.length === 0 ? (
                  <div style={{ width: '100%', paddingTop: 8, paddingBottom: 16, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'flex', gap: 4 }}>
                    <svg width="116" height="48" viewBox="0 0 116 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.7">
                        <g clipPath="url(#clip0)">
                          <path d="M77.1956 16.5114C76.7587 15.1029 74.8769 14.8238 74.0465 16.0443L71.8698 19.2439C71.8535 19.2678 71.8231 19.2856 71.7863 19.285L67.8877 19.2168C66.4129 19.191 65.5424 20.8837 66.469 22.0569L68.873 25.1006C68.8926 25.1254 68.8964 25.1552 68.8877 25.1804L67.6236 28.8306C67.1339 30.2447 68.5174 31.5496 69.894 31.054L73.5565 29.7355C73.5896 29.7236 73.6275 29.7292 73.6556 29.7502L76.773 32.0744C77.9447 32.948 79.6502 32.1012 79.5958 30.6065L79.4554 26.7479C79.4545 26.7213 79.4668 26.6939 79.4928 26.6758L82.6835 24.4621C83.9135 23.6088 83.5763 21.7368 82.1581 21.3335L78.4088 20.2673C78.3734 20.2573 78.3495 20.2314 78.341 20.2038L77.1956 16.5114Z" fill="#171717" fillOpacity="0.16"/>
                        </g>
                        <path d="M41.0134 20.8001C40.8576 20.4666 40.5016 20.2744 40.1374 20.3273C39.7732 20.3802 39.4872 20.6657 39.4336 21.0296C39.1301 23.0929 38.5678 24.6145 37.6634 25.8279C36.759 27.0414 35.4616 28.0151 33.5711 28.8955C33.2376 29.0508 33.0458 29.4065 33.0991 29.7706C33.1525 30.1347 33.4384 30.421 33.8026 30.475C35.8669 30.7809 37.3898 31.3448 38.6048 32.2503C39.8197 33.1559 40.7953 34.454 41.6784 36.3449C41.8342 36.6785 42.1902 36.8707 42.5544 36.8178C42.9186 36.7649 43.2046 36.4794 43.2581 36.1154C43.5616 34.0521 44.1239 32.5306 45.0283 31.3171C45.9327 30.1036 47.2302 29.13 49.1206 28.2495C49.4541 28.0942 49.646 27.7385 49.5926 27.3744C49.5393 27.0103 49.2533 26.724 48.8891 26.6701C46.8248 26.3642 45.302 25.8002 44.087 24.8947C42.872 23.9892 41.8964 22.691 41.0134 20.8001Z" fill="#171717" fillOpacity="0.16"/>
                        <path d="M62.9726 38.8927C63.7602 38.6387 64.5827 38.5596 65.2116 38.9933C65.959 39.5089 66.4018 40.4115 66.3167 41.426C66.2015 42.7987 65.1726 43.6838 64.3936 44.1733C63.7903 44.5522 63.1398 44.8164 62.4599 45.0198C61.8237 44.7044 61.2266 44.335 60.6951 43.86C60.0085 43.2465 59.1414 42.2008 59.2563 40.8281C59.3413 39.8134 59.928 38.9981 60.7508 38.6155C61.4428 38.2938 62.2385 38.51 62.9726 38.8927Z" fill="#171717" fillOpacity="0.16"/>
                        <path d="M54.6125 36.6141C55.4839 37.5096 56.6694 38.108 58.0115 38.2218C58.3224 38.2482 58.6297 38.2455 58.9304 38.2196C58.318 38.8773 57.9256 39.7447 57.8447 40.7086C57.7054 42.3741 58.5295 43.6414 59.2606 44.4328L53.9743 43.9851C53.0636 43.9078 52.2344 43.4581 51.7136 42.7801C51.1803 42.0854 50.9721 41.1427 51.3654 40.2007C52.0079 38.6624 53.111 37.3575 54.6125 36.6141Z" fill="#171717" fillOpacity="0.16"/>
                        <path d="M58.7909 28.92C60.9691 29.1046 62.5871 31.0202 62.4045 33.1987C62.2219 35.3772 60.3079 36.9936 58.1297 36.8093C55.9516 36.6245 54.3335 34.709 54.5161 32.5306C54.6986 30.3522 56.6128 28.7358 58.7909 28.92Z" fill="#171717" fillOpacity="0.16"/>
                        <g clipPath="url(#clip1)">
                          <path fillRule="evenodd" clipRule="evenodd" d="M58.6964 4.26484C63.133 5.4887 65.7294 10.0752 64.4954 14.5091C63.2615 18.9429 58.6645 21.5452 54.2279 20.3213C49.7912 19.0974 47.1949 14.5109 48.4288 10.0771C49.6628 5.64319 54.2597 3.04097 58.6964 4.26484ZM59.9473 13.9661C57.468 14.1045 55.1248 13.8819 52.7175 13.2794C52.4516 13.213 52.1897 13.4142 52.219 13.6864C52.6907 18.0367 59.057 18.6272 60.3581 14.4602C60.4398 14.1983 60.2214 13.9508 59.9473 13.9661ZM53.17 8.82449C52.8232 8.69861 52.5437 9.07459 52.7357 9.38934L53.1406 10.0532C53.237 10.2111 53.2175 10.4137 53.0926 10.5506L52.5673 11.1267C52.3184 11.3996 52.5206 11.8209 52.8854 11.7623C53.7963 11.6159 54.7072 11.3082 55.454 10.8069C55.6468 10.6775 55.6729 10.4097 55.5087 10.2463C54.8719 9.61349 54.0363 9.13967 53.17 8.82449ZM60.6791 10.1437C60.9282 9.87078 60.7261 9.44869 60.3612 9.50729C59.4503 9.65368 58.5394 9.96143 57.7926 10.4627C57.5998 10.5921 57.5737 10.8599 57.7379 11.0233C58.3748 11.6561 59.2104 12.1299 60.0766 12.4451C60.4233 12.5709 60.7024 12.1958 60.5107 11.881L60.106 11.2165C60.0096 11.0586 60.0291 10.8559 60.1541 10.719L60.6791 10.1437Z" fill="#171717" fillOpacity="0.16"/>
                        </g>
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width="20" height="20" fill="white" transform="matrix(0.989177 0.146727 -0.147999 0.988988 66 13)"/>
                        </clipPath>
                        <clipPath id="clip1">
                          <rect width="20" height="20" fill="white" transform="matrix(0.963995 0.265922 -0.268111 0.963388 49.5029 0)"/>
                        </clipPath>
                      </defs>
                    </svg>
                    <span style={{ textAlign: 'center', color: 'rgba(23,23,23,0.32)', fontSize: 13, fontFamily: font, fontWeight: 500, lineHeight: '18px' }}>No results found</span>
                  </div>
                ) : query ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }} onMouseLeave={() => setHoveredIcon(null)}>
                    {searchRows.map((row, ri) => (
                      <div key={ri} style={{ height: ITEM_H, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        {row.map(icon => {
                          const isSel = personaIcons[selectedPersona] === icon
                          return (
                            <div key={icon} onClick={(e) => handleIconSelect(icon, e)}
                              onMouseEnter={() => setHoveredIcon(icon)}
                              onMouseLeave={() => setHoveredIcon(null)}
                              style={{ width: ITEM_H, height: ITEM_H, flexShrink: 0, background: isSel ? 'rgba(23,23,23,0.06)' : hoveredIcon === icon ? 'rgba(23,23,23,0.04)' : 'transparent', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.08s ease' }}>
                              <img src={`/icons/${icon}.svg`} width={16} height={16} style={{ display: 'block' }} />
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div onWheel={handleIconGridWheel} style={{ height: PAGE_H - 1, overflow: 'hidden' }}>
                    <div ref={rowsInnerRef} style={{ display: 'flex', flexDirection: 'column', gap: GAP }} onMouseLeave={() => setHoveredIcon(null)}>
                      {ALL_ROWS.map((row, ri) => (
                        <div key={ri} style={{ height: ITEM_H, flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                          {row.map(icon => {
                            const isSel = personaIcons[selectedPersona] === icon
                            return (
                              <div key={icon} onClick={(e) => handleIconSelect(icon, e)}
                                onMouseEnter={() => setHoveredIcon(icon)}
                                onMouseLeave={() => setHoveredIcon(null)}
                                style={{ width: ITEM_H, height: ITEM_H, flexShrink: 0, background: isSel ? 'rgba(23,23,23,0.06)' : hoveredIcon === icon ? 'rgba(23,23,23,0.04)' : 'transparent', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.08s ease' }}>
                                <img src={`/icons/${icon}.svg`} width={16} height={16} style={{ display: 'block' }} />
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


      </div>
    </main>
  )
}
