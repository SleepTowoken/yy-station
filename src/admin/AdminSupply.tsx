import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { useToast } from '../hooks/useToast'
import {
  clearSupplySensitiveFields,
  getSupplyRequests,
  updateSupplyRequest,
  type SupplyRequest,
} from '../services/adminService'
import type { SupplyStatus } from '../types/app'
import { emptyText, formatDateTime } from './adminFormat'

const statusOptions: Array<{ value: SupplyStatus; label: string }> = [
  { value: 'pending', label: '未处理' },
  { value: 'arranged', label: '已安排' },
  { value: 'delivered', label: '已送达' },
  { value: 'cancelled', label: '已取消' },
]

type DraftMap = Record<
  string,
  {
    status: SupplyStatus
    order_platform: string
    pickup_code: string
    eta: string
    admin_note: string
  }
>

function buildDraft(item: SupplyRequest) {
  return {
    status: item.status,
    order_platform: item.order_platform ?? '',
    pickup_code: item.pickup_code ?? '',
    eta: item.eta ?? '',
    admin_note: item.admin_note ?? '',
  }
}

export function AdminSupply() {
  const { showToast } = useToast()
  const [items, setItems] = useState<SupplyRequest[]>([])
  const [drafts, setDrafts] = useState<DraftMap>({})
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState('')
  const [actionMessages, setActionMessages] = useState<Record<string, string>>({})

  async function load() {
    try {
      const nextItems = await getSupplyRequests()
      setItems(nextItems)
      setDrafts(Object.fromEntries(nextItems.map((item) => [item.id, buildDraft(item)])))
    } catch {
      setError('能量补给请求读取失败。')
    }
  }

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [])

  async function saveItem(id: string) {
    const draft = drafts[id]
    if (!draft) {
      return
    }

    setSavingId(id)
    setError('')
    setActionMessages((current) => ({ ...current, [id]: '' }))
    const result = await updateSupplyRequest(id, {
      ...draft,
      read: true,
    })
    if (!result.ok) {
      const message = '能量补给请求保存失败。'
      setActionMessages((current) => ({ ...current, [id]: message }))
      showToast(message)
      setSavingId('')
      return
    }
    await load()
    setActionMessages((current) => ({ ...current, [id]: '处理已保存。' }))
    showToast('处理已保存。')
    setSavingId('')
  }

  async function clearSensitive(id: string) {
    setSavingId(id)
    setError('')
    setActionMessages((current) => ({ ...current, [id]: '' }))
    const result = await clearSupplySensitiveFields(id)
    if (!result.ok) {
      const message = '敏感信息清除失败。'
      setActionMessages((current) => ({ ...current, [id]: message }))
      showToast(message)
      setSavingId('')
      return
    }
    await load()
    setActionMessages((current) => ({ ...current, [id]: '敏感信息已清除。' }))
    showToast('敏感信息已清除。')
    setSavingId('')
  }

  return (
    <section className="admin-panel">
      <h2 className="section-title">能量补给请求</h2>
      <p className="section-copy">第一版不自动下单，只用于查看她主动发送的补给请求。</p>
      {error ? <p className="hint">{error}</p> : null}
      <div className="admin-card-list">
        {items.map((item) => {
          const draft = drafts[item.id] ?? buildDraft(item)
          return (
            <article className="admin-record" key={item.id}>
              <div className="admin-record-head">
                <strong>{emptyText(item.drink_name)}</strong>
                <time>{formatDateTime(item.created_at)}</time>
              </div>
              <div className="admin-grid">
                <p>糖度：{emptyText(item.sugar_preference)}</p>
                <p>冰量：{emptyText(item.ice_preference)}</p>
                <p>方式：{emptyText(item.delivery_method)}</p>
                <p>方便时间：{emptyText(item.available_time)}</p>
                <p>地址：{emptyText(item.address)}</p>
                <p>电话/备注：{emptyText(item.phone)}</p>
              </div>
              <p>其他备注：{emptyText(item.user_note)}</p>
              <p>敏感信息：{item.sensitive_cleared ? '已清除' : '未清除'}</p>

              <div className="admin-form-grid">
                <label>
                  状态
                  <select
                    className="field"
                    value={draft.status}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [item.id]: { ...draft, status: event.target.value as SupplyStatus },
                      }))
                    }
                  >
                    {statusOptions.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  订单平台
                  <input
                    className="field"
                    value={draft.order_platform}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [item.id]: { ...draft, order_platform: event.target.value },
                      }))
                    }
                  />
                </label>
                <label>
                  取餐码
                  <input
                    className="field"
                    value={draft.pickup_code}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [item.id]: { ...draft, pickup_code: event.target.value },
                      }))
                    }
                  />
                </label>
                <label>
                  预计时间
                  <input
                    className="field"
                    value={draft.eta}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [item.id]: { ...draft, eta: event.target.value },
                      }))
                    }
                  />
                </label>
              </div>
              <label className="mt-3 block">
                管理员备注
                <textarea
                  className="field"
                  value={draft.admin_note}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [item.id]: { ...draft, admin_note: event.target.value },
                    }))
                  }
                />
              </label>
              <div className="button-row">
                <Button disabled={savingId === item.id} onClick={() => void saveItem(item.id)}>
                  {savingId === item.id ? '保存中...' : '保存处理'}
                </Button>
                <Button variant="secondary" disabled={item.sensitive_cleared || savingId === item.id} onClick={() => void clearSensitive(item.id)}>
                  {item.sensitive_cleared ? '敏感信息已清除' : '清除地址/电话'}
                </Button>
              </div>
              {actionMessages[item.id] ? <p className="admin-action-message">{actionMessages[item.id]}</p> : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}
