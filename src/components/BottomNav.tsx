import type { TabId } from '../types/app'

const tabs: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'heal', label: '今日回血', icon: '☀️' },
  { id: 'rhythm', label: '自己的节奏', icon: '☁️' },
  { id: 'outfit', label: '今日穿搭', icon: '✨' },
  { id: 'spark', label: '小火花儿', icon: '🌙' },
]

type BottomNavProps = {
  activeTab: TabId
  onChange: (tab: TabId) => void
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="底部导航">
      {tabs.map((tab) => (
        <button
          className={`nav-item ${activeTab === tab.id ? 'is-active' : ''}`}
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
        >
          <span className="nav-icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
