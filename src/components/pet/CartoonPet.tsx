import type { CSSProperties } from 'react'
import type { PetMood, PetType } from '../../types/app'
import { petPresets } from './petPresets'

type CartoonPetProps = {
  active: boolean
  mood: PetMood
  type: PetType
}

export function CartoonPet({ active, mood, type }: CartoonPetProps) {
  const preset = petPresets[type] ?? petPresets.teddy
  const style =
    {
      '--pet-main': preset.main,
      '--pet-dark': preset.dark,
      '--pet-light': preset.light,
      '--pet-blush': preset.blush,
      '--pet-eye': preset.eye,
      '--pet-shell': preset.shell,
      '--pet-glow': preset.glow,
    } as CSSProperties

  return (
    <div className={`cartoon-pet ${preset.className} is-${mood} ${active ? 'is-active' : ''}`} style={style}>
      <div className="pet-orbit-shell" aria-hidden="true" />
      <div className="pet-body">
        <div className="pet-chest" />
        <div className="pet-paw pet-paw-left" />
        <div className="pet-paw pet-paw-right" />
      </div>
      <div className="pet-head">
        <div className="pet-ear pet-ear-left">
          <span />
        </div>
        <div className="pet-ear pet-ear-right">
          <span />
        </div>
        <div className="pet-face-mask" />
        <div className="pet-eye pet-eye-left" />
        <div className="pet-eye pet-eye-right" />
        <div className="pet-blush pet-blush-left" />
        <div className="pet-blush pet-blush-right" />
        <div className="pet-muzzle">
          <div className="pet-nose" />
          <div className="pet-mouth" />
        </div>
        <div className="pet-highlight" />
      </div>
      <svg className="pet-smile" viewBox="0 0 80 42" aria-hidden="true">
        <path d="M22 18 C30 32, 50 32, 58 18" />
      </svg>
    </div>
  )
}
