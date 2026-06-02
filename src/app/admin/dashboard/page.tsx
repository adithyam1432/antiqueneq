'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  CheckCircle, 
  XCircle, 
  Search, 
  BarChart3,
  LogOut,
  RefreshCw,
  ShieldCheck,
  FileText,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  DollarSign
} from 'lucide-react'
import styles from './dashboard.module.css'

type Tab = 'SELLER_REQUESTS' | 'APPROVED_SELLERS' | 'ANTIQUE_REQUESTS' | 'SALES_REPORT'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('SELLER_REQUESTS')
  const [sellers, setSellers] = useState<any[]>([])
  const [antiques, setAntiques] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
       router.push('/login')
    } else if (session?.user && (session.user as any).role !== 'ADMIN') {
       router.push('/')
    } else {
       fetchData()
    }
  }, [status, session])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [sellersRes, antiquesRes, ordersRes] = await Promise.all([
        fetch('/api/admin/sellers'),
        fetch('/api/admin/antiques'),
        fetch('/api/admin/orders')
      ])
      
      const sellersData = await sellersRes.json()
      const antiquesData = await antiquesRes.json()
      const ordersData = await ordersRes.json()
      
      setSellers(Array.isArray(sellersData) ? sellersData : [])
      setAntiques(Array.isArray(antiquesData) ? antiquesData : [])
      setOrders(Array.isArray(ordersData) ? ordersData : [])
    } catch (error) {
      console.error("Failed to fetch admin data", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (type: 'seller' | 'antique', id: string, newStatus: string) => {
    const endpoint = type === 'seller' ? '/api/admin/sellers' : '/api/admin/antiques'
    const body = type === 'seller' ? { userId: id, status: newStatus } : { antiqueId: id, status: newStatus }
    
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.ok) fetchData()
    } catch (error) {
       console.error(`Failed to update ${type} status`, error)
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, rejectionReason?: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus, rejectionReason })
      })
      if (res.ok) {
        fetchData()
      } else {
        const errData = await res.json()
        alert(errData.error || 'Failed to update order status')
      }
    } catch (error) {
       console.error(`Failed to update order status`, error)
    }
  }

  if (loading) {
    return (
      <div className={styles.loader}>
        <RefreshCw className={styles.spin} />
        <p>Loading Admin Console...</p>
      </div>
    )
  }

  const pendingSellers = sellers.filter(s => s.status === 'PENDING')
  const approvedSellers = sellers.filter(s => s.status === 'APPROVED')
  const pendingAntiques = antiques.filter(a => a.status === 'PENDING')
  const pendingOrders = orders.filter(o => o.status === 'PENDING')

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <ShieldCheck className={styles.shield} />
          <div className={styles.adminBadge}>Control Center</div>
        </div>
        
        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'SELLER_REQUESTS' ? styles.active : ''}`}
            onClick={() => setActiveTab('SELLER_REQUESTS')}
          >
            <Users size={18} /> Seller Requests 
            {pendingSellers.length > 0 && <span className={styles.countBadge}>{pendingSellers.length}</span>}
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'APPROVED_SELLERS' ? styles.active : ''}`}
            onClick={() => setActiveTab('APPROVED_SELLERS')}
          >
            <CheckCircle size={18} /> Verified Sellers
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'ANTIQUE_REQUESTS' ? styles.active : ''}`}
            onClick={() => setActiveTab('ANTIQUE_REQUESTS')}
          >
            <Package size={18} /> Antique Approvals
            {pendingAntiques.length > 0 && <span className={styles.countBadge}>{pendingAntiques.length}</span>}
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'SALES_REPORT' ? styles.active : ''}`}
            onClick={() => setActiveTab('SALES_REPORT')}
          >
            <ShoppingCart size={18} /> Sales & Orders
            {pendingOrders.length > 0 && <span className={styles.countBadge} style={{ backgroundColor: '#dfb743', color: '#000' }}>{pendingOrders.length}</span>}
          </button>
        </nav>

        <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: '/' })}>
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <h1 className="gold-gradient">Admin Console</h1>
            <p className={styles.breadcrumb}>Dashboard &gt; {activeTab.replace('_', ' ')}</p>
          </div>
          
          <div className={styles.headerActions}>
            <div className={styles.searchBar}>
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className={styles.refreshBtn} onClick={fetchData}>
              <RefreshCw size={16} />
            </button>
          </div>
        </header>

        <section className={styles.statsStrip}>
           <div className={`glass-card ${styles.statCard}`}>
              <Users color="var(--gold)" />
              <div>
                 <h3>{pendingSellers.length}</h3>
                 <p>Pending Sellers</p>
              </div>
           </div>
           <div className={`glass-card ${styles.statCard}`}>
              <Package color="var(--gold)" />
              <div>
                 <h3>{pendingAntiques.length}</h3>
                 <p>Product Requests</p>
              </div>
           </div>
           <div className={`glass-card ${styles.statCard}`}>
              <ShoppingCart color="var(--gold)" />
              <div>
                 <h3>{pendingOrders.length}</h3>
                 <p>Pending Orders</p>
              </div>
           </div>
        </section>

        <section className={`${styles.tableArea} glass-card`}>
           {activeTab === 'SELLER_REQUESTS' && (
             <Table 
               headers={['Name', 'Email', 'ID Proof', 'Business', 'Action']} 
               data={pendingSellers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))}
               renderRow={(seller) => (
                 <tr key={seller.id}>
                    <td>{seller.name}</td>
                    <td>{seller.email}</td>
                    <td><a href={seller.id_proof_url} target="_blank" className={styles.docLink} rel="noreferrer">View ID</a></td>
                    <td>{seller.business_name || 'N/A'}</td>
                    <td className={styles.actions}>
                       <button className={styles.approveBtn} onClick={() => handleUpdateStatus('seller', seller.id, 'APPROVED')}>Approve</button>
                       <button className={styles.rejectBtn} onClick={() => handleUpdateStatus('seller', seller.id, 'REJECTED')}>Reject</button>
                    </td>
                 </tr>
               )}
             />
           )}

           {activeTab === 'APPROVED_SELLERS' && (
             <Table 
               headers={['Business Name', 'Owner', 'Tax ID', 'Status', 'Manage']} 
               data={approvedSellers}
               renderRow={(seller) => (
                 <tr key={seller.id}>
                    <td>{seller.business_name}</td>
                    <td>{seller.name}</td>
                    <td>{seller.tax_id}</td>
                    <td><span className={styles.statusApproved}>Verified</span></td>
                    <td className="text-right">
                       <button className={styles.deactivateBtn} onClick={() => handleUpdateStatus('seller', seller.id, 'REJECTED')}>Deactivate</button>
                    </td>
                 </tr>
               )}
             />
           )}

           {activeTab === 'ANTIQUE_REQUESTS' && (
             <Table 
               headers={['Antique Item', 'Seller', 'Price', 'Category', 'Action']} 
               data={pendingAntiques}
               renderRow={(item) => (
                 <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.seller_name}</td>
                    <td>₹{item.price.toLocaleString()}</td>
                    <td>{item.category}</td>
                    <td className={styles.actions}>
                       <button className={styles.approveBtn} onClick={() => handleUpdateStatus('antique', item.id, 'APPROVED')}>List Now</button>
                       <button className={styles.rejectBtn} onClick={() => handleUpdateStatus('antique', item.id, 'REJECTED')}>Request Review</button>
                    </td>
                 </tr>
               )}
             />
           )}
           
           {activeTab === 'SALES_REPORT' && (
             <Table 
               headers={['Order ID', 'Item Info', 'Buyer Details', 'Payment Info', 'Total', 'Status', 'Escrow Action']} 
               data={orders.filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()))}
               renderRow={(order) => (
                 <tr key={order.id}>
                    <td style={{ fontSize: '11px', fontFamily: 'monospace' }}>{order.id.substring(0, 12)}...</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {order.productImageUrl && (
                          <img 
                            src={order.productImageUrl} 
                            alt={order.productTitle} 
                            style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '13px', margin: 0 }}>{order.productTitle}</p>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Seller: {order.sellerBusinessName || 'Direct'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p style={{ margin: 0, fontWeight: 500, fontSize: '13px' }}>{order.buyer_name}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={10} /> {order.buyer_email}</span>
                          {order.contactNumber && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={10} /> {order.contactNumber}</span>}
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={10} /> {order.shipping_address}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      {order.paymentMethod === 'qr_code' ? (
                        <div>
                          <span className={styles.badgeQR} style={{ backgroundColor: 'rgba(223, 183, 67, 0.1)', color: 'var(--gold)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>QR Payment</span>
                          {order.transactionId && (
                            <p style={{ fontSize: '11px', margin: '4px 0 0 0', fontFamily: 'monospace' }}>Txn: {order.transactionId}</p>
                          )}
                          {order.receiptUrl && (
                            <a 
                              href={order.receiptUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--gold)', textDecoration: 'underline', marginTop: '4px' }}
                            >
                              <FileText size={10} /> View Receipt <ExternalLink size={8} />
                            </a>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Secure Escrow (Card)</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '13px' }}>₹{parseFloat(order.totalAmount).toLocaleString()}</td>
                    <td>
                      {order.status === 'PENDING' && <span style={{ backgroundColor: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Awaiting Verification</span>}
                      {order.status === 'CONFIRMED' && <span style={{ backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Confirmed</span>}
                      {order.status === 'REJECTED' && (
                        <div>
                          <span style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Rejected (Refunded)</span>
                          {order.rejectionReason && (
                            <p style={{ fontSize: '11px', color: '#e74c3c', marginTop: '6px', maxWidth: '180px', lineHeight: 1.3 }}>
                              <strong>Reason:</strong> {order.rejectionReason}
                            </p>
                          )}
                        </div>
                      )}
                      {order.status === 'SHIPPED' && <span style={{ backgroundColor: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Shipped</span>}
                      {order.status === 'DELIVERED' && <span style={{ backgroundColor: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Delivered</span>}
                    </td>
                    <td className={styles.actions}>
                      {order.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            className={styles.approveBtn} 
                            style={{ padding: '6px 10px', fontSize: '11px' }}
                            onClick={() => handleUpdateOrderStatus(order.id, 'CONFIRMED')}
                          >
                            Accept
                          </button>
                          <button 
                            className={styles.rejectBtn} 
                            style={{ padding: '6px 10px', fontSize: '11px' }}
                            onClick={() => {
                              const reason = prompt('Please enter the reason for rejecting this order (shown to buyer):');
                              if (reason !== null) {
                                handleUpdateOrderStatus(order.id, 'REJECTED', reason);
                              }
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : order.status === 'CONFIRMED' ? (
                        <button 
                          className={styles.approveBtn} 
                          style={{ padding: '6px 10px', fontSize: '11px', backgroundColor: 'var(--gold)', color: '#000' }}
                          onClick={() => handleUpdateOrderStatus(order.id, 'SHIPPED')}
                        >
                          Ship Order
                        </button>
                      ) : order.status === 'SHIPPED' ? (
                        <button 
                          className={styles.approveBtn} 
                          style={{ padding: '6px 10px', fontSize: '11px', backgroundColor: '#9b59b6' }}
                          onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                        >
                          Deliver Item
                        </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Verified & Locked</span>
                      )}
                    </td>
                 </tr>
               )}
             />
           )}
        </section>
      </main>
    </div>
  )
}

function Table({ headers, data, renderRow }: { headers: string[], data: any[], renderRow: (item: any) => React.ReactNode }) {
  if (data.length === 0) return <div className={styles.emptyState}>No records found.</div>
  return (
    <table className={styles.table}>
      <thead>
        <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
      </thead>
      <tbody>{data.map(renderRow)}</tbody>
    </table>
  )
}
