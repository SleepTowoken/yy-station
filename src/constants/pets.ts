import type { PetType } from '../types/app'

export const petOptions: Record<PetType, { label: string; icon: string; lines: string[] }> = {
  teddy: {
    label: '小泰迪',
    icon: '🐻',
    lines: [
      '小泰迪蹦跶了一下，给你加了一点能量。',
      '它好像有点黏人，但不吵你。',
      '小泰迪表示：今天也可以慢慢来。',
    ],
  },
  golden: {
    label: '小金毛',
    icon: '🐶',
    lines: [
      '小金毛摇了摇尾巴，好像在说：今天辛苦啦。',
      '小金毛正在值班，负责给你一点阳光。',
      '它把小球叼过来了，想让你休息一下。',
    ],
  },
  ragdoll: {
    label: '没有猫',
    icon: '🐈',
    lines: [
      '没有猫抱着小爪爪，今天也不用急。',
      '它安静地待在旁边，陪你把心放慢一点。',
      '没有猫从布帽里看了看你：先照顾好自己。',
    ],
  },
}

export const petShopItems = [
  '小饼干',
  '蓝色小围巾',
  '黄色小毯子',
  '小球球',
  '小星星灯',
  '毛线球',
  '小咖啡杯',
  '小云朵靠垫',
]
