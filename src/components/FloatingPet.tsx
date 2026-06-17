import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { petOptions } from '../constants/pets'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { PetProfile } from '../types/app'
import { PetPanel } from './PetPanel'

const PetCanvas = lazy(() => import('./pet/PetCanvas'))
const DRAG_THRESHOLD = 6

type FloatingPetProps = {
  beans: number
  spendBean: () => boolean
  onToast: (message: string) => void
}

type PetPosition = {
  x: number
  y: number
}

type DragState = {
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
  moved: boolean
}

function getPetSize() {
  if (typeof window === 'undefined') {
    return 188
  }

  return window.matchMedia('(max-width: 640px)').matches ? 132 : 188
}

function clampPosition(position: PetPosition) {
  if (typeof window === 'undefined') {
    return position
  }

  const size = getPetSize()
  const edge = 8
  const bottomReserve = 86
  const maxX = Math.max(edge, window.innerWidth - size - edge)
  const maxY = Math.max(edge, window.innerHeight - size - bottomReserve)

  return {
    x: Math.min(Math.max(position.x, edge), maxX),
    y: Math.min(Math.max(position.y, edge), maxY),
  }
}

export function FloatingPet({ beans, spendBean, onToast }: FloatingPetProps) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [happy, setHappy] = useState(false)
  const [position, setPosition] = useLocalStorage<PetPosition | null>('station_pet_float_position', null)
  const [profile] = useLocalStorage<PetProfile>('station_pet_profile', {
    type: 'golden',
    name: '小值班员',
  })
  const dragRef = useRef<DragState | null>(null)
  const happyTimerRef = useRef<number | null>(null)
  const pet = petOptions[profile.type]

  useEffect(() => {
    return () => {
      if (happyTimerRef.current) {
        window.clearTimeout(happyTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!position) {
      return undefined
    }

    function handleResize() {
      setPosition((current) => (current ? clampPosition(current) : current))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [position, setPosition])

  function triggerHappy() {
    setHappy(true)
    if (happyTimerRef.current) {
      window.clearTimeout(happyTimerRef.current)
    }
    happyTimerRef.current = window.setTimeout(() => setHappy(false), 1600)
  }

  function toggleOpen() {
    triggerHappy()
    setOpen((current) => !current)
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: rect.left,
      originY: rect.top,
      moved: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY
    const distance = Math.hypot(deltaX, deltaY)

    if (distance > DRAG_THRESHOLD) {
      drag.moved = true
      setPosition(clampPosition({ x: drag.originX + deltaX, y: drag.originY + deltaY }))
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) {
      return
    }

    event.currentTarget.releasePointerCapture(event.pointerId)
    dragRef.current = null

    if (!drag.moved) {
      toggleOpen()
    }
  }

  function handlePointerCancel(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) {
      return
    }

    dragRef.current = null
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    toggleOpen()
  }

  const positionStyle: CSSProperties = position
    ? {
        bottom: 'auto',
        left: position.x,
        right: 'auto',
        top: position.y,
      }
    : {}

  return (
    <>
      {open ? (
        <div className="pet-scrim" aria-hidden="true" onClick={() => setOpen(false)} />
      ) : null}
      {open ? <PetPanel beans={beans} spendBean={spendBean} onToast={onToast} onClose={() => setOpen(false)} /> : null}
      <button
        className={`pet-button ${open ? 'is-open' : ''} ${hovered ? 'is-hovered' : ''} ${happy ? 'is-happy' : ''}`}
        style={positionStyle}
        type="button"
        aria-label={open ? '收起回血小窝' : '打开回血小窝'}
        aria-expanded={open}
        title={`${profile.name} · 拖动它可以换位置`}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <Suspense fallback={<span className="pet-button-loading">{pet.icon}</span>}>
          <PetCanvas active={hovered || open} fallback={pet.icon} happy={happy} label={`${profile.name} · ${pet.label}`} />
        </Suspense>
      </button>
    </>
  )
}
