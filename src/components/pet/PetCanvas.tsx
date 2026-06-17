import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState, type CSSProperties } from 'react'
import type { PetMood, PetType } from '../../types/app'
import { CartoonPet } from './CartoonPet'
import { ParticlePet } from './ParticlePet'
import { petPresets } from './petPresets'
import './pet.css'

type PetCanvasProps = {
  active: boolean
  mood: PetMood
  label: string
  fallback: string
  type: PetType
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia(query).matches))

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)

    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}

export default function PetCanvas({ active, mood, label, fallback, type }: PetCanvasProps) {
  const isCompact = useMediaQuery('(max-width: 640px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const particleCount = reducedMotion ? 96 : isCompact ? 220 : 520
  const preset = petPresets[type] ?? petPresets.teddy
  const isHappy = mood === 'happy'

  return (
    <div
      className={`pet-canvas-frame ${preset.className} is-${mood}`}
      aria-hidden="true"
      data-label={label}
      style={{ '--pet-glow': preset.glow, '--pet-shell': preset.shell } as CSSProperties}
    >
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 42 }}
        className="pet-canvas"
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.72} />
          <pointLight color={preset.sparkle} intensity={isHappy ? 2.2 : 1.35} position={[1.8, 2.2, 2.8]} />
          <pointLight color="#9ed8ff" intensity={active ? 1.8 : 1.1} position={[-2.2, -0.6, 2.2]} />
          <ParticlePet key={type} active={active} mood={mood} particleCount={particleCount} reducedMotion={reducedMotion} type={type} />
        </Suspense>
      </Canvas>
      <CartoonPet active={active} mood={mood} type={type} />
      <span className="pet-canvas-fallback">{fallback}</span>
    </div>
  )
}
