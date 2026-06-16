import { getSupabaseClient } from '../lib/supabase'
import type { ServiceResult, SupplyRequestDraft } from '../types/app'

export async function createSupplyRequest(input: SupplyRequestDraft): Promise<ServiceResult> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' }
  }

  const { error } = await supabase.from('supply_requests').insert({
    drink_name: input.drinkName || null,
    drink_category: '无糖美式专区',
    sugar_preference: input.sugarPreference || null,
    ice_preference: input.icePreference || null,
    delivery_method: input.deliveryMethod || null,
    address: input.address || null,
    phone: input.phone || null,
    available_time: input.availableTime || null,
    user_note: input.note || null,
  })

  if (error) {
    console.error('Failed to create supply request:', error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}
