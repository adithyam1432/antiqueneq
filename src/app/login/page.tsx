'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { ShieldCheck, User, Building, Lock, Mail, ArrowRight } from 'lucide-react'
import styles from './login.module.css'

export default function LoginPage() {
  const [role, setRole] = useState<'BUYER' | 'SELLER' | 'ADMIN'>('BUYER')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (res?.error) {
      setError(res.error)
    } else {
      if (role === 'ADMIN') router.push('/admin/dashboard')
      else if (role === 'SELLER') router.push('/seller/dashboard')
      else router.push('/')
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.loginCard}>
        <div className="glass-card">
          <div className={styles.cardHeader}>
            <ShieldCheck size={48} color="var(--gold)" className="mx-auto mb-10" />
            <h1 className="gold-gradient">Secure Access</h1>
            <p>Welcome back to India's elite antique network.</p>
          </div>

          <div className={styles.roleSelector}>
            <button 
              className={`${styles.roleBtn} ${role === 'BUYER' ? styles.activeRole : ''}`}
              onClick={() => setRole('BUYER')}
            >
              <User size={18} /> Buyer
            </button>
            <button 
              className={`${styles.roleBtn} ${role === 'SELLER' ? styles.activeRole : ''}`}
              onClick={() => setRole('SELLER')}
            >
              <Building size={18} /> Seller
            </button>
            <button 
              className={`${styles.roleBtn} ${role === 'ADMIN' ? styles.activeRole : ''}`}
              onClick={() => setRole('ADMIN')}
            >
              <ShieldCheck size={18} /> Admin
            </button>
          </div>

          <form className={styles.form} onSubmit={handleLogin}>
            {error && <p className="text-red-500 text-center mb-10">{error}</p>}
            <div className={styles.inputGroup}>
              <Mail size={18} className={styles.inputIcon} />
              <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <Lock size={18} className={styles.inputIcon} />
              <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="button-premium w-full">
              Sign In <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </form>

          <div className={styles.footer}>
            <p>Don't have an account? <a href="/register">Create one</a></p>
            <a href="#" className={styles.forgot}>Forgot password?</a>
          </div>
        </div>
      </main>
    </div>
  )
}
