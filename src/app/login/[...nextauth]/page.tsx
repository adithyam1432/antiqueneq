'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { History, ShieldCheck, ShoppingBag, UserCircle } from 'lucide-react'
import styles from './login.module.css'

export default function LoginPage() {
  const [role, setRole] = useState<'BUYER' | 'SELLER' | 'ADMIN'>('BUYER')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated professional login - In a real app we'd call signIn from next-auth/react
    console.log('Logging in as', role, email)
    
    // Redirect based on role
    if (role === 'ADMIN') router.push('/admin/dashboard')
    else if (role === 'SELLER') router.push('/seller/dashboard')
    else router.push('/marketplace')
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          <History className={styles.logoIcon} />
          <span>Antiquity</span>
        </div>
      </header>

      <main className={styles.loginCard}>
        <div className="glass-card">
          <div className={styles.cardHeader}>
            <h1 className="gold-gradient">Welcome Back</h1>
            <p>Access your professional antique portal</p>
          </div>

          <div className={styles.roleSelector}>
            <button 
              className={role === 'BUYER' ? styles.activeRole : ''} 
              onClick={() => setRole('BUYER')}
            >
              <ShoppingBag size={20} />
              <span>Buyer</span>
            </button>
            <button 
              className={role === 'SELLER' ? styles.activeRole : ''} 
              onClick={() => setRole('SELLER')}
            >
              <UserCircle size={20} />
              <span>Seller</span>
            </button>
            <button 
              className={role === 'ADMIN' ? styles.activeRole : ''} 
              onClick={() => setRole('ADMIN')}
            >
              <ShieldCheck size={20} />
              <span>Admin</span>
            </button>
          </div>

          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="collector@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button type="submit" className="button-premium w-full">
              Sign In to {role.charAt(0) + role.slice(1).toLowerCase()} Portal
            </button>
          </form>

          <div className={styles.footer}>
            <p>Don't have an account? <a href="/register">Register Now</a></p>
          </div>
        </div>
      </main>
    </div>
  )
}
