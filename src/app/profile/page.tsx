'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  History, 
  User, 
  Mail, 
  Phone, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  ShieldCheck, 
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  FileText,
  ExternalLink,
  Package
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/buyer/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: '#060807', color: 'var(--foreground)' }}>
        <RefreshCw className="animate-spin mb-10" color="var(--gold)" size={32} />
        <p className="text-muted">Loading Curator Profile...</p>
      </div>
    )
  }

  return (
    <div style={{ background: '#060807', minHeight: '100vh', padding: '60px 4%', color: 'var(--foreground)' }}>
      <div className="max-w-1000 mx-auto">
        
        {/* Back Link */}
        <Link href="/" className="flex items-center gap-8 mb-30" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Gallery
        </Link>

        {/* Curator Profile Info */}
        <div className="glass-card p-40 mb-30" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(223, 183, 67, 0.1)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={30} color="var(--gold)" />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Collector Profile</span>
                <h1 className="gold-gradient text-32 font-playfair">{session?.user?.name || 'Vikas Collector'}</h1>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '15px' }} className="text-muted text-14">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Mail size={14} color="var(--gold)" /> {session?.user?.email}</span>
              {(session?.user as any)?.contact_number && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Phone size={14} color="var(--gold)" /> {(session?.user as any).contact_number}</span>
              )}
            </div>
          </div>

          <button 
            className="button-premium" 
            style={{ padding: '10px 20px', fontSize: '12px' }}
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Sign Out Profile
          </button>
        </div>

        {/* Acquisitions Header */}
        <div className="flex items-center gap-10 mb-20">
          <ShoppingBag size={22} color="var(--gold)" />
          <h2 className="text-24 font-playfair text-white" style={{ margin: 0 }}>Your Escrow Acquisitions</h2>
        </div>

        {/* Orders Listing */}
        {orders.length === 0 ? (
          <div className="glass-card p-40 text-center">
            <Package size={48} color="var(--gold)" className="mx-auto mb-20 animate-pulse" />
            <h3 className="text-white font-playfair text-20 mb-10">No Acquisitions Yet</h3>
            <p className="text-muted mb-25 max-w-400 mx-auto">Explore our curated collections of rare and verified artifacts to initiate your first acquisition.</p>
            <Link href="/" className="button-premium inline-block" style={{ textDecoration: 'none' }}>
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-20">
             {orders.map((order) => (
              <div key={order.id} className="glass-card p-30" style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderLeft: `4px solid ${order.status === 'CONFIRMED' || order.status === 'DELIVERED' || order.status === 'SHIPPED' ? '#2ecc71' : order.status === 'REJECTED' ? '#e74c3c' : '#f1c40f'}` }}>
                
                {/* Upper Section: Details and Badge Layout */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '30px', alignItems: 'flex-start' }}>
                  
                  {/* Left Info: Image and Description */}
                  <div style={{ display: 'flex', gap: '24px', flex: 1, alignItems: 'flex-start' }}>
                    {order.productImageUrl && (
                      <img 
                        src={order.productImageUrl} 
                        alt={order.productTitle} 
                        style={{ width: '90px', height: '90px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--glass-border)', flexShrink: 0 }}
                      />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>ORDER REFERENCE: {order.id.substring(0, 14).toUpperCase()}...</span>
                      <h3 className="text-18 font-playfair text-white" style={{ margin: '4px 0 8px 0', lineHeight: 1.3 }}>{order.productTitle}</h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} className="text-13 text-muted">
                        <div>Seller Partner: <strong style={{ color: 'var(--foreground)' }}>{order.sellerBusinessName || 'Direct Curator'}</strong></div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                          <span>Acquisition Cost: <strong style={{ color: 'var(--foreground)' }}>₹{parseFloat(order.productPrice).toLocaleString()}</strong></span>
                          <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                          <span>Delivery Escrow: <strong style={{ color: 'var(--foreground)' }}>₹{parseFloat(order.deliveryCharge).toLocaleString()}</strong></span>
                        </div>
                        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed rgba(223, 183, 67, 0.2)', width: 'fit-content' }}>
                          <span className="text-white font-bold" style={{ fontSize: '15px' }}>Grand Total: <span style={{ color: 'var(--gold)' }}>₹{parseFloat(order.totalAmount).toLocaleString()}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Info: Status Badge & Payment Info */}
                  <div className="flex flex-col justify-between items-start md-items-end gap-16" style={{ minWidth: '260px' }}>
                    
                    {/* Status Badge */}
                    <div className="flex items-center gap-8">
                      {order.status === 'PENDING' && (
                        <div className="flex items-center gap-6 px-12 py-6 rounded-6" style={{ background: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f', border: '1px solid rgba(241, 196, 15, 0.2)', fontSize: '12px', fontWeight: 600 }}>
                          <Clock size={14} />
                          <span>Awaiting Verification</span>
                        </div>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <div className="flex items-center gap-6 px-12 py-6 rounded-6" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', border: '1px solid rgba(46, 204, 113, 0.2)', fontSize: '12px', fontWeight: 600 }}>
                          <CheckCircle2 size={14} />
                          <span>Order Confirmed!</span>
                        </div>
                      )}
                      {order.status === 'REJECTED' && (
                        <div className="flex items-center gap-6 px-12 py-6 rounded-6" style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.2)', fontSize: '12px', fontWeight: 600 }}>
                          <XCircle size={14} />
                          <span>Order Rejected</span>
                        </div>
                      )}
                      {order.status === 'SHIPPED' && (
                        <div className="flex items-center gap-6 px-12 py-6 rounded-6" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', border: '1px solid rgba(52, 152, 219, 0.2)', fontSize: '12px', fontWeight: 600 }}>
                          <Truck size={14} />
                          <span>Shipped (In Transit)</span>
                        </div>
                      )}
                      {order.status === 'DELIVERED' && (
                        <div className="flex items-center gap-6 px-12 py-6 rounded-6" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', border: '1px solid rgba(155, 89, 182, 0.2)', fontSize: '12px', fontWeight: 600 }}>
                          <ShieldCheck size={14} />
                          <span>Acquisition Delivered</span>
                        </div>
                      )}
                    </div>

                    {/* Payment Info */}
                    <div style={{ textAlign: 'left', width: '100%' }} className="text-12 text-muted">
                      <p style={{ margin: '0 0 4px 0' }}>Method: <strong>{order.paymentMethod === 'qr_code' ? 'QR Code Transfer' : 'Card Escrow'}</strong></p>
                      {order.paymentMethod === 'qr_code' && (
                        <>
                          {order.transactionId && <p style={{ margin: '0 0 4px 0', fontFamily: 'monospace' }}>Txn ID: {order.transactionId}</p>}
                          {order.receiptUrl && (
                            <a 
                              href={order.receiptUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center gap-4 mt-4" 
                              style={{ color: 'var(--gold)', textDecoration: 'underline' }}
                            >
                              <FileText size={12} /> View Uploaded Receipt <ExternalLink size={10} />
                            </a>
                          )}
                        </>
                      )}
                    </div>

                    {/* Status Subtext Summary */}
                    <div style={{ width: '100%' }}>
                      {order.status === 'PENDING' && (
                        <div className="flex gap-8 p-10 rounded-6" style={{ background: 'rgba(241, 196, 15, 0.05)', border: '1px dashed rgba(241, 196, 15, 0.2)', fontSize: '11px', color: '#f1c40f', lineHeight: 1.4 }}>
                          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                          <span>Waiting for order confirmation. If this order is rejected by the seller, your amount will be 100% refunded.</span>
                        </div>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <p style={{ margin: 0, fontSize: '11px', color: '#2ecc71', lineHeight: 1.4 }}>
                          Payment verified successfully. Our curators are packing your artifact in temperature-controlled shipping grids.
                        </p>
                      )}
                      {order.status === 'REJECTED' && (
                        <div className="flex gap-8 p-10 rounded-6" style={{ background: 'rgba(231, 76, 60, 0.05)', border: '1px dashed rgba(231, 76, 60, 0.2)', fontSize: '11px', color: '#e74c3c', lineHeight: 1.4 }}>
                          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                          <span>Your order has been rejected. Your paid amount will be 100% repeated and refunded to your source account.</span>
                        </div>
                      )}
                      {order.status === 'SHIPPED' && (
                        <p style={{ margin: 0, fontSize: '11px', color: '#3498db', lineHeight: 1.4 }}>
                          Acquisition is currently in transit. Please monitor your registered coordinates for delivery scheduling.
                        </p>
                      )}
                      {order.status === 'DELIVERED' && (
                        <p style={{ margin: 0, fontSize: '11px', color: '#9b59b6', lineHeight: 1.4 }}>
                          Secure escrow payout completed. The item is verified in your possession. Thank you for your partnership.
                        </p>
                      )}
                    </div>

                  </div>

                </div>

                {/* Lower Section: E2E Progress Tracker Timeline */}
                <div style={{ width: '100%', marginTop: '10px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
                  <p style={{ margin: '0 0 16px 0', fontSize: '11px', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Acquisition Progress Track</p>
                  
                  {order.status === 'REJECTED' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e74c3c' }}>
                        <XCircle size={18} />
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>Acquisition Cancelled / Rejected by Seller</span>
                      </div>
                      {order.rejectionReason && (
                        <div style={{ margin: '4px 0', fontSize: '13px', background: 'rgba(231, 76, 60, 0.08)', border: '1px dashed rgba(231, 76, 60, 0.3)', padding: '12px 16px', borderRadius: '8px', color: '#e74c3c', lineHeight: 1.5 }}>
                          <strong>Reason for Rejection:</strong> {order.rejectionReason}
                        </div>
                      )}
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                        Your paid amount of <strong>₹{parseFloat(order.totalAmount).toLocaleString()}</strong> is <strong>100% refunded</strong>. Refund has been completed to your original payment apps.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Visual Timeline Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '10px', paddingBottom: '10px' }}>
                        {/* Progress Connector Line (Background) */}
                        <div style={{ position: 'absolute', top: '10px', left: '5%', right: '5%', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 1 }} />
                        
                        {/* Progress Connector Line (Filled) */}
                        <div style={{ 
                          position: 'absolute', 
                          top: '10px', 
                          left: '5%', 
                          height: '2px', 
                          background: 'var(--gold)', 
                          width: order.status === 'DELIVERED' ? '90%' : order.status === 'SHIPPED' ? '67%' : order.status === 'CONFIRMED' ? '33%' : '0%', 
                          transition: 'width 0.4s ease', 
                          zIndex: 2 
                        }} />
                        
                        {/* Step 1: Placed */}
                        <div style={{ textAlign: 'center', width: '20%', zIndex: 3 }}>
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--gold)', color: '#000', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>✓</div>
                          <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, color: 'var(--gold)' }}>Payment Sent</p>
                        </div>

                        {/* Step 2: Verification */}
                        <div style={{ textAlign: 'center', width: '20%', zIndex: 3 }}>
                          <div style={{ 
                            width: '22px', 
                            height: '22px', 
                            borderRadius: '50%', 
                            background: order.status !== 'PENDING' ? 'var(--gold)' : 'rgba(241, 196, 15, 0.2)', 
                            color: order.status !== 'PENDING' ? '#000' : '#f1c40f', 
                            margin: '0 auto 8px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '11px', 
                            fontWeight: 'bold',
                            border: order.status === 'PENDING' ? '2px solid #f1c40f' : 'none'
                          }}>
                            {order.status !== 'PENDING' ? '✓' : '•'}
                          </div>
                          <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, color: order.status !== 'PENDING' ? 'var(--gold)' : '#f1c40f' }}>Verification</p>
                        </div>

                        {/* Step 3: Packing */}
                        <div style={{ textAlign: 'center', width: '20%', zIndex: 3 }}>
                          <div style={{ 
                            width: '22px', 
                            height: '22px', 
                            borderRadius: '50%', 
                            background: (order.status === 'SHIPPED' || order.status === 'DELIVERED') ? 'var(--gold)' : order.status === 'CONFIRMED' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255,255,255,0.05)', 
                            color: (order.status === 'SHIPPED' || order.status === 'DELIVERED') ? '#000' : order.status === 'CONFIRMED' ? '#2ecc71' : 'var(--text-muted)', 
                            margin: '0 auto 8px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '11px', 
                            fontWeight: 'bold',
                            border: order.status === 'CONFIRMED' ? '2px solid #2ecc71' : '1px solid var(--glass-border)'
                          }}>
                            {(order.status === 'SHIPPED' || order.status === 'DELIVERED') ? '✓' : order.status === 'CONFIRMED' ? '•' : '3'}
                          </div>
                          <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, color: (order.status === 'CONFIRMED' || order.status === 'SHIPPED' || order.status === 'DELIVERED') ? 'var(--gold)' : 'var(--text-muted)' }}>Packaging</p>
                        </div>

                        {/* Step 4: Shipped */}
                        <div style={{ textAlign: 'center', width: '20%', zIndex: 3 }}>
                          <div style={{ 
                            width: '22px', 
                            height: '22px', 
                            borderRadius: '50%', 
                            background: order.status === 'DELIVERED' ? 'var(--gold)' : order.status === 'SHIPPED' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(255,255,255,0.05)', 
                            color: order.status === 'DELIVERED' ? '#000' : order.status === 'SHIPPED' ? '#3498db' : 'var(--text-muted)', 
                            margin: '0 auto 8px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '11px', 
                            fontWeight: 'bold',
                            border: order.status === 'SHIPPED' ? '2px solid #3498db' : '1px solid var(--glass-border)'
                          }}>
                            {order.status === 'DELIVERED' ? '✓' : order.status === 'SHIPPED' ? '•' : '4'}
                          </div>
                          <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, color: (order.status === 'SHIPPED' || order.status === 'DELIVERED') ? 'var(--gold)' : 'var(--text-muted)' }}>In-Transit</p>
                        </div>

                        {/* Step 5: Delivered */}
                        <div style={{ textAlign: 'center', width: '20%', zIndex: 3 }}>
                          <div style={{ 
                            width: '22px', 
                            height: '22px', 
                            borderRadius: '50%', 
                            background: order.status === 'DELIVERED' ? 'var(--gold)' : 'rgba(255,255,255,0.05)', 
                            color: order.status === 'DELIVERED' ? '#000' : 'var(--text-muted)', 
                            margin: '0 auto 8px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '11px', 
                            fontWeight: 'bold',
                            border: order.status === 'DELIVERED' ? 'none' : '1px solid var(--glass-border)'
                          }}>
                            {order.status === 'DELIVERED' ? '✓' : '5'}
                          </div>
                          <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, color: order.status === 'DELIVERED' ? 'var(--gold)' : 'var(--text-muted)' }}>Delivered</p>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
