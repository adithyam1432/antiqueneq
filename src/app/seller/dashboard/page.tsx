'use client'

import { LayoutDashboard, PlusCircle, Package, Settings, LogOut, TrendingUp, ShieldCheck, Clock } from 'lucide-react'
import styles from './seller.module.css'

export default function SellerDashboard() {
  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <LayoutDashboard size={24} />
          <span>Seller Hub</span>
        </div>
        <nav className={styles.sideNav}>
          <a href="#" className={styles.active}><LayoutDashboard size={18} /> Dashboard</a>
          <a href="#"><Package size={18} /> My Listings</a>
          <a href="#"><PlusCircle size={18} /> Add New Item</a>
          <a href="#"><Settings size={18} /> Account Settings</a>
        </nav>
        <div className={styles.sidebarFooter}>
          <button className={styles.logout}><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.content}>
        <header className={styles.topBar}>
          <h1 className="gold-gradient">Seller Overview</h1>
          <div className={styles.userProfile}>
            <span>Welcome, Royal Antiques Ltd.</span>
          </div>
        </header>

        <section className={styles.statsGrid}>
          <div className="glass-card">
            <div className={styles.statContent}>
              <TrendingUp size={32} color="var(--gold)" />
              <div>
                <p>Total Revenue</p>
                <h3>₹4,50,000</h3>
              </div>
            </div>
          </div>
          <div className="glass-card">
            <div className={styles.statContent}>
              <Package size={32} color="var(--gold)" />
              <div>
                <p>Active Listings</p>
                <h3>24</h3>
              </div>
            </div>
          </div>
          <div className="glass-card">
            <div className={styles.statContent}>
              <Clock size={32} color="var(--gold)" />
              <div>
                <p>Pending Verification</p>
                <h3>3</h3>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.recentActivity}>
          <h2 className="gold-gradient">Recent Listings Status</h2>
          <div className="glass-card">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Victorian Pocket Watch</td>
                  <td>Horology</td>
                  <td>₹85,000</td>
                  <td className={styles.statusVerified}>
                    <ShieldCheck size={14} /> Gold Verified
                  </td>
                  <td><button className="button-outline">Edit</button></td>
                </tr>
                <tr>
                  <td>18th Century Brass Telescope</td>
                  <td>Maritime</td>
                  <td>₹1,20,000</td>
                  <td className={styles.statusPending}>
                    <Clock size={14} /> Reviewing
                  </td>
                  <td><button className="button-outline">Details</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
