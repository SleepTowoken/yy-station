import type { PetType } from '../../types/app'

const basePath = import.meta.env.BASE_URL

export const defaultPetType: PetType = 'teddy'

export type PetPreset = {
  label: string
  src: string
  reference: string
  className: string
  shadowColor: string
  main: string
  dark: string
  light: string
  accent: string
  blush: string
  eye: string
}

export const petPresets: Record<PetType, PetPreset> = {
  teddy: {
    label: '泰迪',
    src: `${basePath}pets/teddy.webp`,
    reference: `${basePath}pets/teddy.webp`,
    className: 'plush-pet--teddy',
    shadowColor: 'rgba(153, 96, 48, 0.28)',
    main: '#b8794b',
    dark: '#71431f',
    light: '#f2c797',
    accent: '#d99562',
    blush: '#f4a1a7',
    eye: '#14110f',
  },
  golden: {
    label: '金毛',
    src: `${basePath}pets/golden.webp`,
    reference: `${basePath}pets/golden.webp`,
    className: 'plush-pet--golden',
    shadowColor: 'rgba(214, 150, 46, 0.25)',
    main: '#efc46b',
    dark: '#b97724',
    light: '#ffe8aa',
    accent: '#d89a3f',
    blush: '#efa17d',
    eye: '#201916',
  },
  ragdoll: {
    label: '布偶',
    src: `${basePath}pets/ragdoll.webp`,
    reference: `${basePath}pets/ragdoll.webp`,
    className: 'plush-pet--ragdoll',
    shadowColor: 'rgba(108, 91, 78, 0.22)',
    main: '#f7efe2',
    dark: '#2f2926',
    light: '#fff8ea',
    accent: '#d8ccb2',
    blush: '#e7b7ae',
    eye: '#6fbdf5',
  },
}
