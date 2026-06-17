import { useState, type CSSProperties } from 'react'
import type { PetMood, PetType } from '../../types/app'
import { petPresets } from './petPresets'

type PetImageProps = {
  mood: PetMood
  type: PetType
  label: string
}

export function PetImage({ mood, type, label }: PetImageProps) {
  const [failed, setFailed] = useState(false)
  const preset = petPresets[type] ?? petPresets.teddy
  const style = { '--pet-shadow': preset.shadowColor } as CSSProperties

  return (
    <div className={`pet-image-wrap ${preset.className} is-${mood} ${failed ? 'has-fallback' : ''}`} style={style}>
      <div className="pet-ground-shadow" aria-hidden="true" />
      {failed ? (
        <div className="pet-image-fallback" role="img" aria-label={`${label}图片暂未放入`}>
          <span>{preset.fallbackMark}</span>
        </div>
      ) : (
        <img className="pet-image" src={preset.src} alt={`${label}宠物贴图`} draggable={false} onError={() => setFailed(true)} />
      )}
    </div>
  )
}
