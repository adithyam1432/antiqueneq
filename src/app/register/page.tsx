'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, User, Building, Lock, Mail, ArrowRight, Phone, Briefcase, FileText, MapPin } from 'lucide-react'
import styles from './register.module.css'

export default function RegisterPage() {
  const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Additional seller fields
  const [contactNumber, setContactNumber] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [panNumber, setPanNumber] = useState('')
  const [businessAddress, setBusinessAddress] = useState('')
  const [taxId, setTaxId] = useState('')

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
          role,
          contact_number: contactNumber,
          business_name: businessName,
          pan_number: panNumber,
          business_address: businessAddress,
          tax_id: taxId
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      setSuccess('Account created successfully! Redirecting to login...')
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
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

          <div className={styles.roleSelector}>
            <button 
              type="button"
              className={`${styles.roleBtn} ${role === 'BUYER' ? styles.activeRole : ''}`}
              onClick={() => setRole('BUYER')}
            >
              <User size={18} /> Buyer
            </button>
            <button 
              type="button"
              className={`${styles.roleBtn} ${role === 'SELLER' ? styles.activeRole : ''}`}
              onClick={() => setRole('SELLER')}
            >
              <Building size={18} /> Seller
            </button>
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
              <Lock size={18} className={styles.inputIcon} />
              <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} disabled={loading} minLength={6} />
            </div>

            {role === 'SELLER' && (
              <>
                <div className={styles.inputGroup}>
                  <Phone size={18} className={styles.inputIcon} />
                  <input type="text" placeholder="Contact Number" required value={contactNumber} onChange={e => setContactNumber(e.target.value)} disabled={loading} />
                </div>
                <div className={styles.inputGroup}>
                  <Briefcase size={18} className={styles.inputIcon} />
                  <input type="text" placeholder="Business Name" required value={businessName} onChange={e => setBusinessName(e.target.value)} disabled={loading} />
                </div>
                <div className={styles.inputGroup}>
                  <FileText size={18} className={styles.inputIcon} />
                  <input type="text" placeholder="PAN Number" required value={panNumber} onChange={e => setPanNumber(e.target.value)} disabled={loading} />
                </div>
                <div className={styles.inputGroup}>
                  <MapPin size={18} className={styles.inputIcon} />
                  <input type="text" placeholder="Business Address" required value={businessAddress} onChange={e => setBusinessAddress(e.target.value)} disabled={loading} />
                </div>
                <div className={styles.inputGroup}>
                  <FileText size={18} className={styles.inputIcon} />
                  <input type="text" placeholder="Tax ID / GSTIN" required value={taxId} onChange={e => setTaxId(e.target.value)} disabled={loading} />
                </div>
              </>
            )}
            
            <button type="submit" className="button-premium w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </form>

          <div className={styles.footer}>
            <p>Already have an account? <a href="/login">Sign In</a></p>
          </div>
        </div>
      </main>
    </div>
  )
}
