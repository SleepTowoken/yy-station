import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { getRhythmLogs, markRead, type RhythmLog } from '../services/adminService'
import { emptyText, formatDateTime } from './adminFormat'

export function AdminRhythm() {
  const [items, setItems] = useState<RhythmLog[]>([])
  const [error, setError] = useState('')

  async function load() {
    try {
      setItems(await getRhythmLogs())
    } catch {
      setError('自己的节奏记录读取失败。')
    }
  }

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [])

  return (
    <section className="admin-panel">
      <h2 className="section-title">自己的节奏记录</h2>
      <p className="section-copy">这里只展示她主动发送的内容，本地备忘不会出现在这里。</p>
      {error ? <p className="hint">{error}</p> : null}
      <div className="admin-card-list">
        {items.map((item) => (
          <article className="admin-record" key={item.id}>
            <div className="admin-record-head">
              <strong>{emptyText(item.current_status)}</strong>
              <time>{formatDateTime(item.created_at)}</time>
            </div>
            <p>软提醒：{emptyText(item.soft_reminder)}</p>
            <p>缓一会儿：{emptyText(item.rest_status)}</p>
            <p>她写下的内容：{emptyText(item.note)}</p>
            <div className="button-row">
              <Button variant="secondary" disabled={item.read} onClick={() => markRead('rhythm_logs', item.id).then(load)}>
                {item.read ? '已读' : '标记已读'}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
