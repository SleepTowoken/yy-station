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
      '--pet-accent': preset.accent,
      '--pet-line': preset.line,
      '--pet-blush': preset.blush,
      '--pet-eye': preset.eye,
      '--pet-shell': preset.shell,
      '--pet-glow': preset.glow,
    } as CSSProperties

  return (
    <div className={`cartoon-pet ${preset.className} is-${mood} ${active ? 'is-active' : ''}`} style={style} key={type}>
      <div className="pet-orbit-shell" aria-hidden="true" />
      <div className="pet-confetti pet-confetti-one" />
      <div className="pet-confetti pet-confetti-two" />
      <div className="pet-confetti pet-confetti-three" />
      <div className="pet-tail" />
      <div className="pet-body">
        <div className="pet-chest" />
        <div className="pet-belly-fluff pet-belly-fluff-left" />
        <div className="pet-belly-fluff pet-belly-fluff-right" />
        <div className="pet-arm pet-arm-left" />
        <div className="pet-arm pet-arm-right" />
        <div className="pet-paw pet-paw-left" />
        <div className="pet-paw pet-paw-right" />
      </div>
      <div className="pet-head">
        <div className="pet-fur pet-fur-top" />
        <div className="pet-fur pet-fur-left" />
        <div className="pet-fur pet-fur-right" />
        <div className="pet-fur pet-fur-chin" />
        <div className="pet-ear pet-ear-left">
          <span />
        </div>
        <div className="pet-ear pet-ear-right">
          <span />
        </div>
        <div className="pet-face-mask" />
        <div className="pet-hood">
          <div className="pet-hood-ear pet-hood-ear-left" />
          <div className="pet-hood-ear pet-hood-ear-right" />
          <div className="pet-hood-hole pet-hood-hole-left" />
          <div className="pet-hood-hole pet-hood-hole-right" />
          <div className="pet-hood-seam pet-hood-seam-one" />
          <div className="pet-hood-seam pet-hood-seam-two" />
        </div>
        <div className="pet-eye pet-eye-left" />
        <div className="pet-eye pet-eye-right" />
        <div className="pet-blush pet-blush-left" />
        <div className="pet-blush pet-blush-right" />
        <div className="pet-muzzle">
          <div className="pet-nose" />
          <div className="pet-nostril pet-nostril-left" />
          <div className="pet-nostril pet-nostril-right" />
          <div className="pet-mouth" />
          <div className="pet-tongue" />
        </div>
        <div className="pet-highlight" />
      </div>
      <svg className="pet-smile" viewBox="0 0 80 42" aria-hidden="true">
        <path d="M22 18 C30 32, 50 32, 58 18" />
      </svg>
    </div>
  )
}
