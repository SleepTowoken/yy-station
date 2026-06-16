import { useEffect, useState } from 'react'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { Button } from '../components/Button'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { getAdminUnreadCounts } from '../services/adminService'
import type { AdminUnreadCounts } from '../types/app'
import { AdminLogin } from './AdminLogin'

const adminLinks = [
  { href: '/admin/dashboard', label: '今日动态', countKey: 'dashboard' },
  { href: '/admin/mood', label: '今日回血', countKey: 'mood' },
  { href: '/admin/supply', label: '能量补给', countKey: 'supply' },
  { href: '/admin/rhythm', label: '自己的节奏', countKey: 'rhythm' },
  { href: '/admin/outfits', label: '今日穿搭', countKey: 'outfits' },
  { href: '/admin/sparks', label: '小火花儿', countKey: 'sparks' },
] satisfies Array<{
  href: string
  label: string
  countKey: keyof AdminUnreadCounts
}>

const emptyCounts: AdminUnreadCounts = {
  dashboard: 0,
  mood: 0,
  supply: 0,
  rhythm: 0,
  outfits: 0,
  sparks: 0,
}

function formatCount(count: number) {
  return count > 99 ? '99+' : String(count)
}

function hasCount(count: number) {
  return count > 0
}

function adminLinkClass(isActive: boolean, count: number) {
  return `${isActive ? 'is-active' : ''} ${hasCount(count) ? 'has-unread' : ''}`.trim()
}

export function AdminLayout() {
  const auth = useAdminAuth()
  const location = useLocation()
  const [unreadCounts, setUnreadCounts] = useState<AdminUnreadCounts>(emptyCounts)

  useEffect(() => {
    if (!auth.isAdmin) {
      return undefined
    }

    let alive = true
    async function loadUnreadCounts() {
      try {
        const nextCounts = await getAdminUnreadCounts()
        if (alive) {
          setUnreadCounts(nextCounts)
        }
      } catch (error) {
        console.error('Failed to load admin unread counts:', error)
      }
    }

    void loadUnreadCounts()
    window.addEventListener('admin-unread-changed', loadUnreadCounts)
    window.addEventListener('focus', loadUnreadCounts)

    return () => {
      alive = false
      window.removeEventListener('admin-unread-changed', loadUnreadCounts)
      window.removeEventListener('focus', loadUnreadCounts)
    }
  }, [auth.isAdmin, location.pathname])

  if (auth.loading) {
    return (
      <main className="admin-auth-shell">
        <div className="station-card">后台加载中...</div>
      </main>
    )
  }

  if (!auth.user) {
    return <AdminLogin configured={auth.configured} error={auth.error} onSignIn={auth.signIn} />
  }

  if (!auth.isAdmin) {
    return (
      <main className="admin-auth-shell">
        <div className="station-card">
          <h1 className="section-title">无权限</h1>
          <p className="section-copy">当前账号不在 admin_users 表中，不能查看后台数据。</p>
          <div className="button-row">
            <Button variant="secondary" onClick={() => void auth.signOut()}>
              退出登录
            </Button>
          </div>
        </div>
      </main>
    )
  }

  if (location.pathname === '/admin' || location.pathname === '/admin/') {
    return <Navigate to="/admin/dashboard" replace />
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <h1 className="app-title">加油站站长后台</h1>
          <p className="app-subtitle">只看她主动发来的内容，不做监控。</p>
        </div>
        <Button variant="secondary" onClick={() => void auth.signOut()}>
          退出
        </Button>
      </header>
      <nav className="admin-nav" aria-label="后台导航">
        {adminLinks.map((link) => {
          const count = unreadCounts[link.countKey]
          return (
            <Link className={adminLinkClass(location.pathname === link.href, count)} to={link.href} key={link.href}>
              {link.label}
              {hasCount(count) ? <span className="admin-nav-badge">{formatCount(count)}</span> : null}
            </Link>
          )
        })}
      </nav>
      <Outlet />
    </main>
  )
}
