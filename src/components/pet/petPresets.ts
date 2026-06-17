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
  accent: string
  line: string
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
    accent: '#d99b6b',
    line: '#8d5a35',
    blush: '#f3a58b',
    eye: '#2e241e',
  },
  golden: {
    className: 'pet-golden',
    particle: '#ffe1a0',
    sparkle: '#ffb84d',
    glow: 'rgba(242, 176, 74, 0.5)',
    shell: 'rgba(255, 218, 128, 0.44)',
    main: '#edb452',
    dark: '#b56f21',
    light: '#ffe4a8',
    accent: '#f3c46f',
    line: '#9a611d',
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
    accent: '#3f352f',
    line: '#9a7b66',
    blush: '#e7b7ae',
    eye: '#78bfff',
  },
}
