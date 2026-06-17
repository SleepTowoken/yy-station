import { Float, Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { PetMood, PetType } from '../../types/app'
import { petPresets } from './petPresets'

type ParticlePetProps = {
  active: boolean
  mood: PetMood
  particleCount: number
  reducedMotion: boolean
  type: PetType
}

function createParticlePositions(count: number) {
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const radius = 0.88 + Math.random() * 1.35
    const angle = Math.random() * Math.PI * 2
    const height = (Math.random() - 0.5) * 1.9
    const orbitShape = 0.7 + Math.random() * 0.45

    positions[index * 3] = Math.cos(angle) * radius
    positions[index * 3 + 1] = height
    positions[index * 3 + 2] = Math.sin(angle) * radius * orbitShape
  }

  return positions
}

export function ParticlePet({ active, mood, particleCount, reducedMotion, type }: ParticlePetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const auraRef = useRef<THREE.Points>(null)
  const auraMaterialRef = useRef<THREE.PointsMaterial>(null)
  const positions = useMemo(() => createParticlePositions(particleCount), [particleCount])
  const preset = petPresets[type] ?? petPresets.teddy
  const happy = mood === 'happy'
  const sleepy = mood === 'sleepy'

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    const energy = sleepy ? 0.62 : happy ? 1.65 : active ? 1.25 : 1

    if (groupRef.current) {
      groupRef.current.rotation.y += reducedMotion ? 0 : delta * 0.38 * energy
      groupRef.current.position.y = reducedMotion ? 0 : Math.sin(time * 1.25) * 0.06
    }

    if (auraRef.current && !reducedMotion) {
      auraRef.current.rotation.y -= delta * 0.24 * energy
      auraRef.current.rotation.z = Math.sin(time * 0.35) * 0.08
    }

    if (auraMaterialRef.current) {
      auraMaterialRef.current.size = happy ? 0.056 : active ? 0.042 : sleepy ? 0.028 : 0.034
      auraMaterialRef.current.opacity = happy ? 0.92 : active ? 0.72 : sleepy ? 0.36 : 0.52
    }
  })

  return (
    <Float
      speed={reducedMotion ? 0 : sleepy ? 0.58 : 1.25}
      floatIntensity={reducedMotion ? 0 : sleepy ? 0.12 : 0.24}
      rotationIntensity={reducedMotion ? 0 : sleepy ? 0.08 : 0.18}
    >
      <group ref={groupRef}>
        <points ref={auraRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            ref={auraMaterialRef}
            color={happy ? preset.sparkle : preset.particle}
            depthWrite={false}
            size={0.034}
            transparent
            opacity={0.58}
            blending={THREE.AdditiveBlending}
          />
        </points>

        <Sparkles
          count={sleepy ? 20 : happy ? 74 : active ? 52 : 34}
          scale={happy ? 2.5 : 2.05}
          size={happy ? 4.8 : 3.2}
          speed={reducedMotion ? 0 : sleepy ? 0.16 : happy ? 0.62 : 0.34}
          color={happy ? preset.sparkle : preset.particle}
          opacity={sleepy ? 0.34 : happy ? 0.82 : 0.54}
        />
      </group>
    </Float>
  )
}
