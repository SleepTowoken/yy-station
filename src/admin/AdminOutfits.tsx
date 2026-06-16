import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { useToast } from '../hooks/useToast'
import { createOutfitImageSignedUrl, getOutfitLogs, markOutfitReviewed, type OutfitLog } from '../services/adminService'
import { emptyText, formatDateTime } from './adminFormat'

export function AdminOutfits() {
  const { showToast } = useToast()
  const [items, setItems] = useState<OutfitLog[]>([])
  const [error, setError] = useState('')
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({})
  const [loadingImageId, setLoadingImageId] = useState('')

  async function load() {
    try {
      setItems(await getOutfitLogs())
    } catch {
      setError('今日穿搭记录读取失败。')
    }
  }

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [])

  async function handleShowImage(item: OutfitLog) {
    if (!item.image_path) {
      return
    }

    setLoadingImageId(item.id)
    const result = await createOutfitImageSignedUrl(item.image_path)
    if (result.ok && result.url) {
      setSignedUrls((current) => ({ ...current, [item.id]: result.url! }))
      showToast('图片临时链接已生成，10 分钟后自动失效。')
    } else {
      showToast('图片暂时打不开，稍后再试一下。')
    }
    setLoadingImageId('')
  }

  return (
    <section className="admin-panel">
      <h2 className="section-title">今日穿搭营业中</h2>
      <p className="section-copy">图片存放在私有空间，点击后生成 10 分钟临时查看链接。</p>
      {error ? <p className="hint">{error}</p> : null}
      <div className="admin-card-list">
        {items.map((item) => (
          <article className="admin-record" key={item.id}>
            <div className="admin-record-head">
              <strong>{emptyText(item.style)}</strong>
              <time>{formatDateTime(item.created_at)}</time>
            </div>
            <p>点评模式：{emptyText(item.mode)}</p>
            <p>生成反馈：{emptyText(item.generated_comment)}</p>
            <p>备注：{emptyText(item.user_note)}</p>
            <p>图片：{item.image_path ? '有' : '无'}</p>
            {signedUrls[item.id] ? <img className="admin-outfit-image" src={signedUrls[item.id]} alt="穿搭图片预览" /> : null}
            <div className="button-row">
              {item.image_path ? (
                <Button variant="secondary" disabled={loadingImageId === item.id} onClick={() => handleShowImage(item)}>
                  {loadingImageId === item.id ? '打开中...' : '临时查看图片'}
                </Button>
              ) : null}
              <Button variant="secondary" disabled={item.reviewed && item.read} onClick={() => markOutfitReviewed(item.id).then(load)}>
                {item.reviewed || item.read ? '已看' : '标记已看'}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
