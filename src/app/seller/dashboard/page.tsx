'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  History,
  CheckCircle2,
  DollarSign
} from 'lucide-react'
import styles from './seller.module.css'

type Tab = 'OVERVIEW' | 'LISTINGS' | 'ADD_ITEM' | 'PAYOUTS'

export default function SellerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW')
  const [listings, setListings] = useState<any[]>([])
  const [payouts, setPayouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Real-time status from session
  const sellerStatus = (session?.user as any)?.status || 'PENDING'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user && (session.user as any).role !== 'SELLER') {
      router.push('/')
    } else if (sellerStatus === 'APPROVED') {
      fetchListings()
    }
  }, [status, session, sellerStatus])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/seller/antiques')
      const data = await res.json()
      setListings(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error("Listings fetch failed", e)
    } finally {
      setLoading(false)
    }
  }

  const fetchPayouts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/seller/payouts')
      const data = await res.json()
      setPayouts(data.success ? data.payouts : [])
    } catch (e) {
      console.error("Payouts fetch failed", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'LISTINGS') fetchListings()
    if (activeTab === 'PAYOUTS') fetchPayouts()
  }, [activeTab])

  if (status === 'loading') return <div className={styles.loader}>Synchronizing...</div>

  if (sellerStatus !== 'APPROVED') {
    return (
      <div className={styles.pendingWrapper}>
        <div className="glass-card p-40 text-center max-w-600">
          <Clock size={64} color="var(--gold)" className="mx-auto mb-20" />
          <h1 className="gold-gradient">Verification in Progress</h1>
          <p className="mb-20 text-muted">
            Our curation team is verifying your credentials and identification documents. 
            You will receive a notification once your professional seller hub is activated.
          </p>
          <div className={styles.pendingAlert}>
             <AlertTriangle size={20} />
             <span>Estimated activation: 24-48 business hours.</span>
          </div>
          <button className="button-premium mt-20" onClick={() => signOut()}>
             Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <History className={styles.logoIcon} />
          <span>Seller Hub</span>
        </div>
        
        <nav className={styles.sideNav}>
          <button 
            className={activeTab === 'OVERVIEW' ? styles.active : ''}
            onClick={() => setActiveTab('OVERVIEW')}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button 
            className={activeTab === 'LISTINGS' ? styles.active : ''}
            onClick={() => setActiveTab('LISTINGS')}
          >
            <Package size={18} /> My Listings
          </button>
          <button 
            className={activeTab === 'ADD_ITEM' ? styles.active : ''}
            onClick={() => setActiveTab('ADD_ITEM')}
          >
            <PlusCircle size={18} /> Add New Item
          </button>
          <button 
            className={activeTab === 'PAYOUTS' ? styles.active : ''}
            onClick={() => setActiveTab('PAYOUTS')}
          >
            <DollarSign size={18} /> Financials
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logout} onClick={() => signOut()}><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      <main className={styles.content}>
        <header className={styles.topBar}>
          <h1 className="gold-gradient">{activeTab.replace('_', ' ')}</h1>
          <div className={styles.userProfile}>
             <div className={styles.verifiedBadge}><CheckCircle2 size={14} /> Verified Partner</div>
             <span>ID: {(session?.user as any)?.id}</span>
          </div>
        </header>

        {activeTab === 'OVERVIEW' && (
          <section className={styles.dashboardView}>
            <div className={styles.statsGrid}>
              <div className="glass-card p-24">
                <TrendingUp size={32} color="var(--gold)" />
                <p className="text-muted mt-12">Account Standing</p>
                <h3>EXCELLENT</h3>
              </div>
              <div className="glass-card p-24">
                <Package size={32} color="var(--gold)" />
                <p className="text-muted mt-12">Listed Antiques</p>
                <h3>{listings.length} items</h3>
              </div>
            </div>
            
            <div className="glass-card p-30 mt-30">
               <h2 className="gold-gradient mb-10">Exclusive Access</h2>
               <p className="text-muted">You are part of our premium curated partners network. Start listing your rare artifacts to reach high-value collectors worldwide.</p>
               <button className="button-premium mt-20" onClick={() => setActiveTab('ADD_ITEM')}>
                  Submit New Artifact
               </button>
            </div>
          </section>
        )}

        {activeTab === 'LISTINGS' && (
          <section className={styles.listingsView}>
            {loading ? <RefreshCw className={styles.spin} /> : (
              <div className={styles.listingGrid}>
                {listings.length === 0 ? <p className="text-muted">No items submitted yet.</p> : listings.map(item => (
                  <div key={item.id} className={`${styles.itemCard} glass-card`}>
                    <div className={styles.itemHeader}>
                      <span className={styles.category}>{item.category}</span>
                      <span className={`${styles.status} styles[item.status]`}>{item.status}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p className={styles.price}>₹{item.price.toLocaleString()}</p>
                    <p className={styles.date}>Listed: {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'PAYOUTS' && (
          <section className={styles.payoutsView}>
            <div className="glass-card p-30 mb-20">
               <h2 className="gold-gradient mb-10"><DollarSign size={24} className="inline mr-10" /> Escrow & Payouts</h2>
               <p className="text-muted">Track the financial status of your sold artifacts. Funds held in escrow are released to your registered payment method automatically once buyer confirms delivery.</p>
            </div>
            {loading ? <RefreshCw className={styles.spin} /> : (
              <div className={styles.listingGrid}>
                {payouts.length === 0 ? <p className="text-muted">No payouts yet. Start selling!</p> : payouts.map(p => (
                  <div key={p.id} className={`${styles.itemCard} glass-card`}>
                    <div className={styles.itemHeader}>
                      <span className={styles.category}>{p.status}</span>
                      <span className="font-bold">₹{p.amount.toLocaleString()}</span>
                    </div>
                    <h3>{p.product_title}</h3>
                    <p className={styles.date}>Created: {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'ADD_ITEM' && <AddItemForm onSuccess={() => {setActiveTab('LISTINGS'); fetchListings();}} />}
      </main>
    </div>
  )
}

function AddItemForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Ceramics',
    imageUrl: ''
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/seller/antiques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: Number(formData.price) })
      })
      if (res.ok) onSuccess()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className={`${styles.addForm} glass-card`} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>Artifact Title</label>
        <input 
          required 
          placeholder="e.g. Mughal Dynasty Gold Coin" 
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Detailed Provenance & Description</label>
        <textarea 
          required 
          rows={4}
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label>Starting Price (₹)</label>
          <input 
            type="number" 
            required 
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Category</label>
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option>Ceramics</option>
            <option>Coins</option>
            <option>Furniture</option>
            <option>Art</option>
            <option>Jewelry</option>
          </select>
        </div>
      </div>
      <button type="submit" className="button-premium w-full mt-20" disabled={saving}>
        {saving ? 'Validating...' : 'Submit for Verification'}
      </button>
    </form>
  )
}
