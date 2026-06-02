'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  ArrowLeft,
  CheckCircle,
  Package,
  QrCode,
  Upload,
  AlertTriangle,
  FileText
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import styles from './checkout.module.css'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const router = useRouter()
  const { data: session } = useSession()
  const [isOrdered, setIsOrdered] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [transactionId, setTransactionId] = useState('')
  
  const [receiptBase64, setReceiptBase64] = useState('')
  const [receiptFileName, setReceiptFileName] = useState('')
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name || '')
      setEmail(session.user.email || '')
      setContactNumber((session.user as any).contact_number || '')
    }
  }, [session])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Receipt file size must be less than 5MB.')
        return
      }
      setReceiptFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return
    
    if (!fullName.trim() || !email.trim() || !shippingAddress.trim()) {
      setError('Please fill in all checkout fields.')
      return
    }

    if (!contactNumber.trim()) {
      setError('Please enter your contact number for delivery coordination.')
      return
    }

    if (paymentMethod === 'qr_code') {
      if (!transactionId.trim()) {
        setError('Please enter your transaction ID.')
        return
      }
      if (!receiptBase64) {
        setError('Please upload a screenshot or image of your payment receipt.')
        return
      }
    }

    setIsProcessing(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cart, 
          shippingAddress: shippingAddress.trim(),
          buyerName: fullName.trim(),
          buyerEmail: email.trim(),
          contactNumber: contactNumber.trim(),
          paymentMethod,
          transactionId: paymentMethod === 'qr_code' ? transactionId.trim() : null,
          receiptBase64: paymentMethod === 'qr_code' ? receiptBase64 : null
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      setIsOrdered(true)
      clearCart()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isOrdered) {
    return (
      <div className={styles.successWrapper}>
         <div className="glass-card p-40 text-center max-w-600">
            <CheckCircle size={80} color="#dfb743" className="mx-auto mb-20 animate-pulse" />
            <h1 className="gold-gradient">Order Submitted</h1>
            <h3 className="text-white mt-10 mb-20" style={{ letterSpacing: '0.05em' }}>
              Status: Awaiting Seller Confirmation
            </h3>
            
            <p className="text-muted mb-20 leading-relaxed">
              Your order has been logged and is pending verification of the payment transfer. 
              Our curators will physically inspect and approve your secure escrow items shortly.
            </p>

            <div className={styles.refundDisclaimer}>
              <AlertTriangle size={24} color="#f1c40f" style={{ flexShrink: 0 }} />
              <p style={{ textAlign: 'left', margin: 0 }}>
                <strong>Collector Protection Notice:</strong> If this order is rejected by the seller or fails verification, 
                your amount will be <strong>100% refunded</strong> to your original payment account.
              </p>
            </div>

            <button className="button-premium mt-30" onClick={() => router.push('/')}>
               Return to Gallery
            </button>
         </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => router.back()}>
        <ArrowLeft size={18} /> Back to Selection
      </button>

      <div className={styles.layout}>
        <div className={styles.formSection}>
          <section className="glass-card p-30 mb-20">
            <h2 className="gold-gradient mb-20"><Truck size={24} className="inline mr-10" /> Delivery Details</h2>
            <div className={styles.formGrid}>
               <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input 
                    placeholder="Adithya M" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
               </div>
               <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input 
                    type="email"
                    placeholder="adithya@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
               </div>
               <div className={styles.inputGroup}>
                  <label>Contact Number</label>
                  <input 
                    type="tel"
                    placeholder="+91 98765 43210" 
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                  />
               </div>
               <div className={`${styles.inputGroup} ${styles.full}`}>
                  <label>Shipping Address</label>
                  <textarea 
                    placeholder="123 Luxury Avenue, Karnataka, India" 
                    rows={3} 
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                  />
               </div>
            </div>
          </section>

          <section className="glass-card p-30">
            <h2 className="gold-gradient mb-20"><CreditCard size={24} className="inline mr-10" /> Payment Method</h2>
            
            <div className={styles.paymentSelector}>
               <div 
                 className={`${styles.option} ${paymentMethod === 'credit_card' ? styles.active : ''}`}
                 onClick={() => setPaymentMethod('credit_card')}
               >
                  <CreditCard size={20} />
                  <span>Secure Escrow (Credit/Debit)</span>
               </div>
               <div 
                 className={`${styles.option} ${paymentMethod === 'qr_code' ? styles.active : ''}`}
                 onClick={() => setPaymentMethod('qr_code')}
               >
                  <QrCode size={20} />
                  <span>QR Code Payment</span>
               </div>
            </div>

            {paymentMethod === 'qr_code' && (
              <div className={styles.qrContainer}>
                <img 
                  src="/qr_payment.jpg" 
                  alt="Antiquity Secure Payment QR Code" 
                  className={styles.qrImage}
                />
                <p className={styles.qrInstructions}>
                  Scan the secure QR code using any payment application (Google Pay, PhonePe, Paytm, or BHIM). 
                  Complete the grand total transfer and fill in your transaction proof details below.
                </p>

                <div className={styles.formGrid} style={{ width: '100%' }}>
                  <div className={`${styles.inputGroup} ${styles.full}`}>
                    <label>Transaction ID</label>
                    <input 
                      placeholder="Enter 12-digit UPI / Bank Ref Transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      required
                    />
                  </div>
                  <div className={`${styles.inputGroup} ${styles.full}`}>
                    <label>Payment Receipt</label>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <div 
                      className={styles.receiptUpload}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={24} color="var(--gold)" />
                      <span>Click to upload transaction screenshot / receipt image</span>
                      {receiptFileName && (
                        <div className={styles.uploadedFile}>
                          <FileText size={14} />
                          <span>{receiptFileName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.refundDisclaimer} style={{ width: '100%' }}>
                  <AlertTriangle size={24} color="#f1c40f" style={{ flexShrink: 0 }} />
                  <p style={{ textAlign: 'left', margin: 0 }}>
                    <strong>Escrow Protection Policy:</strong> If this order is rejected by the seller or curator verification fails, your paid amount is <strong>100% refunded</strong>.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className={styles.summarySidebar}>
          <div className="glass-card p-30 sticky top-20">
            <h3 className="gold-gradient mb-20">Order Summary</h3>
            <div className={styles.itemsList}>
               {cart.map(item => (
                 <div key={item.id} className={styles.item}>
                    <div className={styles.itemIcon}><Package size={16} /></div>
                    <div className={styles.info}>
                       <p>{item.title}</p>
                       <span>Qty: {item.quantity}</span>
                    </div>
                    <p className={styles.price}>₹{(item.price * item.quantity).toLocaleString()}</p>
                 </div>
               ))}
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
               <span>Grand Total</span>
               <span className={styles.totalPrice}>₹{cartTotal.toLocaleString()}</span>
            </div>

            {error && <p className="text-red-500 mb-10 mt-10" style={{ fontSize: '13px' }}>{error}</p>}
            <button 
              className="button-premium w-full mt-30 h-60" 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
               {isProcessing 
                 ? (paymentMethod === 'qr_code' ? 'Verifying Receipt...' : 'Processing Escrow...') 
                 : 'Place Order & Secure Artifacts'}
            </button>

            <div className={styles.securityBox}>
               <ShieldCheck size={18} color="#2ecc71" />
               <span>Authenticated by Antiquity Escrow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
