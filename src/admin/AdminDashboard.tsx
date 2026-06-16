import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { DashboardItem } from '../types/app'
import { getDashboardItems } from '../services/adminService'
import { formatDateTime } from './adminFormat'

export function AdminDashboard() {
  const [items, setItems] = useState<DashboardItem[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardItems().then(setItems).catch(() => setError('今日动态读取失败。'))
  }, [])

  return (
    <section className="admin-panel">
      <h2 className="section-title">今日动态</h2>
      {error ? <p className="hint">{error}</p> : null}
      {!error && items.length === 0 ? <p className="section-copy">暂时还没有主动发送的内容。</p> : null}
      <div className="admin-list">
        {items.map((item) => (
          <Link className="admin-row" to={item.href} key={`${item.type}-${item.id}`}>
            <span className={`read-dot ${item.read ? 'is-read' : ''}`} />
            <div>
              <strong>{item.type}</strong>
              <p>{item.summary}</p>
            </div>
            <time>{formatDateTime(item.created_at)}</time>
          </Link>
        ))}
      </div>
    </section>
  )
}
