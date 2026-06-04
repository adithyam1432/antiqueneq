'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, User, Lock, Mail, ArrowRight, Phone, MapPin } from 'lucide-react'
import styles from './register.module.css'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [permanentAddress, setPermanentAddress] = useState('')
  const [redirectUrl, setRedirectUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setRedirectUrl(params.get('redirect') || '')
    }
  }, [])

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          role: 'BUYER',
          contact_number: contactNumber,
          permanent_address: permanentAddress
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      setSuccess('Account created successfully! Redirecting to login...')
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        const loginUrl = redirectUrl 
          ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
          : '/login'
        router.push(loginUrl)
      }, 2000)
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.loginCard}>
        <div className="glass-card">
          <div className={styles.cardHeader}>
            <ShieldCheck size={48} color="var(--gold)" className="mx-auto mb-10" />
            <h1 className="gold-gradient">Create Account</h1>
            <p>Join India's elite antique network.</p>
          </div>

          <form className={styles.form} onSubmit={handleRegister}>
            {error && <p className="text-red-500 text-center mb-10">{error}</p>}
            {success && <p className="text-green-500 text-center mb-10">{success}</p>}
            
            <div className={styles.inputGroup}>
              <User size={18} className={styles.inputIcon} />
              <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)} disabled={loading} />
            </div>
            <div className={styles.inputGroup}>
              <Mail size={18} className={styles.inputIcon} />
              <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
            </div>
            <div className={styles.inputGroup}>
              <Phone size={18} className={styles.inputIcon} />
              <input type="text" placeholder="Contact Number" required value={contactNumber} onChange={e => setContactNumber(e.target.value)} disabled={loading} />
            </div>
            <div className={styles.inputGroup} style={{ alignItems: 'flex-start', paddingTop: '10px' }}>
              <MapPin size={18} className={styles.inputIcon} style={{ marginTop: '2px' }} />
              <textarea 
                placeholder="Permanent Address" 
                required 
                value={permanentAddress} 
                onChange={e => setPermanentAddress(e.target.value)} 
                disabled={loading}
                rows={2}
                style={{
                  flex: 1,
                  padding: '2px 12px 12px 0',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--foreground)',
                  fontFamily: 'var(--font-primary)',
                  outline: 'none',
                  fontSize: '14px',
                  resize: 'none',
                  minHeight: '60px'
                }}
              />
            </div>
            <div className={styles.inputGroup}>
              <Lock size={18} className={styles.inputIcon} />
              <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} disabled={loading} minLength={6} />
            </div>
            
            <button type="submit" className="button-premium w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </form>

          <div className={styles.footer}>
            <p>Already have an account? <a href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"}>Sign In</a></p>
          </div>
        </div>
      </main>
    </div>
  )
}

