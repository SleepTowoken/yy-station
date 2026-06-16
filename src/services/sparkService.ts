import { getSupabaseClient } from '../lib/supabase'
import type { ServiceResult, SparkLogInput } from '../types/app'

export async function createSparkLog(input: SparkLogInput): Promise<ServiceResult> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' }
  }

  const { error } = await supabase.from('spark_logs').insert({
    fire_status: input.fireStatus || null,
    action_type: input.actionType || null,
    generated_text: input.generatedText || null,
    note: input.note || null,
  })

  if (error) {
    console.error('Failed to create spark log:', error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}
