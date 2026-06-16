import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'

type AdminLoginProps = {
  configured: boolean
  error: string
  onSignIn: (email: string, password: string) => Promise<{ ok: boolean; message: string }>
}

export function AdminLogin({ configured, error, onSignIn }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    setSubmitting(true)
    setMessage('')
    const result = await onSignIn(email.trim(), password)
    if (!result.ok) {
      setMessage(result.message)
    }
    setSubmitting(false)
  }

  return (
    <main className="admin-auth-shell">
      <Card title="加油站站长后台" copy="这里只查看主动发给垚总的内容。">
        <div className="mt-5 grid gap-3">
          <input className="field" value={email} placeholder="管理员邮箱" onChange={(event) => setEmail(event.target.value)} />
          <input className="field" value={password} placeholder="密码" type="password" onChange={(event) => setPassword(event.target.value)} />
        </div>
        {!configured ? <p className="hint">Supabase 环境变量还没有配置，请先设置 .env.local。</p> : null}
        {message || (configured && error) ? <p className="hint">{message || error}</p> : null}
        <div className="button-row">
          <Button disabled={submitting || !email || !password} onClick={handleSubmit}>
            {submitting ? '登录中...' : '进入后台'}
          </Button>
        </div>
      </Card>
    </main>
  )
}
