import { useState } from 'react'
import { Lightbulb, LoaderCircle, LockKeyhole, Mail } from 'lucide-react'
import { authSession } from '../../services/apiClient'

export default function LoginPage({ onAuthenticated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await authSession.login(email.trim(), password)
      onAuthenticated()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand"><Lightbulb size={25} /><strong>Lumina IoT</strong></div>
        <div className="login-heading">
          <span>Hệ thống giám sát phòng IoT</span>
          <h1>Đăng nhập</h1>
          <p>Dùng tài khoản được cấu hình tại backend để truy cập dữ liệu và điều khiển thiết bị.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <i><Mail size={17} /></i>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus />
          </label>
          <label>
            <span>Mật khẩu</span>
            <i><LockKeyhole size={17} /></i>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting && <LoaderCircle size={17} className="spin" />}
            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </section>
    </main>
  )
}
