import { getSupabaseClient } from '../lib/supabase'
import type { OutfitLogInput, ServiceResult } from '../types/app'

export async function createOutfitLog(input: OutfitLogInput): Promise<ServiceResult> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' }
  }

  const { error } = await supabase.from('outfit_logs').insert({
    style: input.style || null,
    mode: input.mode || null,
    generated_comment: input.generatedComment || null,
    user_note: input.userNote || null,
    image_path: input.imagePath || null,
  })

  if (error) {
    console.error('Failed to create outfit log:', error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}
