import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

let client: SupabaseClient | null = null

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

export function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    console.info('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    return null
  }

  if (!client) {
    client = createClient(supabaseUrl!, supabaseAnonKey!)
  }

  return client
}

export function requireSupabaseClient() {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase environment variables are not configured.')
  }
  return supabase
}
