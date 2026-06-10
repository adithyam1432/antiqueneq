'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard,
  Package, 
  Database,
  ShoppingCart, 
  Search, 
  LogOut,
  RefreshCw,
  ShieldCheck,
  FileText,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  X
} from 'lucide-react'
import styles from './dashboard.module.css'

type Tab = 'OVERVIEW' | 'LISTED_ANTIQUES' | 'SALES_REPORT'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW')
  const [antiques, setAntiques] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [listSearchTerm, setListSearchTerm] = useState('')
  const [listCategoryFilter, setListCategoryFilter] = useState('All')

  // Tooltip State
  const [tooltip, setTooltip] = useState<{
    show: boolean
    x: number
    y: number
    title: string
    content: string
  }>({ show: false, x: 0, y: 0, title: '', content: '' })

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentAntique, setCurrentAntique] = useState<any>(null)
  const [customCategory, setCustomCategory] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Ceramics',
    image_url: '',
    status: 'APPROVED',
    year_created: 'Circa 1850',
    stock: '1'
  })

  const createFileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

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
      const [antiquesRes, ordersRes] = await Promise.all([
        fetch('/api/admin/antiques'),
        fetch('/api/admin/orders')
      ])
      
      const antiquesData = await antiquesRes.json()
      const ordersData = await ordersRes.json()
      
      setAntiques(Array.isArray(antiquesData) ? antiquesData : [])
      setOrders(Array.isArray(ordersData) ? ordersData : [])
    } catch (error) {
       console.error("Failed to fetch admin data", error)
    } finally {
       setLoading(false)
    }
  }

  const handleUpdateStatus = async (type: 'antique', id: string, newStatus: string) => {
    const endpoint = '/api/admin/antiques'
    const body = { antiqueId: id, status: newStatus }
    
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

  const handleDeleteAntique = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this antique item?")) return
    try {
      const res = await fetch(`/api/admin/antiques?id=${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        fetchData()
      } else {
        const errData = await res.json()
        alert(errData.error || 'Failed to delete antique')
      }
    } catch (error) {
      console.error("Failed to delete antique", error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Image file size must be less than 10MB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateAntique = async (e: React.FormEvent) => {
    e.preventDefault()
    const categoryToSend = formData.category === 'custom_new' ? customCategory.trim() : formData.category
    if (!formData.title || !formData.price || !categoryToSend) {
      alert("Please fill in all required fields.")
      return
    }

    try {
      const res = await fetch('/api/admin/antiques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category: categoryToSend,
          price: parseFloat(formData.price)
        })
      })
      if (res.ok) {
        setIsCreateModalOpen(false)
        fetchData()
      } else {
        const errData = await res.json()
        alert(errData.error || 'Failed to create antique')
      }
    } catch (error) {
      console.error("Failed to create antique", error)
    }
  }

  const handleUpdateAntique = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentAntique) return
    const categoryToSend = formData.category === 'custom_new' ? customCategory.trim() : formData.category
    if (!formData.title || !formData.price || !categoryToSend) {
      alert("Please fill in all required fields.")
      return
    }

    try {
      const res = await fetch('/api/admin/antiques', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentAntique.id,
          ...formData,
          category: categoryToSend,
          price: parseFloat(formData.price)
        })
      })
      if (res.ok) {
        setIsEditModalOpen(false)
        fetchData()
      } else {
        const errData = await res.json()
        alert(errData.error || 'Failed to update antique')
      }
    } catch (error) {
      console.error("Failed to update antique", error)
    }
  }

  const openCreateModal = () => {
    setCustomCategory('')
    setFormData({
      title: '',
      description: '',
      price: '',
      category: 'Ceramics',
      image_url: '',
      status: 'APPROVED',
      year_created: 'Circa 1850',
      stock: '1'
    })
    setIsCreateModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setCurrentAntique(item)
    setCustomCategory('')
    setFormData({
      title: item.title,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category || 'Ceramics',
      image_url: item.image_url || '',
      status: item.status || 'APPROVED',
      year_created: item.year_created || 'Circa 1850',
      stock: (item.stock || 1).toString()
    })
    setIsEditModalOpen(true)
  }

  // Tooltip mouse handlers
  const handleMouseEnter = (e: React.MouseEvent, title: string, content: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const container = document.getElementById('dashboard-main-content')
    if (container) {
      const containerRect = container.getBoundingClientRect()
      const x = rect.left - containerRect.left + rect.width / 2
      const y = rect.top - containerRect.top - 8
      setTooltip({ show: true, x, y, title, content })
    }
  }

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }))
  }

  if (loading) {
    return (
      <div className={styles.loader}>
        <RefreshCw className={styles.spin} />
        <p>Loading Admin Console...</p>
      </div>
    )
  }

  // Aggregated calculations for Stats
  const activeOrders = orders.filter(o => o.status !== 'REJECTED' && o.status !== 'RETURNED')
  const totalSales = activeOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0)
  const totalCommission = activeOrders.reduce((sum, o) => sum + parseFloat(o.commissionEarned || 0), 0)
  const totalLosses = orders.filter(o => o.status === 'REJECTED' || o.status === 'RETURNED').reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0)
  const totalProducts = antiques.length

  const pendingAntiques = antiques.filter(a => a.status === 'PENDING')
  const pendingOrders = orders.filter(o => o.status === 'PENDING')

  // Filtering listed antiques
  const filteredListedAntiques = antiques.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(listSearchTerm.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(listSearchTerm.toLowerCase())) ||
      (a.seller_name && a.seller_name.toLowerCase().includes(listSearchTerm.toLowerCase()))
    const matchesCategory = listCategoryFilter === 'All' || a.category === listCategoryFilter
    return matchesSearch && matchesCategory
  })

  // Chart 1: Sales Trends (Line Chart) data aggregation
  const salesByISODate = orders
    .filter(o => o.status !== 'REJECTED' && o.status !== 'RETURNED')
    .reduce((acc: any, o: any) => {
      const dateStr = new Date(o.createdAt).toISOString().split('T')[0]
      acc[dateStr] = (acc[dateStr] || 0) + parseFloat(o.totalAmount)
      return acc
    }, {})

  const linePoints = Object.entries(salesByISODate)
    .map(([dateStr, val]: any) => ({
      dateStr,
      label: new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: val
    }))
    .sort((a, b) => a.dateStr.localeCompare(b.dateStr))

  const displayLinePoints = linePoints
  const maxLineVal = Math.max(...displayLinePoints.map(p => p.value), 10000)

  // Calculate coordinates for line path
  const coords = displayLinePoints.map((p, i) => {
    const denom = displayLinePoints.length > 1 ? displayLinePoints.length - 1 : 1
    const x = displayLinePoints.length === 1 ? 280 : 80 + (i / denom) * 390
    const y = 170 - (p.value / maxLineVal) * 140
    return { x, y, label: p.label, value: p.value }
  })

  let pathD = ''
  let areaD = 'M 80 170 '
  coords.forEach((c, i) => {
    if (i === 0) {
      pathD += `M ${c.x} ${c.y} `
    } else {
      const prev = coords[i - 1]
      const cpX1 = prev.x + (c.x - prev.x) / 3
      const cpY1 = prev.y
      const cpX2 = prev.x + (c.x - prev.x) * 2 / 3
      const cpY2 = c.y
      pathD += `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${c.x} ${c.y} `
    }
    areaD += `L ${c.x} ${c.y} `
  })
  if (coords.length > 0) {
    areaD += `L ${coords[coords.length - 1].x} 170 Z`
  }

  // Chart 2: Category sales & commission (Bar Chart) data aggregation
  const baseCategories = ['Ceramics', 'Metalware', 'Furniture', 'Horology', 'Paintings']
  const categories = Array.from(new Set([
    ...baseCategories,
    ...antiques.map((a: any) => a.category).filter(Boolean)
  ]))
  
  const antiqueToCategoryMap = antiques.reduce((acc, a) => {
    acc[a.id] = a.category
    return acc
  }, {} as any)

  const catSales = categories.map(cat => {
    const catOrders = orders.filter(o => o.status !== 'REJECTED' && (o.productCategory === cat || antiqueToCategoryMap[o.productId] === cat))
    const sales = catOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0)
    const commission = catOrders.reduce((sum, o) => sum + parseFloat(o.commissionEarned || 0), 0)
    return { category: cat, sales, commission }
  })

  const totalRealCatSales = catSales.reduce((sum, item) => sum + item.sales, 0)
  
  const displayCatSales = catSales
  const maxCatVal = Math.max(...displayCatSales.map(c => c.sales), 10000)

  // Chart 3: Category Inventory Split (Donut Chart)
  const catCounts = categories.map(cat => {
    const count = antiques.filter(a => a.category === cat).length
    return { category: cat, count }
  })
  
  const displayCatCounts = catCounts
  const totalDisplayCounts = displayCatCounts.reduce((sum, item) => sum + item.count, 0)

  const donutColors = ['#dfb743', '#f4e1a6', '#a87e22', '#a27b38', '#cbb26a']
  let currentOffset = 0
  const donutSegments = displayCatCounts.map((item, idx) => {
    const pct = totalDisplayCounts > 0 ? item.count / totalDisplayCounts : 0
    const strokeLength = pct * 377
    const strokeOffset = 377 - currentOffset
    currentOffset += strokeLength
    return {
      category: item.category,
      count: item.count,
      pct,
      strokeLength,
      strokeOffset,
      color: donutColors[idx % donutColors.length]
    }
  })

  // Chart 4: Sales vs Loss comparison chart
  const displaySalesVal = totalSales
  const displayLossVal = totalLosses
  const maxCompVal = Math.max(displaySalesVal, displayLossVal, 10000)

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <ShieldCheck className={styles.shield} />
          <div className={styles.adminBadge}>Control Center</div>
        </div>
        
        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'OVERVIEW' ? styles.active : ''}`}
            onClick={() => { setActiveTab('OVERVIEW'); setSearchTerm(''); }}
          >
            <LayoutDashboard size={18} /> OVERVIEW
          </button>

          <button 
            className={`${styles.navItem} ${activeTab === 'LISTED_ANTIQUES' ? styles.active : ''}`}
            onClick={() => { setActiveTab('LISTED_ANTIQUES'); setSearchTerm(''); }}
          >
            <Database size={18} /> LISTED_ANTIQUES
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === 'SALES_REPORT' ? styles.active : ''}`}
            onClick={() => { setActiveTab('SALES_REPORT'); setSearchTerm(''); }}
          >
            <ShoppingCart size={18} /> SALES_REPORT
            {pendingOrders.length > 0 && <span className={styles.countBadge} style={{ backgroundColor: '#dfb743', color: '#000' }}>{pendingOrders.length}</span>}
          </button>
        </nav>

        <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: '/' })}>
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      <main id="dashboard-main-content" className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <h1 className="gold-gradient">Admin Console</h1>
            <p className={styles.breadcrumb}>Dashboard &gt; {activeTab.replace('_', ' ')}</p>
          </div>
          
          <div className={styles.headerActions}>
            {activeTab === 'SALES_REPORT' && (
              <div className={styles.searchBar}>
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search buyer or order..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            <button className={styles.refreshBtn} onClick={fetchData}>
              <RefreshCw size={16} />
            </button>
          </div>
        </header>

        {/* Global Stats Strip */}
        <section className={styles.statsStrip}>
           <div className={`glass-card ${styles.statCard}`}>
              <ShoppingCart color="var(--gold)" />
              <div>
                 <h3>₹{totalSales.toLocaleString()}</h3>
                 <p>Total Revenue</p>
              </div>
           </div>
           <div className={`glass-card ${styles.statCard}`}>
              <ShieldCheck color="var(--gold)" />
              <div>
                 <h3>₹{totalCommission.toLocaleString()}</h3>
                 <p>Commission Earned</p>
              </div>
           </div>
           <div className={`glass-card ${styles.statCard}`}>
              <Package color="var(--gold)" />
              <div>
                 <h3>₹{totalLosses.toLocaleString()}</h3>
                 <p>Losses & Refunds</p>
              </div>
           </div>
           <div className={`glass-card ${styles.statCard}`}>
              <Database color="var(--gold)" />
              <div>
                 <h3>{totalProducts}</h3>
                 <p>Listed Masterpieces</p>
              </div>
           </div>
        </section>

        {/* OVERVIEW TAB - Beautiful Interactive SVG Charts */}
        {activeTab === 'OVERVIEW' && (
          <div className={styles.chartsGrid}>
            {/* Chart 1: Sales Trends (Line Chart) */}
            <div className={`glass-card ${styles.chartCard}`}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Sales Trends (Recent Orders)</h3>
                <div className={styles.chartLegends}>
                  <div className={styles.chartLegendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: 'var(--gold)' }}></span>
                    <span>Daily Sales (₹)</span>
                  </div>
                </div>
              </div>
              <svg className={styles.chartSvg} viewBox="0 0 500 200">
                <defs>
                  <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lineStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--gold-dark)" />
                    <stop offset="50%" stopColor="var(--gold)" />
                    <stop offset="100%" stopColor="var(--gold-light)" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="var(--gold)" floodOpacity="0.5" />
                  </filter>
                </defs>
                
                {/* Grid lines */}
                <line x1="80" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <line x1="80" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <line x1="80" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <line x1="80" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.12)" />

                {coords.length === 0 && (
                  <text x="280" y="100" fill="var(--text-muted)" fontSize="12" textAnchor="middle" opacity="0.6">
                    No sales recorded in database.
                  </text>
                )}

                {/* Y Axis Grid Labels */}
                <text x="70" y="24" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹{maxLineVal >= 1000 ? `${Math.round(maxLineVal / 1000)}k` : maxLineVal}</text>
                <text x="70" y="74" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹{maxLineVal >= 1000 ? `${Math.round(maxLineVal * 0.66 / 1000)}k` : Math.round(maxLineVal * 0.66)}</text>
                <text x="70" y="124" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹{maxLineVal >= 1000 ? `${Math.round(maxLineVal * 0.33 / 1000)}k` : Math.round(maxLineVal * 0.33)}</text>
                <text x="70" y="174" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹0</text>

                {/* Area path */}
                {coords.length > 0 && (
                  <path d={areaD} fill="url(#lineAreaGrad)" />
                )}

                {/* Line path */}
                {coords.length > 0 && (
                  <path 
                    d={pathD} 
                    fill="none" 
                    stroke="url(#lineStrokeGrad)" 
                    strokeWidth="3" 
                    filter="url(#glow)"
                    className={styles.chartPath}
                  />
                )}

                {/* Value indicators on points */}
                {coords.map((c, i) => (
                  <text
                    key={`val-${i}`}
                    x={c.x}
                    y={c.y - 10}
                    fill="var(--gold-light)"
                    fontSize="8"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    ₹{c.value >= 1000 ? `${Math.round(c.value / 1000)}k` : c.value}
                  </text>
                ))}

                {/* Interactive Points */}
                {coords.map((c, i) => (
                  <circle
                    key={i}
                    cx={c.x}
                    cy={c.y}
                    r="5"
                    fill="var(--gold)"
                    stroke="var(--background)"
                    strokeWidth="2"
                    className={styles.chartDot}
                    onMouseEnter={(e) => handleMouseEnter(e, c.label, `Revenue: ₹${c.value.toLocaleString()}`)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))}

                {/* X Axis Labels */}
                {coords.map((c, i) => (
                  <text
                    key={i}
                    x={c.x}
                    y="190"
                    fill="var(--text-muted)"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {c.label}
                  </text>
                ))}
              </svg>
            </div>

            {/* Chart 2: Category Sales vs Commission (Bar Chart) */}
            <div className={`glass-card ${styles.chartCard}`}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Category Performance</h3>
                <div className={styles.chartLegends}>
                  <div className={styles.chartLegendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: 'var(--gold)' }}></span>
                    <span>Sales</span>
                  </div>
                  <div className={styles.chartLegendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: '#a87e22' }}></span>
                    <span>Commission</span>
                  </div>
                </div>
              </div>
              <svg className={styles.chartSvg} viewBox="0 0 500 200">
                {/* Grid lines */}
                <line x1="80" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <line x1="80" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <line x1="80" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <line x1="80" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.12)" />

                {totalRealCatSales === 0 && (
                  <text x="280" y="100" fill="var(--text-muted)" fontSize="12" textAnchor="middle" opacity="0.6">
                    No category sales recorded.
                  </text>
                )}

                {/* Y Axis Grid Labels */}
                <text x="70" y="24" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹{maxCatVal >= 1000 ? `${Math.round(maxCatVal / 1000)}k` : maxCatVal}</text>
                <text x="70" y="74" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹{maxCatVal >= 1000 ? `${Math.round(maxCatVal * 0.66 / 1000)}k` : Math.round(maxCatVal * 0.66)}</text>
                <text x="70" y="124" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹{maxCatVal >= 1000 ? `${Math.round(maxCatVal * 0.33 / 1000)}k` : Math.round(maxCatVal * 0.33)}</text>
                <text x="70" y="174" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹0</text>

                {/* Bars */}
                {displayCatSales.map((item, i) => {
                  const groupCenterX = 80 + i * 78 + 39
                  const salesHeight = (item.sales / maxCatVal) * 140
                  const commHeight = (item.commission / maxCatVal) * 140

                  return (
                    <g key={i}>
                      {/* Sales Bar */}
                      <rect
                        x={groupCenterX - 18}
                        y={170 - salesHeight}
                        width="15"
                        height={salesHeight || 2}
                        fill="url(#lineStrokeGrad)"
                        rx="3"
                        className={styles.chartBarRect}
                        onMouseEnter={(e) => handleMouseEnter(e, item.category, `Total Sales: ₹${item.sales.toLocaleString()}`)}
                        onMouseLeave={handleMouseLeave}
                      />
                      {/* Exact Sales text label */}
                      {item.sales > 0 && (
                        <text
                          x={groupCenterX - 10}
                          y={170 - salesHeight - 4}
                          fill="var(--gold-light)"
                          fontSize="7"
                          fontWeight="600"
                          textAnchor="middle"
                        >
                          ₹{item.sales >= 1000 ? `${Math.round(item.sales / 1000)}k` : item.sales}
                        </text>
                      )}

                      {/* Commission Bar */}
                      <rect
                        x={groupCenterX + 3}
                        y={170 - commHeight}
                        width="15"
                        height={commHeight || 2}
                        fill="#a87e22"
                        rx="3"
                        className={styles.chartBarRect}
                        onMouseEnter={(e) => handleMouseEnter(e, item.category, `Commission Earned: ₹${item.commission.toLocaleString()}`)}
                        onMouseLeave={handleMouseLeave}
                      />
                      {/* Exact Commission text label */}
                      {item.commission > 0 && (
                        <text
                          x={groupCenterX + 10}
                          y={170 - commHeight - 4}
                          fill="#a87e22"
                          fontSize="6.5"
                          fontWeight="600"
                          textAnchor="middle"
                        >
                          ₹{item.commission >= 1000 ? `${Math.round(item.commission / 1000)}k` : item.commission}
                        </text>
                      )}

                      {/* Label */}
                      <text
                        x={groupCenterX}
                        y="190"
                        fill="var(--text-muted)"
                        fontSize="9"
                        textAnchor="middle"
                      >
                        {item.category}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Chart 3: Category Inventory Split (Donut Chart) */}
            <div className={`glass-card ${styles.chartCard}`}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Inventory Split by Category</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total: {totalDisplayCounts} items</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <svg className={styles.chartSvg} viewBox="0 0 280 220" style={{ maxWidth: '180px' }}>
                  <g transform="rotate(-90 140 110)">
                    {/* Background track */}
                    <circle
                      cx="140"
                      cy="110"
                      r="60"
                      fill="transparent"
                      stroke="rgba(255,255,255,0.02)"
                      strokeWidth="15"
                    />
                    {/* Active segments */}
                    {donutSegments.map((seg, i) => (
                      <circle
                        key={i}
                        cx="140"
                        cy="110"
                        r="60"
                        fill="transparent"
                        stroke={seg.color}
                        strokeWidth="15"
                        strokeDasharray={`${seg.strokeLength} 377`}
                        strokeDashoffset={seg.strokeOffset}
                        strokeLinecap="butt"
                        className={styles.chartDonutSegment}
                        onMouseEnter={(e) => handleMouseEnter(e, seg.category, `Count: ${seg.count} artifacts (${Math.round(seg.pct * 100)}%)`)}
                        onMouseLeave={handleMouseLeave}
                      />
                    ))}
                  </g>
                  {/* Center metrics */}
                  <text x="140" y="105" fill="var(--gold)" fontSize="18" fontWeight="bold" textAnchor="middle">
                    {totalDisplayCounts}
                  </text>
                  <text x="140" y="125" fill="var(--text-muted)" fontSize="9" textAnchor="middle">
                    Artifacts
                  </text>
                </svg>

                {/* Donut Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, paddingRight: '10px' }}>
                  {donutSegments.map((seg, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        fontSize: '12px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        transition: 'all 0.3s ease'
                      }}
                      className={styles.donutLegendCard}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={styles.legendDot} style={{ backgroundColor: seg.color, width: '8px', height: '8px' }}></span>
                        <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{seg.category}</span>
                      </div>
                      <span style={{ color: 'var(--gold)', fontWeight: 600 }}>
                        {seg.count} <span style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 400 }}>({Math.round(seg.pct * 100)}%)</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 4: Sales vs Loss comparison chart */}
            <div className={`glass-card ${styles.chartCard}`}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Revenue vs Losses/Refunds</h3>
                <div className={styles.chartLegends}>
                  <div className={styles.chartLegendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: 'var(--gold)' }}></span>
                    <span>Revenue</span>
                  </div>
                  <div className={styles.chartLegendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: '#ef4444' }}></span>
                    <span>Refunds</span>
                  </div>
                </div>
              </div>

              {/* Net Yield margin badge */}
              <div style={{ position: 'absolute', top: '16px', right: '24px', textAlign: 'right' }}>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Yield (Profit)</span>
                <h4 style={{ color: (displaySalesVal - displayLossVal) >= 0 ? '#2ecc71' : '#e74c3c', fontSize: '15px', margin: '2px 0 0 0', fontWeight: 'bold' }}>
                  ₹{(displaySalesVal - displayLossVal).toLocaleString()}
                </h4>
              </div>

              <svg className={styles.chartSvg} viewBox="0 0 500 200">
                <defs>
                  <linearGradient id="refundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff4d4d" />
                    <stop offset="100%" stopColor="#c0392b" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="80" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <line x1="80" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <line x1="80" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <line x1="80" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.12)" />

                {displaySalesVal === 0 && displayLossVal === 0 && (
                  <text x="280" y="100" fill="var(--text-muted)" fontSize="12" textAnchor="middle" opacity="0.6">
                    No financial data available.
                  </text>
                )}

                {/* Y Axis Grid Labels */}
                <text x="70" y="24" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹{maxCompVal >= 1000 ? `${Math.round(maxCompVal / 1000)}k` : maxCompVal}</text>
                <text x="70" y="74" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹{maxCompVal >= 1000 ? `${Math.round(maxCompVal * 0.66 / 1000)}k` : Math.round(maxCompVal * 0.66)}</text>
                <text x="70" y="124" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹{maxCompVal >= 1000 ? `${Math.round(maxCompVal * 0.33 / 1000)}k` : Math.round(maxCompVal * 0.33)}</text>
                <text x="70" y="174" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹0</text>

                {/* Active sales column */}
                <rect
                  x="160"
                  y={170 - (displaySalesVal / maxCompVal) * 140}
                  width="50"
                  height={(displaySalesVal / maxCompVal) * 140 || 2}
                  fill="url(#lineStrokeGrad)"
                  rx="6"
                  className={styles.chartBarRect}
                  onMouseEnter={(e) => handleMouseEnter(e, 'Active Revenue', `Total: ₹${displaySalesVal.toLocaleString()}`)}
                  onMouseLeave={handleMouseLeave}
                />
                <text
                  x="185"
                  y={160 - (displaySalesVal / maxCompVal) * 140}
                  fill="var(--gold-light)"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ₹{displaySalesVal >= 1000 ? `${Math.round(displaySalesVal / 1000)}k` : displaySalesVal}
                </text>
                <text x="185" y="190" fill="var(--text-muted)" fontSize="10" textAnchor="middle">
                  Active Revenue
                </text>

                {/* Losses/Refunds column */}
                <rect
                  x="310"
                  y={170 - (displayLossVal / maxCompVal) * 140}
                  width="50"
                  height={(displayLossVal / maxCompVal) * 140 || 2}
                  fill="url(#refundGrad)"
                  rx="6"
                  className={styles.chartBarRect}
                  onMouseEnter={(e) => handleMouseEnter(e, 'Refunds & Losses', `Total: ₹${displayLossVal.toLocaleString()}`)}
                  onMouseLeave={handleMouseLeave}
                />
                <text
                  x="335"
                  y={160 - (displayLossVal / maxCompVal) * 140}
                  fill="#ff4d4d"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ₹{displayLossVal >= 1000 ? `${Math.round(displayLossVal / 1000)}k` : displayLossVal}
                </text>
                <text x="335" y="190" fill="var(--text-muted)" fontSize="10" textAnchor="middle">
                  Refunds & Losses
                </text>
              </svg>
            </div>

            {/* Quick Action Center: Pending Verification Orders */}
            {pendingOrders.length > 0 && (
              <div className="glass-card" style={{ padding: '24px', gridColumn: 'span 2', marginTop: '12px' }}>
                <h3 className="gold-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '18px' }}>
                  <ShieldCheck size={20} color="var(--gold)" /> Action Center: Awaiting Payment Verification ({pendingOrders.length})
                </h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th style={{ background: '#0f1311' }}>Order ID</th>
                        <th style={{ background: '#0f1311' }}>Item Info</th>
                        <th style={{ background: '#0f1311' }}>Buyer</th>
                        <th style={{ background: '#0f1311' }}>Payment Proof</th>
                        <th style={{ background: '#0f1311' }}>Total</th>
                        <th style={{ background: '#0f1311', textAlign: 'right' }}>Verify Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingOrders.slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td style={{ fontSize: '11px', fontFamily: 'monospace' }}>{order.id.substring(0, 8)}...</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {order.productImageUrl && (
                                <img 
                                  src={order.productImageUrl} 
                                  alt={order.productTitle} 
                                  style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }}
                                />
                              )}
                              <span style={{ fontWeight: 600, fontSize: '12px' }}>{order.productTitle}</span>
                            </div>
                          </td>
                          <td style={{ fontSize: '12px' }}>{order.buyer_name}</td>
                          <td>
                            {order.receiptUrl ? (
                              <a 
                                href={order.receiptUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--gold)', textDecoration: 'underline' }}
                              >
                                <FileText size={10} /> View Receipt <ExternalLink size={8} />
                              </a>
                            ) : (
                              <span style={{ fontSize: '11px', color: '#e67e22', fontStyle: 'italic' }}>No screenshot</span>
                            )}
                          </td>
                          <td style={{ fontWeight: 600, fontSize: '12px' }}>₹{parseFloat(order.totalAmount).toLocaleString()}</td>
                          <td className={styles.actions}>
                            <button 
                              className={styles.approveBtn} 
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              onClick={() => handleUpdateOrderStatus(order.id, 'CONFIRMED')}
                            >
                              Accept
                            </button>
                            <button 
                              className={styles.rejectBtn} 
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              onClick={() => {
                                const reason = prompt('Please enter the reason for rejecting this order (shown to buyer):');
                                if (reason !== null) {
                                  handleUpdateOrderStatus(order.id, 'REJECTED', reason);
                                }
                              }}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LISTED ANTIQUES TAB */}
        {activeTab === 'LISTED_ANTIQUES' && (
          <section className="glass-card" style={{ padding: '24px' }}>
            <div className={styles.listControls}>
              <div className={styles.listSearch}>
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search listed items by name, description..." 
                  value={listSearchTerm}
                  onChange={(e) => setListSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className={styles.listFilter} 
                value={listCategoryFilter} 
                onChange={(e) => setListCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <button className={styles.addBtn} onClick={openCreateModal}>
                <Plus size={16} /> Add Antique
              </button>
            </div>

            <Table 
              headers={['Image', 'Title', 'Price', 'Category', 'Status', 'Creator', 'Action']} 
              data={filteredListedAntiques}
              renderRow={(item) => (
                <tr key={item.id}>
                   <td>
                     {item.image_url ? (
                       <img 
                         src={item.image_url} 
                         alt={item.title} 
                         style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                       />
                     ) : (
                       <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>None</div>
                     )}
                   </td>
                   <td style={{ fontWeight: 600 }}>{item.title}</td>
                   <td>₹{item.price.toLocaleString()}</td>
                   <td>
                     <span className={styles.adminBadge} style={{ fontSize: '10px' }}>{item.category}</span>
                   </td>
                   <td>
                      {item.status === 'APPROVED' && <span className={styles.statusApproved}>Listed</span>}
                      {item.status === 'PENDING' && <span style={{ color: '#f1c40f', fontWeight: 600 }}>Pending Approval</span>}
                      {item.status === 'REJECTED' && <span style={{ color: '#e74c3c', fontWeight: 600 }}>Rejected</span>}
                      {item.status === 'SOLD' && <span style={{ color: '#9b59b6', fontWeight: 600 }}>Sold Out</span>}
                   </td>
                   <td>{item.seller_name || 'Admin'}</td>
                   <td className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEditModal(item)}>
                        <Edit size={12} style={{ marginRight: '4px' }} /> Edit
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDeleteAntique(item.id)}>
                        <Trash2 size={12} style={{ marginRight: '4px' }} /> Delete
                      </button>
                   </td>
                </tr>
              )}
            />
          </section>
        )}
        
        {/* SALES & ORDERS TAB */}
        {activeTab === 'SALES_REPORT' && (
          <section className={`${styles.tableArea} glass-card`}>
            <Table 
              headers={['Order ID', 'Item Info', 'Buyer Details', 'Payment Info', 'Total', 'Status', 'Escrow Action']} 
              data={orders.filter(o => 
                o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                o.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.buyer_email.toLowerCase().includes(searchTerm.toLowerCase())
              )}
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
                         <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Curator: {order.sellerBusinessName || 'Direct'}</span>
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
                     {order.paymentMethod === 'qr_code' || order.paymentMethod === 'UPI' || order.paymentMethod === 'UPI QR' ? (
                       <div>
                         <span className={styles.badgeQR} style={{ backgroundColor: 'rgba(223, 183, 67, 0.1)', color: 'var(--gold)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>UPI/QR</span>
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
                       <div>
                         <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>Secure Escrow ({order.paymentMethod || 'Card'})</span>
                         {order.transactionId && (
                           <p style={{ fontSize: '11px', margin: '4px 0 0 0', fontFamily: 'monospace' }}>Txn: {order.transactionId}</p>
                         )}
                       </div>
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
                     {order.status === 'RETURNED' && <span style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Returned</span>}
                     {order.status === 'RETURN_REQUESTED' && <span style={{ backgroundColor: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Return Request</span>}
                   </td>
                   <td className={styles.actions}>
                      {order.status === 'PENDING' ? (
                        order.receiptUrl ? (
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
                        ) : (
                          <span style={{ fontSize: '11px', color: '#e67e22', fontStyle: 'italic', fontWeight: 600 }}>Awaiting Payment Receipt</span>
                        )
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
          </section>
        )}

        {/* Custom Glowing Tooltip */}
        {tooltip.show && (
          <div 
            className={styles.tooltip} 
            style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
          >
            <p className={styles.tooltipTitle}>{tooltip.title}</p>
            <p style={{ margin: 0 }}>{tooltip.content}</p>
          </div>
        )}
      </main>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>List New Antique</h2>
              <button className={styles.closeBtn} onClick={() => setIsCreateModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateAntique}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mughal Gold Sword" 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    required 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Category *</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value })
                      if (e.target.value !== 'custom_new') {
                        setCustomCategory('')
                      }
                    }} 
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="custom_new">+ Add New Category...</option>
                  </select>
                </div>

                {formData.category === 'custom_new' && (
                  <div className={styles.formGroup}>
                    <label>New Category Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sculpture" 
                      value={customCategory} 
                      onChange={(e) => setCustomCategory(e.target.value)} 
                      required 
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label>Price (₹) *</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 150000" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                    required 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Year of Origin</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Circa 1850, 18th Century" 
                    value={formData.year_created} 
                    onChange={(e) => setFormData({ ...formData, year_created: e.target.value })} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Stock Quantity *</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 1" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
                    min="1"
                    required 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea 
                    placeholder="Provide details about the antique's background, era, materials..." 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    rows={4}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Upload Image *</label>
                  <input 
                    type="file"
                    ref={createFileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  {formData.image_url ? (
                    <div className={styles.previewContainer}>
                      <img src={formData.image_url} alt="Preview" />
                      <button 
                        type="button" 
                        className={styles.removeImageBtn} 
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className={styles.imageUploadZone}
                      onClick={() => createFileInputRef.current?.click()}
                    >
                      <Plus size={32} color="var(--gold)" />
                      <span>Click to upload antique image</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className="button-outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="button-premium" style={{ padding: '10px 20px' }}>
                  List Antique
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && currentAntique && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Antique Item</h2>
              <button className={styles.closeBtn} onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateAntique}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Title *</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    required 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Category *</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value })
                      if (e.target.value !== 'custom_new') {
                        setCustomCategory('')
                      }
                    }} 
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="custom_new">+ Add New Category...</option>
                  </select>
                </div>

                {formData.category === 'custom_new' && (
                  <div className={styles.formGroup}>
                    <label>New Category Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sculpture" 
                      value={customCategory} 
                      onChange={(e) => setCustomCategory(e.target.value)} 
                      required 
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label>Price (₹) *</label>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                    required 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Year of Origin</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Circa 1850, 18th Century" 
                    value={formData.year_created} 
                    onChange={(e) => setFormData({ ...formData, year_created: e.target.value })} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Stock Quantity *</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 1" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
                    min="1"
                    required 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Status *</label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
                    required
                  >
                    <option value="PENDING">Pending Review</option>
                    <option value="APPROVED">Listed (Approved)</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="SOLD">Sold Out</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    rows={4}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Upload Image *</label>
                  <input 
                    type="file"
                    ref={editFileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  {formData.image_url ? (
                    <div className={styles.previewContainer}>
                      <img src={formData.image_url} alt="Preview" />
                      <button 
                        type="button" 
                        className={styles.removeImageBtn} 
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className={styles.imageUploadZone}
                      onClick={() => editFileInputRef.current?.click()}
                    >
                      <Plus size={32} color="var(--gold)" />
                      <span>Click to upload antique image</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className="button-outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="button-premium" style={{ padding: '10px 20px' }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Table({ headers, data, renderRow }: { headers: string[], data: any[], renderRow: (item: any) => React.ReactNode }) {
  if (data.length === 0) return <div className={styles.emptyState}>No records found.</div>
  return (
    <div style={{ maxHeight: '480px', overflowY: 'auto', overflowX: 'auto', position: 'relative' }}>
      <table className={styles.table}>
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>{data.map(renderRow)}</tbody>
      </table>
    </div>
  )
}
