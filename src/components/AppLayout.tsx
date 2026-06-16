import type { ReactNode } from 'react'
import { appHeader } from '../constants/messages'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-title">{appHeader.title}</h1>
          <p className="app-subtitle">{appHeader.subtitle}</p>
        </div>
        <div className="header-badge" aria-hidden="true">
          ☕
        </div>
      </header>
      <div className="content-stack">{children}</div>
      <p className="privacy-note">{appHeader.privacyNote}</p>
    </main>
  )
}
