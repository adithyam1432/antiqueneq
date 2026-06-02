'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Upload, Building, User, FileText } from 'lucide-react'
import styles from './seller-reg.module.css'

export default function SellerRegistration() {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to the API and store in PENDING state
    setStep(3)
  }

  return (
    <div className={styles.container}>
      <main className={styles.regCard}>
        <div className="glass-card">
          <div className={styles.header}>
            <h1 className="gold-gradient">Become a Verified Seller</h1>
            <p>Join India's most trusted antique network.</p>
          </div>

          <div className={styles.stepper}>
            <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>1</div>
            <div className={styles.line}></div>
            <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>2</div>
            <div className={styles.line}></div>
            <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>3</div>
          </div>

          {step === 1 && (
            <div className={styles.formSection}>
              <h2><User size={20} /> Personal Details</h2>
              <form onSubmit={() => setStep(2)}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" required />
                </div>
                <button type="submit" className="button-premium w-full">Next: Business Details</button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className={styles.formSection}>
              <h2><Building size={20} /> Business Details</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <label>Business Name</label>
                  <input type="text" placeholder="Majestic Antiques" required />
                </div>
                <div className={styles.inputGroup}>
                  <label>ID Proof (PAN/Aadhar)</label>
                  <div className={styles.fileUpload}>
                    <Upload size={24} />
                    <span>Click to upload identification</span>
                    <input type="file" className={styles.hiddenFile} />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Auth Certificate (Optional)</label>
                  <div className={styles.fileUpload}>
                    <Upload size={24} />
                    <span>Click to upload certification</span>
                    <input type="file" className={styles.hiddenFile} />
                  </div>
                </div>
                <button type="submit" className="button-premium w-full">Submit Application</button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className={styles.successSection}>
              <ShieldCheck size={64} color="var(--gold)" />
              <h2 className="gold-gradient">Application Pending</h2>
              <p>
                Your professional seller application is under review. 
                Our compliance team will verify your documents within 24-48 hours.
              </p>
              <button 
                className="button-outline" 
                onClick={() => router.push('/')}
              >
                Return to Website
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
