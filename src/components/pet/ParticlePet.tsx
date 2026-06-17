import { Float, Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

type ParticlePetProps = {
  active: boolean
  happy: boolean
  particleCount: number
  reducedMotion: boolean
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

export function ParticlePet({ active, happy, particleCount, reducedMotion }: ParticlePetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const auraRef = useRef<THREE.Points>(null)
  const auraMaterialRef = useRef<THREE.PointsMaterial>(null)
  const positions = useMemo(() => createParticlePositions(particleCount), [particleCount])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    const energy = happy ? 1.65 : active ? 1.25 : 1

    if (groupRef.current) {
      groupRef.current.rotation.y += reducedMotion ? 0 : delta * 0.38 * energy
      groupRef.current.position.y = reducedMotion ? 0 : Math.sin(time * 1.25) * 0.06
    }

    if (bodyRef.current) {
      const breath = reducedMotion ? 1 : 1 + Math.sin(time * 2.4) * 0.035 * energy
      bodyRef.current.scale.setScalar(breath)
    }

    if (auraRef.current && !reducedMotion) {
      auraRef.current.rotation.y -= delta * 0.24 * energy
      auraRef.current.rotation.z = Math.sin(time * 0.35) * 0.08
    }

    if (auraMaterialRef.current) {
      auraMaterialRef.current.size = happy ? 0.055 : active ? 0.042 : 0.034
      auraMaterialRef.current.opacity = happy ? 0.9 : active ? 0.72 : 0.52
    }
  })

  return (
    <Float speed={reducedMotion ? 0 : 1.25} floatIntensity={reducedMotion ? 0 : 0.24} rotationIntensity={reducedMotion ? 0 : 0.18}>
      <group ref={groupRef}>
        <points ref={auraRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            ref={auraMaterialRef}
            color={happy ? '#fff1b8' : '#9ed8ff'}
            depthWrite={false}
            size={0.034}
            transparent
            opacity={0.58}
            blending={THREE.AdditiveBlending}
          />
        </points>

        <Sparkles
          count={happy ? 74 : active ? 52 : 34}
          scale={happy ? 2.5 : 2.05}
          size={happy ? 4.8 : 3.2}
          speed={reducedMotion ? 0 : happy ? 0.62 : 0.34}
          color={happy ? '#ffd86b' : '#ddf0ff'}
          opacity={happy ? 0.82 : 0.54}
        />

        <mesh ref={bodyRef}>
          <sphereGeometry args={[0.62, 48, 48]} />
          <meshStandardMaterial
            color="#9ed8ff"
            emissive={happy ? '#fff1b8' : '#6fc8ff'}
            emissiveIntensity={happy ? 1.15 : active ? 0.76 : 0.48}
            roughness={0.28}
            metalness={0.08}
            transparent
            opacity={0.68}
          />
        </mesh>

        <mesh scale={[0.42, 0.42, 0.42]} position={[0, 0.04, 0.08]}>
          <sphereGeometry args={[0.62, 32, 32]} />
          <meshStandardMaterial color="#fff1b8" emissive="#ffd86b" emissiveIntensity={happy ? 1.25 : 0.72} transparent opacity={0.74} />
        </mesh>

        <mesh position={[-0.24, 0.14, 0.56]} scale={[0.055, 0.08, 0.035]}>
          <sphereGeometry args={[1, 18, 18]} />
          <meshBasicMaterial color="#3f3a32" transparent opacity={0.76} />
        </mesh>
        <mesh position={[0.24, 0.14, 0.56]} scale={[0.055, 0.08, 0.035]}>
          <sphereGeometry args={[1, 18, 18]} />
          <meshBasicMaterial color="#3f3a32" transparent opacity={0.76} />
        </mesh>

        <mesh position={[0, -0.08, 0.59]} rotation={[0, 0, 0]} scale={[0.17, happy ? 0.045 : 0.025, 0.028]}>
          <sphereGeometry args={[1, 18, 18]} />
          <meshBasicMaterial color={happy ? '#ffd86b' : '#7a7468'} transparent opacity={0.72} />
        </mesh>

        <mesh position={[-0.44, 0.42, 0.04]} rotation={[0.28, 0, -0.42]} scale={[0.22, 0.34, 0.14]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color="#ddf0ff" emissive="#9ed8ff" emissiveIntensity={0.44} transparent opacity={0.56} />
        </mesh>
        <mesh position={[0.44, 0.42, 0.04]} rotation={[0.28, 0, 0.42]} scale={[0.22, 0.34, 0.14]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color="#ddf0ff" emissive="#9ed8ff" emissiveIntensity={0.44} transparent opacity={0.56} />
        </mesh>
      </group>
    </Float>
  )
}
