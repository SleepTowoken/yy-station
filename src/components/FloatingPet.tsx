import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { petOptions } from '../constants/pets'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { PetMood, PetProfile, PetType } from '../types/app'
import { PetPanel } from './PetPanel'
import { PetWidget } from './pet/PetWidget'
import { defaultPetType } from './pet/petPresets'

const DRAG_THRESHOLD = 6
const PET_CARTOON_MIGRATION_KEY = 'station_pet_cartoon_migrated'

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
    return 150
  }

  return window.matchMedia('(max-width: 640px)').matches ? 104 : 150
}

function getPositionBounds() {
  const size = getPetSize()
  const edge = 8
  const bottomReserve = 86

  return {
    edge,
    maxX: Math.max(edge, window.innerWidth - size - edge),
    maxY: Math.max(edge, window.innerHeight - size - bottomReserve),
  }
}

function clampPosition(position: PetPosition) {
  if (typeof window === 'undefined') {
    return position
  }

  const { edge, maxX, maxY } = getPositionBounds()

  return {
    x: Math.min(Math.max(position.x, edge), maxX),
    y: Math.min(Math.max(position.y, edge), maxY),
  }
}

function resolvePetType(type: string): PetType {
  return type in petOptions ? (type as PetType) : defaultPetType
}

function getNextMood(mood: PetMood): PetMood {
  if (mood === 'normal') {
    return 'happy'
  }

  if (mood === 'happy') {
    return 'sleepy'
  }

  return 'normal'
}

export function FloatingPet({ beans, spendBean, onToast }: FloatingPetProps) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [mood, setMood] = useState<PetMood>('normal')
  const [position, setPosition] = useLocalStorage<PetPosition | null>('station_pet_float_position', null)
  const [profile, setProfile] = useLocalStorage<PetProfile>('station_pet_profile', {
    type: defaultPetType,
    name: '小值班员',
  })
  const dragRef = useRef<DragState | null>(null)
  const petType = resolvePetType(profile.type)
  const pet = petOptions[petType]

  useEffect(() => {
    const migrated = window.localStorage.getItem(PET_CARTOON_MIGRATION_KEY)
    if (migrated) {
      return
    }

    if (profile.type === 'golden' && profile.name === '小值班员') {
      setProfile({ ...profile, type: defaultPetType })
    }
    window.localStorage.setItem(PET_CARTOON_MIGRATION_KEY, 'true')
  }, [profile, setProfile])

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

  function toggleOpen() {
    setMood((current) => getNextMood(current))
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
      setDragging(true)
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

    if (drag.moved) {
      setPosition(
        clampPosition({
          x: drag.originX + event.clientX - drag.startX,
          y: drag.originY + event.clientY - drag.startY,
        }),
      )
      setDragging(false)
    } else {
      toggleOpen()
    }
  }

  function handlePointerCancel(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) {
      return
    }

    dragRef.current = null
    setDragging(false)
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
        className={`pet-button ${open ? 'is-open' : ''} ${hovered ? 'is-hovered' : ''} ${dragging ? 'is-dragging' : ''} is-${mood}`}
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
        <PetWidget active={hovered || open} label={`${profile.name} · ${pet.label}`} mood={mood} type={petType} />
      </button>
    </>
  )
}
