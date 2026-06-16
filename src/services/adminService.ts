import { requireSupabaseClient } from '../lib/supabase'
import type { AdminUnreadCounts, DashboardItem, ServiceResult, SupplyStatus } from '../types/app'

type TableName = 'mood_logs' | 'supply_requests' | 'rhythm_logs' | 'outfit_logs' | 'spark_logs' | 'guest_messages'
const OUTFIT_BUCKET = 'outfit-images'

export type MoodLog = {
  id: string
  mood: string | null
  heal_result: string | null
  note: string | null
  read: boolean
  created_at: string
}

export type SupplyRequest = {
  id: string
  drink_name: string | null
  drink_category: string | null
  sugar_preference: string | null
  ice_preference: string | null
  delivery_method: string | null
  address: string | null
  phone: string | null
  contact_note: string | null
  available_time: string | null
  user_note: string | null
  status: SupplyStatus
  order_platform: string | null
  pickup_code: string | null
  eta: string | null
  admin_note: string | null
  sensitive_cleared: boolean
  read: boolean
  created_at: string
  updated_at: string
}

export type RhythmLog = {
  id: string
  current_status: string | null
  soft_reminder: string | null
  rest_status: string | null
  note: string | null
  read: boolean
  created_at: string
}

export type OutfitLog = {
  id: string
  style: string | null
  mode: string | null
  generated_comment: string | null
  user_note: string | null
  image_path: string | null
  reviewed: boolean
  read: boolean
  created_at: string
}

export type SparkLog = {
  id: string
  fire_status: string | null
  action_type: string | null
  generated_text: string | null
  note: string | null
  read: boolean
  created_at: string
}

export type GuestMessage = {
  id: string
  content: string
  read: boolean
  created_at: string
}

function logAdminError(action: string, error: unknown) {
  console.error(`Admin service failed: ${action}`, error)
}

function notifyUnreadChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('admin-unread-changed'))
  }
}

async function selectRecent<T>(table: TableName, columns = '*') {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.from(table).select(columns).order('created_at', { ascending: false }).limit(80)
  if (error) {
    logAdminError(`select ${table}`, error)
    throw error
  }
  return (data ?? []) as T[]
}

export async function getMoodLogs() {
  return selectRecent<MoodLog>('mood_logs')
}

export async function getSupplyRequests() {
  return selectRecent<SupplyRequest>('supply_requests')
}

export async function getRhythmLogs() {
  return selectRecent<RhythmLog>('rhythm_logs')
}

export async function getOutfitLogs() {
  return selectRecent<OutfitLog>('outfit_logs')
}

export async function getSparkLogs() {
  return selectRecent<SparkLog>('spark_logs')
}

export async function getGuestMessages() {
  return selectRecent<GuestMessage>('guest_messages')
}

export async function getDashboardItems(): Promise<DashboardItem[]> {
  const [moods, supplies, rhythms, outfits, sparks, messages] = await Promise.all([
    getMoodLogs(),
    getSupplyRequests(),
    getRhythmLogs(),
    getOutfitLogs(),
    getSparkLogs(),
    getGuestMessages(),
  ])

  return [
    ...moods.map((item): DashboardItem => ({
      id: item.id,
      type: '今日回血',
      summary: [item.mood, item.heal_result, item.note].filter(Boolean).join('，') || '一条今日回血记录',
      read: item.read,
      created_at: item.created_at,
      href: '/admin/mood',
    })),
    ...supplies.map((item): DashboardItem => ({
      id: item.id,
      type: '能量补给',
      summary: [item.drink_name, item.sugar_preference, item.ice_preference, item.delivery_method].filter(Boolean).join('，') || '一条能量补给请求',
      read: item.read,
      created_at: item.created_at,
      href: '/admin/supply',
    })),
    ...rhythms.map((item): DashboardItem => ({
      id: item.id,
      type: '自己的节奏',
      summary: [item.current_status, item.rest_status, item.note].filter(Boolean).join('，') || '一条节奏记录',
      read: item.read,
      created_at: item.created_at,
      href: '/admin/rhythm',
    })),
    ...outfits.map((item): DashboardItem => ({
      id: item.id,
      type: '今日穿搭',
      summary: [item.style, item.mode, item.generated_comment].filter(Boolean).join('，') || '一条穿搭记录',
      read: item.read,
      created_at: item.created_at,
      href: '/admin/outfits',
    })),
    ...sparks.map((item): DashboardItem => ({
      id: item.id,
      type: '小火花儿',
      summary: [item.fire_status, item.action_type, item.generated_text].filter(Boolean).join('，') || '一条小火花儿记录',
      read: item.read,
      created_at: item.created_at,
      href: '/admin/sparks',
    })),
    ...messages.map((item): DashboardItem => ({
      id: item.id,
      type: '留言',
      summary: item.content,
      read: item.read,
      created_at: item.created_at,
      href: '/admin/dashboard',
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

async function countUnread(table: TableName) {
  const supabase = requireSupabaseClient()
  const { count, error } = await supabase.from(table).select('id', { count: 'exact', head: true }).eq('read', false)
  if (error) {
    logAdminError(`count unread ${table}`, error)
    throw error
  }
  return count ?? 0
}

export async function getAdminUnreadCounts(): Promise<AdminUnreadCounts> {
  const [mood, supply, rhythm, outfits, sparks, messages] = await Promise.all([
    countUnread('mood_logs'),
    countUnread('supply_requests'),
    countUnread('rhythm_logs'),
    countUnread('outfit_logs'),
    countUnread('spark_logs'),
    countUnread('guest_messages'),
  ])

  return {
    dashboard: mood + supply + rhythm + outfits + sparks + messages,
    mood,
    supply,
    rhythm,
    outfits,
    sparks,
  }
}

export async function markRead(table: TableName, id: string): Promise<ServiceResult> {
  const supabase = requireSupabaseClient()
  const { error } = await supabase.from(table).update({ read: true }).eq('id', id)
  if (error) {
    logAdminError(`mark read ${table}`, error)
    return { ok: false, error: error.message }
  }
  notifyUnreadChanged()
  return { ok: true }
}

export async function markOutfitReviewed(id: string): Promise<ServiceResult> {
  const supabase = requireSupabaseClient()
  const { error } = await supabase.from('outfit_logs').update({ read: true, reviewed: true }).eq('id', id)
  if (error) {
    logAdminError('mark outfit reviewed', error)
    return { ok: false, error: error.message }
  }
  notifyUnreadChanged()
  return { ok: true }
}

export async function createOutfitImageSignedUrl(path: string): Promise<ServiceResult & { url?: string }> {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.storage.from(OUTFIT_BUCKET).createSignedUrl(path, 60 * 10)

  if (error) {
    logAdminError('create outfit image signed url', error)
    return { ok: false, error: error.message }
  }

  return { ok: true, url: data.signedUrl }
}

export async function updateSupplyRequest(
  id: string,
  values: Partial<Pick<SupplyRequest, 'status' | 'order_platform' | 'pickup_code' | 'eta' | 'admin_note' | 'read'>>,
): Promise<ServiceResult> {
  const supabase = requireSupabaseClient()
  const { error } = await supabase.from('supply_requests').update(values).eq('id', id)
  if (error) {
    logAdminError('update supply request', error)
    return { ok: false, error: error.message }
  }
  if (values.read) {
    notifyUnreadChanged()
  }
  return { ok: true }
}

export async function clearSupplySensitiveFields(id: string): Promise<ServiceResult> {
  const supabase = requireSupabaseClient()
  const { error } = await supabase
    .from('supply_requests')
    .update({
      address: null,
      phone: null,
      contact_note: null,
      sensitive_cleared: true,
    })
    .eq('id', id)

  if (error) {
    logAdminError('clear supply sensitive fields', error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}
