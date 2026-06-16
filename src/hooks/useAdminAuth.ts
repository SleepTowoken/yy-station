import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase'

type AdminAuthState = {
  loading: boolean
  user: User | null
  isAdmin: boolean
  error: string
}

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    user: null,
    isAdmin: false,
    error: '',
  })

  const refresh = useCallback(async () => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      setState({ loading: false, user: null, isAdmin: false, error: 'Supabase 环境变量还没有配置。' })
      return
    }

    setState((current) => ({ ...current, loading: true, error: '' }))
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('Failed to read admin session:', sessionError)
      setState({ loading: false, user: null, isAdmin: false, error: '登录状态读取失败。' })
      return
    }

    const user = sessionData.session?.user ?? null
    if (!user) {
      setState({ loading: false, user: null, isAdmin: false, error: '' })
      return
    }

    const { data, error } = await supabase.from('admin_users').select('id').eq('id', user.id).maybeSingle()
    if (error) {
      console.error('Failed to verify admin user:', error)
      setState({ loading: false, user, isAdmin: false, error: '管理员身份校验失败。' })
      return
    }

    setState({ loading: false, user, isAdmin: Boolean(data), error: '' })
  }, [])

  useEffect(() => {
    void Promise.resolve().then(refresh)
    const supabase = getSupabaseClient()
    if (!supabase) {
      return undefined
    }

    const { data } = supabase.auth.onAuthStateChange(() => {
      void refresh()
    })

    return () => data.subscription.unsubscribe()
  }, [refresh])

  async function signIn(email: string, password: string) {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return { ok: false, message: 'Supabase 环境变量还没有配置。' }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('Failed to sign in admin:', error)
      return { ok: false, message: '登录失败，请检查邮箱和密码。' }
    }

    await refresh()
    return { ok: true, message: '' }
  }

  async function signOut() {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return
    }
    await supabase.auth.signOut()
    await refresh()
  }

  return {
    ...state,
    configured: isSupabaseConfigured(),
    refresh,
    signIn,
    signOut,
  }
}
