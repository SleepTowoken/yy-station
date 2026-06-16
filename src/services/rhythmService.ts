import { getSupabaseClient } from '../lib/supabase'
import type { RhythmLogInput, ServiceResult } from '../types/app'

export async function createRhythmLog(input: RhythmLogInput): Promise<ServiceResult> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' }
  }

  const { error } = await supabase.from('rhythm_logs').insert({
    current_status: input.currentStatus || null,
    soft_reminder: input.softReminder || null,
    rest_status: input.restStatus || null,
    note: input.note || null,
  })

  if (error) {
    console.error('Failed to create rhythm log:', error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}
