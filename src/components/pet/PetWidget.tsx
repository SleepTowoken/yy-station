import type { PetMood, PetType } from '../../types/app'
import { PlushPet } from './PlushPet'
import './pet.css'

type PetWidgetProps = {
  active: boolean
  label: string
  mood: PetMood
  type: PetType
}

export function PetWidget({ active, label, mood, type }: PetWidgetProps) {
  return (
    <div className={`pet-widget ${active ? 'is-active' : ''} is-${mood}`} data-pet-type={type}>
      <PlushPet label={label} mood={mood} type={type} />
    </div>
  )
}
