import React from 'react'
import { ShieldCheck, Calendar, RotateCcw, Truck } from 'lucide-react'

export default function EscrowPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 24px' }}>
      <div className="mb-40" style={{ textAlign: 'center' }}>
        <ShieldCheck size={48} style={{ color: 'var(--gold)', marginBottom: '16px' }} />
        <h1 className="text-32 gold-gradient" style={{ marginBottom: '12px' }}>Secure Escrow Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          Rest easy knowing that your capital is fully protected through our audited transaction protocol until the artifact arrives in your collection.
        </p>
      </div>

      <div className="glass-card p-40 mb-30">
        <h2 className="text-24" style={{ color: 'var(--gold)', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
          1. The Dual-Layered Escrow Flow
        </h2>
        <p style={{ lineHeight: '1.7', color: 'var(--foreground)', opacity: 0.9, marginBottom: '20px' }}>
          Because antiquities represent substantial financial investments, we do not support direct seller or instant release payments. All funds are deposited into a secure, audited Escrow vault managed by AntiQues.
        </p>
        <div style={{ lineHeight: '1.7', color: 'var(--foreground)', opacity: 0.9 }}>
          Once the buyer initiates the purchase and uploads the transfer receipt:
          <ol style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Our curators audit the deposit to confirm receipt of funds.</li>
            <li>Upon confirmation, the item is marked as **Confirmed** and proceeds to careful packing.</li>
            <li>The item is dispatched through a secure white-glove transport courier.</li>
            <li>Only after the buyer physically receives the artifact and signs the **Acquisition Release Document** are the funds officially settled and released.</li>
          </ol>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }} className="mb-40">
        <div className="glass-card p-30">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Calendar style={{ color: 'var(--gold)' }} size={24} />
            <h3 className="text-18" style={{ fontFamily: 'var(--font-heading)', fontWeight: '600' }}>Inspection Period</h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Buyers are granted a 24-hour visual inspection window upon physical courier delivery to verify the artifact's condition against catalog descriptions.
          </p>
        </div>

        <div className="glass-card p-30">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <RotateCcw style={{ color: 'var(--gold)' }} size={24} />
            <h3 className="text-18" style={{ fontFamily: 'var(--font-heading)', fontWeight: '600' }}>Full Refund Guarantee</h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            If the artifact is damaged in transit or fails physical validation, the escrow transaction is immediately canceled and a 100% refund is dispatched.
          </p>
        </div>

        <div className="glass-card p-30">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Truck style={{ color: 'var(--gold)' }} size={24} />
            <h3 className="text-18" style={{ fontFamily: 'var(--font-heading)', fontWeight: '600' }}>Flat Logistics Fee</h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            We charge a flat ₹500 delivery coordination fee to cover secure, climate-controlled, white-glove transport across India.
          </p>
        </div>
      </div>
    </div>
  )
}
