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

    // Validate Password Pattern: At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. !@#$%^&*).')
      return
    }

    // Validate Contact Number Pattern: 10-digit mobile number, optionally prefixed with +91
    const contactRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/
    if (!contactRegex.test(contactNumber)) {
      setError('Please enter a valid 10-digit mobile number (e.g., 9876543210 or +919876543210).')
      return
    }

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
        if (res.status === 409 || data.error?.toLowerCase().includes('exists')) {
          throw new Error('Existing account. Login through the credentials or create a new account.')
        }
        throw new Error(data.error || 'Failed to create account')
      }

      setSuccess(`Hello ${name}! Welcome to Antique Family! Redirecting to login...`)

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
            {error && <p className="text-red-500 text-center mb-10" style={{ fontSize: '13px', lineHeight: 1.4 }}>{error}</p>}
            {success && <p className="text-green-500 text-center mb-10" style={{ fontSize: '13px', lineHeight: 1.4 }}>{success}</p>}

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
              <input
                type="text"
                placeholder="Contact Number (10 digits)"
                required
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                disabled={loading}
                title="Please enter a valid 10-digit mobile number, optionally prefixed with +91"
              />
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
              <input
                type="password"
                placeholder="Enter New Password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="button-premium w-full" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '46px' }} disabled={loading}>
              <span>{loading ? 'Creating Account... welcome antique <family>name</family>' : 'Register'}</span>
              <ArrowRight size={18} style={{ flexShrink: 0 }} />
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

