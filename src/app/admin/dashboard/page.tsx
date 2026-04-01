'use client'

import { ShieldCheck, Users, ShoppingBag, AlertCircle, CheckCircle, XCircle, BarChart3, Bell } from 'lucide-react'
import styles from './admin.module.css'

export default function AdminDashboard() {
  return (
    <div className={styles.wrapper}>
      {/* Admin Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <ShieldCheck size={28} />
          <span>Admin Verifier</span>
        </div>
        <nav className={styles.sideNav}>
          <a href="#" className={styles.active}><BarChart3 size={18} /> Overview</a>
          <a href="#"><CheckCircle size={18} /> Approvals <span className={styles.count}>12</span></a>
          <a href="#"><Users size={18} /> User Access</a>
          <a href="#"><AlertCircle size={18} /> Dispute Center</a>
        </nav>
      </aside>

      {/* Admin Main */}
      <main className={styles.content}>
        <header className={styles.topBar}>
          <h1 className="gold-gradient">Trust Management Console</h1>
          <div className={styles.topActions}>
            <Bell size={20} className={styles.notification} />
            <div className={styles.adminProfile}>Admin: Satyajit Ray</div>
          </div>
        </header>

        <section className={styles.kpiGrid}>
          <div className="glass-card">
            <div className={styles.kpi}>
              <Users size={28} color="var(--gold)" />
              <div>
                <p>Pending Sellers</p>
                <h3>5</h3>
              </div>
            </div>
          </div>
          <div className="glass-card">
            <div className={styles.kpi}>
              <ShoppingBag size={28} color="var(--gold)" />
              <div>
                <p>Items Awaiting Gold Scan</p>
                <h3>18</h3>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.verificationQueue}>
          <h2 className="gold-gradient">Product Verification Queue</h2>
          <div className="glass-card">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Request Date</th>
                  <th>Product Title</th>
                  <th>Seller</th>
                  <th>Docs Provided</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2024-04-01</td>
                  <td>Mughal Era Silver Hookah</td>
                  <td>Old Delhi Collectors</td>
                  <td><CheckCircle size={14} color="#22c55e" /> Yes</td>
                  <td className={styles.actions}>
                    <button className={styles.approveBtn}><CheckCircle size={16} /> Approve</button>
                    <button className={styles.rejectBtn}><XCircle size={16} /> Reject</button>
                  </td>
                </tr>
                <tr>
                  <td>2024-04-01</td>
                  <td>Colonial Period Carriage Lamp</td>
                  <td>Indo-Antique Biz</td>
                  <td><AlertCircle size={14} color="#f59e0b" /> Partial</td>
                  <td className={styles.actions}>
                    <button className={styles.approveBtn}><CheckCircle size={16} /> Approve</button>
                    <button className={styles.rejectBtn}><XCircle size={16} /> Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
