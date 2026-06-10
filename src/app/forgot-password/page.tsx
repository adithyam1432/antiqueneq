'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Mail, Lock, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react'
import styles from './forgot-password.module.css'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()

  // Handle requesting the OTP (Step 1)
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to request reset OTP.')
      }

      setSuccessMessage('A 6-digit verification code has been sent to your email. (Please check server logs)')
      setStep(2)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your email and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle verifying the OTP and resetting the password (Step 2)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (otp.trim().length !== 6 || isNaN(Number(otp))) {
      setError('Please enter a valid 6-digit numeric verification code.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: otp.trim(),
          new_password: newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.')
      }

      setSuccessMessage('Password reset successful! Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.cardWrapper}>
        <div className="glass-card">
          <div className={styles.cardHeader}>
            <ShieldCheck size={40} color="var(--gold)" className="mx-auto mb-6" />
            <h1 className="gold-gradient">Reset Password</h1>
            <p>
              {step === 1 
                ? 'Enter your registered email to request a 6-digit verification code.'
                : 'Enter the 6-digit verification code and your new password below.'
              }
            </p>
          </div>

          {step === 1 ? (
            <form className={styles.form} onSubmit={handleRequestOtp}>
              {error && <p className="text-red-500 text-center mb-4 text-13">{error}</p>}
              {successMessage && <p className="text-green-500 text-center mb-4 text-13">{successMessage}</p>}
              
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

              <div className={styles.buttonGroup}>
                <button type="submit" className="button-premium w-full" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '46px' }} disabled={loading}>
                  <span>{loading ? 'Sending Code...' : 'Request Verification Code'}</span>
                  <ArrowRight size={18} style={{ flexShrink: 0 }} />
                </button>
              </div>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleResetPassword}>
              {error && <p className="text-red-500 text-center mb-4 text-13">{error}</p>}
              {successMessage && <p className="text-green-500 text-center mb-4 text-13">{successMessage}</p>}

              <div className={styles.inputGroup}>
                <KeyRound size={18} className={styles.inputIcon} />
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="6-Digit Code" 
                  required 
                  value={otp} 
                  onChange={e => setOtp(e.target.value)} 
                  disabled={loading}
                />
              </div>

              <div className={styles.inputGroup}>
                <Lock size={18} className={styles.inputIcon} />
                <input 
                  type="password" 
                  placeholder="New Password" 
                  required 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  disabled={loading}
                />
              </div>

              <div className={styles.inputGroup}>
                <Lock size={18} className={styles.inputIcon} />
                <input 
                  type="password" 
                  placeholder="Confirm New Password" 
                  required 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  disabled={loading}
                />
              </div>

              <div className={styles.buttonGroup}>
                <button type="submit" className="button-premium w-full" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '46px' }} disabled={loading}>
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
                <button 
                  type="button" 
                  className={styles.secondaryButton} 
                  onClick={() => setStep(1)} 
                  disabled={loading}
                >
                  Back to Step 1
                </button>
              </div>
            </form>
          )}

          <div className={styles.footer}>
            <a href="/login" className={styles.forgot} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
              <ArrowLeft size={12} /> Return to Sign In
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
