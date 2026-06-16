import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { getSparkLogs, markRead, type SparkLog } from '../services/adminService'
import { emptyText, formatDateTime } from './adminFormat'

export function AdminSparks() {
  const [items, setItems] = useState<SparkLog[]>([])
  const [error, setError] = useState('')

  async function load() {
    try {
      setItems(await getSparkLogs())
    } catch {
      setError('小火花儿记录读取失败。')
    }
  }

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [])

  return (
    <section className="admin-panel">
      <h2 className="section-title">小火花儿记录</h2>
      {error ? <p className="hint">{error}</p> : null}
      <div className="admin-card-list">
        {items.map((item) => (
          <article className="admin-record" key={item.id}>
            <div className="admin-record-head">
              <strong>{emptyText(item.fire_status)}</strong>
              <time>{formatDateTime(item.created_at)}</time>
            </div>
            <p>顺手补一句：{emptyText(item.action_type)}</p>
            <p>生成文案：{emptyText(item.generated_text)}</p>
            <p>备注：{emptyText(item.note)}</p>
            <div className="button-row">
              <Button variant="secondary" disabled={item.read} onClick={() => markRead('spark_logs', item.id).then(load)}>
                {item.read ? '已读' : '标记已读'}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
