import { getSupabaseClient } from '../lib/supabase'
import type { MoodLogInput, ServiceResult } from '../types/app'

export async function createMoodLog(input: MoodLogInput): Promise<ServiceResult> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' }
  }

  const { error } = await supabase.from('mood_logs').insert({
    mood: input.mood || null,
    heal_result: input.healResult || null,
    note: input.note || null,
  })

  if (error) {
    console.error('Failed to create mood log:', error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}
