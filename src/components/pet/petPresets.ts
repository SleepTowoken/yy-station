import type { PetType } from '../../types/app'

export const defaultPetType: PetType = 'teddy'

export type PetPreset = {
  className: string
  particle: string
  sparkle: string
  glow: string
  shell: string
  main: string
  dark: string
  light: string
  blush: string
  eye: string
}

export const petPresets: Record<PetType, PetPreset> = {
  teddy: {
    className: 'pet-teddy',
    particle: '#f1d0ad',
    sparkle: '#ffd86b',
    glow: 'rgba(241, 208, 173, 0.52)',
    shell: 'rgba(255, 241, 184, 0.48)',
    main: '#b98255',
    dark: '#7a4a2a',
    light: '#f1d0ad',
    blush: '#f3a58b',
    eye: '#2e241e',
  },
  golden: {
    className: 'pet-golden',
    particle: '#fff1c7',
    sparkle: '#f2c46d',
    glow: 'rgba(242, 196, 109, 0.5)',
    shell: 'rgba(255, 225, 146, 0.44)',
    main: '#f2c46d',
    dark: '#c9872d',
    light: '#fff1c7',
    blush: '#f0a67e',
    eye: '#3f2b16',
  },
  ragdoll: {
    className: 'pet-ragdoll',
    particle: '#d8edff',
    sparkle: '#78bfff',
    glow: 'rgba(120, 191, 255, 0.42)',
    shell: 'rgba(247, 239, 226, 0.55)',
    main: '#f7efe2',
    dark: '#b38a72',
    light: '#fff8ed',
    blush: '#e7b7ae',
    eye: '#78bfff',
  },
}
