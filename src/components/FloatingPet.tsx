import { useState } from 'react'
import { petOptions } from '../constants/pets'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { PetProfile } from '../types/app'
import { PetPanel } from './PetPanel'

type FloatingPetProps = {
  beans: number
  spendBean: () => boolean
  onToast: (message: string) => void
}

export function FloatingPet({ beans, spendBean, onToast }: FloatingPetProps) {
  const [open, setOpen] = useState(false)
  const [profile] = useLocalStorage<PetProfile>('station_pet_profile', {
    type: 'golden',
    name: '小值班员',
  })

  return (
    <>
      {open ? (
        <div className="pet-scrim" aria-hidden="true" onClick={() => setOpen(false)} />
      ) : null}
      {open ? <PetPanel beans={beans} spendBean={spendBean} onToast={onToast} onClose={() => setOpen(false)} /> : null}
      <button
        className={`pet-button ${open ? 'is-open' : ''}`}
        type="button"
        aria-label={open ? '收起回血小窝' : '打开回血小窝'}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {petOptions[profile.type].icon}
      </button>
    </>
  )
}
