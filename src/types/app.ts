export type TabId = 'heal' | 'rhythm' | 'outfit' | 'spark'

export type EnergySource = 'heal' | 'rhythm' | 'outfit' | 'spark'

export type PetType = 'golden' | 'teddy' | 'orangeCat' | 'ragdoll'

export type PetProfile = {
  type: PetType
  name: string
}

export type SupplyRequestDraft = {
  drinkName: string
  sugarPreference: string
  icePreference: string
  deliveryMethod: string
  address: string
  phone: string
  availableTime: string
  note: string
}

export type ServiceResult = {
  ok: boolean
  error?: string
}

export type MoodLogInput = {
  mood: string
  healResult: string
  note: string
}

export type RhythmLogInput = {
  currentStatus: string
  softReminder: string
  restStatus: string
  note: string
}

export type OutfitLogInput = {
  style: string
  mode: string
  generatedComment: string
  userNote: string
  imagePath?: string | null
}

export type SparkLogInput = {
  fireStatus: string
  actionType: string
  generatedText: string
  note: string
}

export type AdminRecord = {
  id: string
  read?: boolean
  created_at: string
}

export type SupplyStatus = 'pending' | 'arranged' | 'delivered' | 'cancelled'

export type DashboardItem = {
  id: string
  type: '今日回血' | '能量补给' | '自己的节奏' | '今日穿搭' | '小火花儿' | '留言'
  summary: string
  read: boolean
  created_at: string
  href: string
}

export type AdminUnreadCounts = {
  dashboard: number
  mood: number
  supply: number
  rhythm: number
  outfits: number
  sparks: number
}
