import { useState } from 'react'
import { useCognitoAuth } from '../lib/amplify'
import ChatApp from './ChatApp'

export default function AuthWrapper() {
  const { user, loading, signIn, signOut } = useCognitoAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(username, password)
    } catch (err) {
      setError('ログインに失敗しました')
    }
  }

  if (loading) return <div>読み込み中...</div>

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <form onSubmit={handleSignIn} style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>ログイン</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="ユーザー名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>ログイン</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1000 }}>
        <span style={{ marginRight: '1rem' }}>こんにちは、{user.username}さん</span>
        <button onClick={signOut} className="btn">サインアウト</button>
      </div>
      <ChatApp />
    </div>
  )
}