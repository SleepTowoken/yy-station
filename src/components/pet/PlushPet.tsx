import { useState, type CSSProperties, type SyntheticEvent } from 'react'
import type { PetMood, PetType } from '../../types/app'
import { petPresets } from './petPresets'

type PlushPetProps = {
  mood: PetMood
  type: PetType
  label: string
}

function hasTransparentEdges(image: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  const size = 32
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) {
    return false
  }

  context.drawImage(image, 0, 0, size, size)
  const samples = [
    [0, 0],
    [size - 1, 0],
    [0, size - 1],
    [size - 1, size - 1],
    [Math.floor(size / 2), 0],
    [Math.floor(size / 2), size - 1],
  ]

  let transparentSamples = 0
  for (const [x, y] of samples) {
    const alpha = context.getImageData(x, y, 1, 1).data[3]
    if (alpha < 16) {
      transparentSamples += 1
    }
  }

  return transparentSamples >= 4
}

export function PlushPet({ mood, type, label }: PlushPetProps) {
  const [imageState, setImageState] = useState<{
    src: string
    mode: 'image' | 'fallback'
  } | null>(null)
  const preset = petPresets[type] ?? petPresets.teddy
  const mode = imageState?.src === preset.src ? imageState.mode : 'checking'
  const style =
    {
      '--pet-shadow': preset.shadowColor,
      '--pet-main': preset.main,
      '--pet-dark': preset.dark,
      '--pet-light': preset.light,
      '--pet-accent': preset.accent,
      '--pet-blush': preset.blush,
      '--pet-eye': preset.eye,
    } as CSSProperties

  function handleLoad(event: SyntheticEvent<HTMLImageElement>) {
    setImageState({
      src: preset.src,
      mode: hasTransparentEdges(event.currentTarget) ? 'image' : 'fallback',
    })
  }

  return (
    <div className={`plush-pet ${preset.className} is-${mood} is-${mode}`} style={style} data-reference={preset.reference}>
      <div className="pet-ground-shadow" aria-hidden="true" />
      {mode !== 'fallback' ? (
        <img
          className="pet-image"
          src={preset.src}
          alt={`${label}宠物贴图`}
          draggable={false}
          onError={() => setImageState({ src: preset.src, mode: 'fallback' })}
          onLoad={handleLoad}
        />
      ) : null}
      {mode !== 'image' ? (
        <div className="plush-fallback" role="img" aria-label={`${label}毛绒宠物预览`}>
          <div className="plush-tail" />
          <div className="plush-body">
            <div className="plush-chest" />
            <div className="plush-arm plush-arm-left" />
            <div className="plush-arm plush-arm-right" />
            <div className="plush-paw plush-paw-left" />
            <div className="plush-paw plush-paw-right" />
          </div>
          <div className="plush-head">
            <div className="plush-ear plush-ear-left" />
            <div className="plush-ear plush-ear-right" />
            <div className="plush-hood">
              <span className="plush-hood-ear plush-hood-ear-left" />
              <span className="plush-hood-ear plush-hood-ear-right" />
              <span className="plush-hood-hole plush-hood-hole-left" />
              <span className="plush-hood-hole plush-hood-hole-right" />
            </div>
            <div className="plush-fur plush-fur-top" />
            <div className="plush-face" />
            <div className="plush-eye plush-eye-left" />
            <div className="plush-eye plush-eye-right" />
            <div className="plush-blush plush-blush-left" />
            <div className="plush-blush plush-blush-right" />
            <div className="plush-muzzle">
              <span className="plush-nose" />
              <span className="plush-mouth" />
              <span className="plush-tongue" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
