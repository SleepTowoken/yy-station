import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { getMoodLogs, markRead, type MoodLog } from '../services/adminService'
import { emptyText, formatDateTime } from './adminFormat'

export function AdminMood() {
  const [items, setItems] = useState<MoodLog[]>([])
  const [error, setError] = useState('')

  async function load() {
    try {
      setItems(await getMoodLogs())
    } catch {
      setError('今日回血记录读取失败。')
    }
  }

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [])

  return (
    <section className="admin-panel">
      <h2 className="section-title">今日回血记录</h2>
      {error ? <p className="hint">{error}</p> : null}
      <div className="admin-card-list">
        {items.map((item) => (
          <article className="admin-record" key={item.id}>
            <div className="admin-record-head">
              <strong>{emptyText(item.mood)}</strong>
              <time>{formatDateTime(item.created_at)}</time>
            </div>
            <p>回血结果：{emptyText(item.heal_result)}</p>
            <p>备注：{emptyText(item.note)}</p>
            <div className="button-row">
              <Button variant="secondary" disabled={item.read} onClick={() => markRead('mood_logs', item.id).then(load)}>
                {item.read ? '已读' : '标记已读'}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
