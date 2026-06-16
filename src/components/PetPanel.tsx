import { useMemo, useState } from 'react'
import { petMessages } from '../constants/messages'
import { petOptions, petShopItems } from '../constants/pets'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { PetProfile, PetType } from '../types/app'
import { Button } from './Button'
import { PillSelector } from './PillSelector'

type PetPanelProps = {
  beans: number
  spendBean: () => boolean
  onToast: (message: string) => void
  onClose: () => void
}

const defaultProfile: PetProfile = {
  type: 'golden',
  name: '小值班员',
}

export function PetPanel({ beans, spendBean, onToast, onClose }: PetPanelProps) {
  const [profile, setProfile] = useLocalStorage<PetProfile>('station_pet_profile', defaultProfile)
  const [items, setItems] = useLocalStorage<string[]>('station_pet_items', [])
  const [draftName, setDraftName] = useState(profile.name)
  const [lineIndex, setLineIndex] = useState(0)
  const pet = petOptions[profile.type]

  const petLine = useMemo(() => pet.lines[lineIndex % pet.lines.length], [lineIndex, pet.lines])

  function handlePetType(nextType: string) {
    setProfile((current) => ({ ...current, type: nextType as PetType }))
    setLineIndex(0)
  }

  function handlePet() {
    setLineIndex((current) => current + 1)
    onToast('小值班员收到了一点点能量。')
  }

  function handleFeed() {
    if (!spendBean()) {
      onToast('能量豆还不够，先慢慢来。')
      return
    }

    onToast(`${profile.name}收到一颗能量豆。`)
  }

  function handleBuy(item: string) {
    if (items.includes(item)) {
      onToast('这个小物件已经在小窝里啦。')
      return
    }

    if (!spendBean()) {
      onToast('能量豆还不够，先留着也没关系。')
      return
    }

    setItems((current) => [...current, item])
    onToast(`${item}已经放进小窝啦。`)
  }

  return (
    <aside className="pet-panel" role="dialog" aria-modal="false" aria-label="回血小窝">
      <div className="pet-panel-head">
        <div className="flex min-w-0 items-center gap-3">
          <div className="pet-face" aria-hidden="true">
            {pet.icon}
          </div>
          <div className="min-w-0">
            <h2 className="section-title">{petMessages.title}</h2>
            <p className="hint pet-meta">
              {profile.name} · {pet.label} · 能量豆 {beans}
            </p>
          </div>
        </div>
        <button className="pet-close" type="button" aria-label="收起回血小窝" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="pet-panel-body">
        <p className="section-copy whitespace-pre-line">{petMessages.core}</p>
        <div className="result-box compact-result">{petLine}</div>

        <div className="button-row pet-actions">
          <Button variant="secondary" onClick={handlePet}>
            摸摸它
          </Button>
          <Button onClick={handleFeed}>喂一颗</Button>
        </div>

        <details className="pet-section">
          <summary>小值班员设置</summary>
          <p className="hint">选择小值班员</p>
          <PillSelector
            options={Object.entries(petOptions).map(([, option]) => option.label)}
            value={pet.label}
            onChange={(label) => {
              const entry = Object.entries(petOptions).find(([, option]) => option.label === label)
              if (entry) {
                handlePetType(entry[0])
              }
            }}
          />
          <p className="hint mt-4">改名字</p>
          <div className="button-row pet-name-row">
            <input
              className="field"
              value={draftName}
              placeholder="比如：可乐、豆包、奶黄、小蓝"
              onChange={(event) => setDraftName(event.target.value)}
            />
            <Button
              variant="secondary"
              onClick={() => {
                const nextName = draftName.trim() || defaultProfile.name
                setProfile((current) => ({ ...current, name: nextName }))
                onToast('小值班员记住这个名字啦。')
              }}
            >
              保存名字
            </Button>
          </div>
        </details>

        <details className="pet-section">
          <summary>小窝商店</summary>
          <div className="pill-grid">
            {petShopItems.map((item) => (
              <button className={`pill ${items.includes(item) ? 'is-active' : ''}`} key={item} type="button" onClick={() => handleBuy(item)}>
                {item}
              </button>
            ))}
          </div>
          <p className="hint">第一版只展示已拥有小物件，不做复杂换装。</p>
        </details>
      </div>
    </aside>
  )
}
