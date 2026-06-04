import React from 'react'
import { Shield, Eye, Lock, Server } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 24px' }}>
      <div className="mb-40" style={{ textAlign: 'center' }}>
        <Shield size={48} style={{ color: 'var(--gold)', marginBottom: '16px' }} />
        <h1 className="text-32 gold-gradient" style={{ marginBottom: '12px' }}>Privacy Shield Protocol</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          Restricted registry policies guarding the identity, transactions, and holdings of India's elite antique collectors.
        </p>
      </div>

      <div className="glass-card p-40 mb-30">
        <h2 className="text-24" style={{ color: 'var(--gold)', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
          1. Collector Identity Confidentiality
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--foreground)', opacity: 0.9, marginBottom: '20px' }}>
          At Antiques, privacy is the absolute cornerstone of our business. Because antique artifacts are highly valuable, one-of-a-kind assets, we ensure that both buyer identities and physical holding locations are shielded from the public domain. 
        </p>
        <p style={{ lineHeight: '1.7', color: 'var(--foreground)', opacity: 0.9 }}>
          We never disclose customer profiles, purchase history, or transaction records to third-party advertisers. All physical shipping addresses provided during delivery coordination are stored on end-to-end encrypted databases and purged from active routing servers once the item is marked as **Shipped & Closed**.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }} className="mb-40">
        <div className="glass-card p-30">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Lock style={{ color: 'var(--gold)' }} size={24} />
            <h3 className="text-18" style={{ fontFamily: 'var(--font-heading)', fontWeight: '600' }}>Secure Cryptography</h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Every interaction on our server is protected using transport layer security (TLS 1.3) and AES-256 ledger encryption.
          </p>
        </div>

        <div className="glass-card p-30">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Eye style={{ color: 'var(--gold)' }} size={24} />
            <h3 className="text-18" style={{ fontFamily: 'var(--font-heading)', fontWeight: '600' }}>Zero Telemetry</h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            We host no tracking pixels, external behavioral analytics, or profile cookies. Your browsing journey is strictly private.
          </p>
        </div>

        <div className="glass-card p-30">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Server style={{ color: 'var(--gold)' }} size={24} />
            <h3 className="text-18" style={{ fontFamily: 'var(--font-heading)', fontWeight: '600' }}>Sovereign Storage</h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Our database records reside on secure, air-gapped database instances located inside local sovereign data centers.
          </p>
        </div>
      </div>

      <div className="glass-card p-30" style={{ border: '1px dashed var(--gold)', background: 'rgba(223, 183, 67, 0.02)' }}>
        <h4 className="text-18" style={{ color: 'var(--gold)', marginBottom: '8px', fontWeight: '600' }}>Curator Privacy Contact</h4>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--foreground)', opacity: 0.85 }}>
          If you are representing a royal estate, estate trust, or high-net-worth registry and require custom air-gapped catalog transactions or off-market acquisitions, contact our chief curator directly at <strong style={{ color: 'var(--gold)' }}>shield@antiques.com</strong>.
        </p>
      </div>
    </div>
  )
}
