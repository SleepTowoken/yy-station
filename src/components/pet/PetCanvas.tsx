import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import { ParticlePet } from './ParticlePet'
import './pet.css'

type PetCanvasProps = {
  active: boolean
  happy: boolean
  label: string
  fallback: string
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

export default function PetCanvas({ active, happy, label, fallback }: PetCanvasProps) {
  const isCompact = useMediaQuery('(max-width: 640px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const particleCount = reducedMotion ? 96 : isCompact ? 220 : 520

  return (
    <div className="pet-canvas-frame" aria-hidden="true" data-label={label}>
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 42 }}
        className="pet-canvas"
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.72} />
          <pointLight color="#fff1b8" intensity={happy ? 2.2 : 1.35} position={[1.8, 2.2, 2.8]} />
          <pointLight color="#9ed8ff" intensity={active ? 1.8 : 1.1} position={[-2.2, -0.6, 2.2]} />
          <ParticlePet active={active} happy={happy} particleCount={particleCount} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
      <span className="pet-canvas-fallback">{fallback}</span>
    </div>
  )
}
