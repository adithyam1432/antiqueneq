import React from 'react'
import { FileText, Compass, Award, ShieldAlert } from 'lucide-react'

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 24px' }}>
      <div className="mb-40" style={{ textAlign: 'center' }}>
        <FileText size={48} style={{ color: 'var(--gold)', marginBottom: '16px' }} />
        <h1 className="text-32 gold-gradient" style={{ marginBottom: '12px' }}>Provenance & Acquisition Terms</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          Legally binding rules governing the cataloging, verification, and transfer of certified Indian antiquities.
        </p>
      </div>

      <div className="glass-card p-40 mb-30">
        <h2 className="text-24" style={{ color: 'var(--gold)', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
          1. Provenance Guarantee
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--foreground)', opacity: 0.9, marginBottom: '20px' }}>
          Every item listed on Antiques is backed by a curator-issued **Certificate of Provenance**. This legal document outlines the historical timeline, material composition, cultural period, and documented prior custody records of the artifact.
        </p>
        <p style={{ lineHeight: '1.7', color: 'var(--foreground)', opacity: 0.9 }}>
          We cooperate fully with local authorities, the Archaeological Survey of India (ASI), and international antiquities registries to ensure all transactions abide by the **Antiquities and Art Treasures Act, 1972**. No items listed here originate from illicitly looted sites or violate federal cultural heritage policies.
        </p>
      </div>

      <div className="glass-card p-40 mb-30">
        <h2 className="text-24" style={{ color: 'var(--gold)', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
          2. Curator Hold & Reservation Period
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--foreground)', opacity: 0.9, marginBottom: '20px' }}>
          When you click **Reserve Artifact**, a temporary hold is placed on the item for a maximum of 48 hours. To cement the hold, the buyer must proceed to the delivery coordination step and submit proof of escrow deposit via the UPI payment screen.
        </p>
        <p style={{ lineHeight: '1.7', color: 'var(--foreground)', opacity: 0.9 }}>
          If payment proof is not uploaded or fails curator verification within the 48-hour window, the hold will automatically expire, the item will be released back into the public catalog gallery, and any cart claims will be cleared.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }} className="mb-40">
        <div className="glass-card p-30">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Compass style={{ color: 'var(--gold)' }} size={24} />
            <h3 className="text-18" style={{ fontFamily: 'var(--font-heading)', fontWeight: '600' }}>Historical Origin</h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Our curators meticulously verify carbon dates, metallurgical tests, and aesthetic markers before admitting any piece to the public catalog.
          </p>
        </div>

        <div className="glass-card p-30">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Award style={{ color: 'var(--gold)' }} size={24} />
            <h3 className="text-18" style={{ fontFamily: 'var(--font-heading)', fontWeight: '600' }}>Certified Transfer</h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Legal title and the physical Certificate of Authenticity are handed over in-person via custom courier alongside the artifact.
          </p>
        </div>

        <div className="glass-card p-30">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <ShieldAlert style={{ color: 'var(--gold)' }} size={24} />
            <h3 className="text-18" style={{ fontFamily: 'var(--font-heading)', fontWeight: '600' }}>Escrow Protection</h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Funds remain held securely in our audited double-layer escrow account until the buyer physically signs off on the item's delivery.
          </p>
        </div>
      </div>
    </div>
  )
}
