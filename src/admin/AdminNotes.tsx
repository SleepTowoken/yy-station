import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { useToast } from '../hooks/useToast'
import {
  archiveAdminNote,
  createAdminNote,
  listAdminNotes,
  publishAdminNote,
  toggleAdminNotePinned,
  updateAdminNote,
} from '../services/adminNoteService'
import type { AdminNote, AdminNoteInput, AdminNoteStatus, AdminNoteType } from '../types/adminNote'
import { emptyText, formatDateTime } from './adminFormat'

type FilterValue = AdminNoteStatus | 'all'

type NoteDraft = {
  id: string | null
  title: string
  content: string
  note_type: AdminNoteType
  pinned: boolean
}

const emptyDraft: NoteDraft = {
  id: null,
  title: '',
  content: '',
  note_type: 'note',
  pinned: false,
}

const noteTypeOptions: Array<{ value: AdminNoteType; label: string }> = [
  { value: 'note', label: '小纸条' },
  { value: 'comfort', label: '鼓励' },
  { value: 'reminder', label: '温柔提醒' },
  { value: 'goodnight', label: '晚安' },
]

const statusFilters: Array<{ value: FilterValue; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'draft', label: '草稿' },
  { value: 'published', label: '已发布' },
  { value: 'archived', label: '已下架' },
]

const statusLabels: Record<AdminNoteStatus, string> = {
  draft: '草稿',
  published: '已发布',
  archived: '已下架',
}

const noteTypeLabels: Record<AdminNoteType, string> = {
  note: '小纸条',
  comfort: '鼓励',
  reminder: '温柔提醒',
  goodnight: '晚安',
}

function buildDraft(note: AdminNote): NoteDraft {
  return {
    id: note.id,
    title: note.title ?? '',
    content: note.content,
    note_type: note.note_type,
    pinned: note.pinned,
  }
}

function buildInput(draft: NoteDraft, status: AdminNoteStatus): AdminNoteInput {
  return {
    title: draft.title,
    content: draft.content,
    note_type: draft.note_type,
    pinned: draft.pinned,
    status,
  }
}

export function AdminNotes() {
  const { showToast } = useToast()
  const [items, setItems] = useState<AdminNote[]>([])
  const [filter, setFilter] = useState<FilterValue>('all')
  const [draft, setDraft] = useState<NoteDraft>(emptyDraft)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [actionId, setActionId] = useState('')

  const editingNote = useMemo(() => items.find((item) => item.id === draft.id) ?? null, [draft.id, items])

  const load = useCallback(async (nextFilter = filter) => {
    setError('')
    try {
      const nextItems = await listAdminNotes(nextFilter)
      setItems(nextItems)
    } catch {
      setError('补给箱读取失败。')
    }
  }, [filter])

  useEffect(() => {
    void Promise.resolve().then(() => load())
  }, [load])

  function resetDraft() {
    setDraft(emptyDraft)
  }

  async function saveDraft(status: AdminNoteStatus) {
    if (!draft.content.trim()) {
      showToast('先写一点内容再保存。')
      return
    }

    setSaving(true)
    setError('')
    try {
      if (draft.id) {
        const shouldPublish = status === 'published' && editingNote?.status !== 'published'
        await updateAdminNote(draft.id, buildInput(draft, shouldPublish ? editingNote?.status ?? 'draft' : status))
        if (shouldPublish) {
          await publishAdminNote(draft.id)
        }
      } else {
        const shouldPublish = status === 'published'
        const created = await createAdminNote(buildInput(draft, shouldPublish ? 'draft' : status))
        if (shouldPublish) {
          await publishAdminNote(created.id)
        }
        setDraft(buildDraft(created))
      }
      await load()
      showToast(status === 'published' ? '已经发布到补给箱。' : '已经保存。')
      if (status === 'published') {
        resetDraft()
      }
    } catch {
      showToast('操作失败，稍后再试一下。')
    } finally {
      setSaving(false)
    }
  }

  async function runItemAction(id: string, action: () => Promise<AdminNote>, successMessage: string) {
    setActionId(id)
    setError('')
    try {
      await action()
      await load()
      showToast(successMessage)
    } catch {
      showToast('操作失败，稍后再试一下。')
    } finally {
      setActionId('')
    }
  }

  return (
    <section className="admin-panel admin-notes-page">
      <div className="admin-notes-head">
        <div>
          <h2 className="section-title">垚总补给箱</h2>
          <p className="section-copy">在这里写给她看的小纸条。前台只会展示已发布内容。</p>
        </div>
        <Button variant="secondary" onClick={resetDraft}>
          新建小纸条
        </Button>
      </div>

      {error ? <p className="hint">{error}</p> : null}

      <form className="admin-note-form" onSubmit={(event) => event.preventDefault()}>
        <label>
          标题
          <input
            className="field"
            value={draft.title}
            maxLength={120}
            placeholder="比如：今天的小纸条"
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          />
        </label>
        <label>
          正文
          <textarea
            className="field"
            value={draft.content}
            maxLength={5000}
            placeholder="写一点她想看的时候可以看到的话。"
            onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))}
          />
        </label>
        <div className="admin-form-grid">
          <label>
            类型
            <select
              className="field"
              value={draft.note_type}
              onChange={(event) => setDraft((current) => ({ ...current, note_type: event.target.value as AdminNoteType }))}
            >
              {noteTypeOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-note-check">
            <input
              checked={draft.pinned}
              type="checkbox"
              onChange={(event) => setDraft((current) => ({ ...current, pinned: event.target.checked }))}
            />
            置顶显示
          </label>
        </div>
        {editingNote ? <p className="hint">正在编辑：{emptyText(editingNote.title)} · {statusLabels[editingNote.status]}</p> : null}
        <div className="button-row">
          <Button disabled={saving} variant="secondary" onClick={() => void saveDraft('draft')}>
            {saving ? '保存中...' : '保存草稿'}
          </Button>
          <Button disabled={saving} onClick={() => void saveDraft('published')}>
            {saving ? '发布中...' : editingNote?.status === 'published' ? '保存修改' : '发布'}
          </Button>
          {draft.id ? (
            <Button disabled={saving} variant="ghost" onClick={resetDraft}>
              取消
            </Button>
          ) : null}
        </div>
      </form>

      <div className="admin-notes-toolbar" aria-label="补给箱筛选">
        {statusFilters.map((option) => (
          <button className={`pill ${filter === option.value ? 'is-active' : ''}`} key={option.value} type="button" onClick={() => setFilter(option.value)}>
            {option.label}
          </button>
        ))}
      </div>

      <div className="admin-card-list">
        {items.map((item) => (
          <article className="admin-record admin-note-card" key={item.id}>
            <div className="admin-record-head">
              <div>
                <strong>{emptyText(item.title)}</strong>
                <p>{noteTypeLabels[item.note_type]} · {statusLabels[item.status]} · {item.pinned ? '已置顶' : '未置顶'}</p>
              </div>
              <time>{formatDateTime(item.updated_at)}</time>
            </div>
            <p className="admin-note-preview">{item.content}</p>
            <div className="admin-grid">
              <p>发布时间：{item.published_at ? formatDateTime(item.published_at) : '未发布'}</p>
              <p>创建时间：{formatDateTime(item.created_at)}</p>
            </div>
            <div className="button-row">
              <Button variant="secondary" disabled={Boolean(actionId)} onClick={() => setDraft(buildDraft(item))}>
                编辑
              </Button>
              {item.status !== 'published' ? (
                <Button disabled={Boolean(actionId)} onClick={() => void runItemAction(item.id, () => publishAdminNote(item.id), '已经发布到补给箱。')}>
                  {actionId === item.id ? '处理中...' : '发布'}
                </Button>
              ) : null}
              {item.status !== 'archived' ? (
                <Button disabled={Boolean(actionId)} variant="ghost" onClick={() => void runItemAction(item.id, () => archiveAdminNote(item.id), '已经下架。')}>
                  {actionId === item.id ? '处理中...' : '下架'}
                </Button>
              ) : null}
              <Button
                disabled={Boolean(actionId)}
                variant="secondary"
                onClick={() => void runItemAction(item.id, () => toggleAdminNotePinned(item.id, !item.pinned), item.pinned ? '已经取消置顶。' : '已经置顶。')}
              >
                {item.pinned ? '取消置顶' : '置顶'}
              </Button>
            </div>
          </article>
        ))}
        {items.length === 0 ? <p className="hint">当前筛选下还没有小纸条。</p> : null}
      </div>
    </section>
  )
}
