export type AdminNoteType = 'note' | 'comfort' | 'reminder' | 'goodnight'

export type AdminNoteStatus = 'draft' | 'published' | 'archived'

export interface AdminNote {
  id: string
  title: string | null
  content: string
  note_type: AdminNoteType
  status: AdminNoteStatus
  pinned: boolean
  created_at: string
  updated_at: string
  published_at: string | null
  created_by: string | null
}

export interface AdminNoteInput {
  title?: string | null
  content: string
  note_type: AdminNoteType
  status: AdminNoteStatus
  pinned?: boolean
}
