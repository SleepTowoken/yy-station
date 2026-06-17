import type { PetType } from '../../types/app'

const basePath = import.meta.env.BASE_URL

export const defaultPetType: PetType = 'teddy'

export type PetPreset = {
  label: string
  src: string
  className: string
  shadowColor: string
  fallbackMark: string
}

export const petPresets: Record<PetType, PetPreset> = {
  teddy: {
    label: '泰迪',
    src: `${basePath}pets/teddy.webp`,
    className: 'pet-image--teddy',
    shadowColor: 'rgba(153, 96, 48, 0.28)',
    fallbackMark: '爪',
  },
  golden: {
    label: '金毛',
    src: `${basePath}pets/golden.webp`,
    className: 'pet-image--golden',
    shadowColor: 'rgba(214, 150, 46, 0.25)',
    fallbackMark: '汪',
  },
  ragdoll: {
    label: '布偶',
    src: `${basePath}pets/ragdoll.webp`,
    className: 'pet-image--ragdoll',
    shadowColor: 'rgba(108, 91, 78, 0.22)',
    fallbackMark: '喵',
  },
}
