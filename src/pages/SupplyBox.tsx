import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { useToast } from '../hooks/useToast'
import { listPublishedAdminNotes } from '../services/adminNoteService'
import type { AdminNote, AdminNoteType } from '../types/adminNote'
import { formatDateTime } from '../admin/adminFormat'

const noteTypeLabels: Record<AdminNoteType, string> = {
  note: '小纸条',
  comfort: '鼓励',
  reminder: '温柔提醒',
  goodnight: '晚安',
}

function noteTypeClass(type: AdminNoteType) {
  return `supply-note-type supply-note-type-${type}`
}

export function SupplyBox() {
  const { showToast } = useToast()
  const [notes, setNotes] = useState<AdminNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const nextNotes = await listPublishedAdminNotes()
      setNotes(nextNotes)
    } catch {
      setError('好像暂时没拿到补给，等一下再试试？')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [load])

  return (
    <main className="app-shell supply-box-page">
      <header className="supply-box-header">
        <Link className="supply-box-back" to="/">
          ← 回到小站
        </Link>
        <div>
          <p className="supply-box-kicker">垚总补给箱</p>
          <h1 className="app-title">给你留了一点东西</h1>
          <p className="app-subtitle">不用马上回复，想看的时候再看就好。</p>
        </div>
      </header>

      {loading ? <section className="station-card supply-box-state">正在打开补给箱...</section> : null}

      {!loading && error ? (
        <section className="station-card supply-box-state">
          <p>{error}</p>
          <div className="button-row">
            <Button variant="secondary" onClick={() => void load()}>
              重新试试
            </Button>
          </div>
        </section>
      ) : null}

      {!loading && !error && notes.length === 0 ? (
        <section className="station-card supply-box-state">
          <h2 className="section-title">今天还没有新的补给</h2>
          <p className="section-copy">但小站一直在。</p>
          <div className="button-row">
            <Link className="station-button secondary" to="/">
              去今日回血
            </Link>
          </div>
        </section>
      ) : null}

      {!loading && !error && notes.length > 0 ? (
        <section className="supply-note-list" aria-label="已发布的小纸条">
          {notes.map((note) => (
            <article className={`supply-note-card ${note.pinned ? 'is-pinned' : ''}`} key={note.id}>
              <div className="supply-note-topline">
                <span className={noteTypeClass(note.note_type)}>{noteTypeLabels[note.note_type]}</span>
                {note.pinned ? <span className="supply-note-pin">放在最上面</span> : null}
              </div>
              <h2 className="supply-note-title">{note.title?.trim() || '给你的小纸条'}</h2>
              <p className="supply-note-content">{note.content}</p>
              <p className="supply-note-tail">不用回复，收下就好。</p>
              <time className="supply-note-meta">{formatDateTime(note.published_at ?? note.created_at)}</time>
              <div className="button-row supply-note-actions">
                <Button
                  onClick={() => {
                    showToast('已经放进今天的口袋里啦。')
                  }}
                >
                  收下啦
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    showToast('那就先放在这里，晚点也会在。')
                  }}
                >
                  晚点再看
                </Button>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  )
}
