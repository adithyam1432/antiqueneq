'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react'
import styles from './login.module.css'

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setIsAdmin(params.get('admin') === 'true')
      setRedirectUrl(params.get('redirect') || '')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        if (res.error === 'CredentialsSignin') {
          setError('Invalid email or password. Login through your credentials or create a new account.')
        } else {
          setError(res.error)
        }
      } else {
        const sessionRes = await fetch('/api/auth/session')
        const session = await sessionRes.json()
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin/dashboard')
        } else {
          router.push(redirectUrl || '/')
        }
      }
    } catch (err) {
      setError('An unexpected authentication error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.loginCard}>
        <div className="glass-card">
          <div className={styles.cardHeader}>
            <ShieldCheck size={40} color="var(--gold)" className="mx-auto mb-6" />
            <h1 className="gold-gradient">{isAdmin ? 'Admin Portal' : 'Secure Access'}</h1>
            <p>{isAdmin ? 'AntiQues Administrator Access Portal' : 'Welcome back to India\'s elite antique network.'}</p>
          </div>

          <form className={styles.form} onSubmit={handleLogin}>
            {error && <p className="text-red-500 text-center mb-6 text-13">{error}</p>}
            <div className={styles.inputGroup}>
              <Mail size={18} className={styles.inputIcon} />
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                disabled={loading}
              />
            </div>
            <div className={styles.inputGroup}>
              <Lock size={18} className={styles.inputIcon} />
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                disabled={loading}
              />
            </div>
            <button type="submit" className="button-premium w-full" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '46px' }} disabled={loading}>
              <span>{loading ? 'Verifying...' : 'Sign In'}</span>
              <ArrowRight size={18} style={{ flexShrink: 0 }} />
            </button>
          </form>

          <div className={styles.footer}>
            {!isAdmin ? (
              <>
                <p>Don't have an account? <a href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"}>Create one</a></p>
                <p><a href="/forgot-password" className={styles.forgot}>Forgot Password?</a></p>
              </>
            ) : (
              <>
                <p>Curator or Buyer? <a href="/login">Standard Sign In</a></p>
                <a href="/" className={styles.forgot} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeft size={12} /> Return Home
                </a>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
