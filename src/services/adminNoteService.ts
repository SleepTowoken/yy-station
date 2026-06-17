import { requireSupabaseClient } from '../lib/supabase'
import type { AdminNote, AdminNoteInput, AdminNoteStatus } from '../types/adminNote'

const TABLE = 'admin_notes'

function normalizeTitle(title: string | null | undefined) {
  const nextTitle = title?.trim() ?? ''
  return nextTitle ? nextTitle : null
}

function normalizeInput(input: Partial<AdminNoteInput>) {
  return {
    ...input,
    title: input.title === undefined ? undefined : normalizeTitle(input.title),
    content: input.content === undefined ? undefined : input.content.trim(),
  }
}

function requireNote(data: AdminNote | null, action: string) {
  if (!data) {
    throw new Error(`Admin note ${action} returned no data.`)
  }
  return data
}

export async function listPublishedAdminNotes(): Promise<AdminNote[]> {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('status', 'published')
    .order('pinned', { ascending: false })
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Failed to list published admin notes:', error)
    throw error
  }

  return (data ?? []) as AdminNote[]
}

export async function listAdminNotes(status: AdminNoteStatus | 'all' = 'all'): Promise<AdminNote[]> {
  const supabase = requireSupabaseClient()
  let query = supabase.from(TABLE).select('*')

  if (status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query.order('updated_at', { ascending: false }).order('created_at', { ascending: false }).limit(120)

  if (error) {
    console.error('Failed to list admin notes:', error)
    throw error
  }

  return (data ?? []) as AdminNote[]
}

export async function createAdminNote(input: AdminNoteInput): Promise<AdminNote> {
  const supabase = requireSupabaseClient()
  const payload = normalizeInput(input)
  const { data, error } = await supabase.from(TABLE).insert(payload).select('*').single()

  if (error) {
    console.error('Failed to create admin note:', error)
    throw error
  }

  return requireNote(data as AdminNote | null, 'create')
}

export async function updateAdminNote(id: string, input: Partial<AdminNoteInput>): Promise<AdminNote> {
  const supabase = requireSupabaseClient()
  const payload = normalizeInput(input)
  const { data, error } = await supabase.from(TABLE).update(payload).eq('id', id).select('*').single()

  if (error) {
    console.error('Failed to update admin note:', error)
    throw error
  }

  return requireNote(data as AdminNote | null, 'update')
}

export async function publishAdminNote(id: string): Promise<AdminNote> {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    console.error('Failed to publish admin note:', error)
    throw error
  }

  return requireNote(data as AdminNote | null, 'publish')
}

export async function archiveAdminNote(id: string): Promise<AdminNote> {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.from(TABLE).update({ status: 'archived' }).eq('id', id).select('*').single()

  if (error) {
    console.error('Failed to archive admin note:', error)
    throw error
  }

  return requireNote(data as AdminNote | null, 'archive')
}

export async function toggleAdminNotePinned(id: string, pinned: boolean): Promise<AdminNote> {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.from(TABLE).update({ pinned }).eq('id', id).select('*').single()

  if (error) {
    console.error('Failed to toggle admin note pinned:', error)
    throw error
  }

  return requireNote(data as AdminNote | null, 'toggle pinned')
}
