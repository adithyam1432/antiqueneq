'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mail, Phone, MapPin } from 'lucide-react'
import styles from './footer.module.css'

export default function Footer() {
  const pathname = usePathname()

  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname?.startsWith('/admin/dashboard')
  ) {
    return null
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand Column */}
        <div className={styles.brandColumn}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoContainer}>
              <img src="/anique_logo.png" alt="Anique Logo" className={styles.logoImg} />
            </div>
            <span className={styles.logoText}>Anique</span>
          </Link>
          <p className={styles.description}>
            India's most trusted premium antique marketplace. Curated by experts, verified for authenticity, and delivered through a secure double-layered escrow network.
          </p>
        </div>

        {/* Contact Column */}
        <div className={styles.column}>
          <h4 className={styles.heading}>Collector Registry</h4>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <MapPin className={styles.contactIcon} size={16} />
              <span>
                Imperial Court Chambers, Cuffe Parade,<br />
                Mumbai, Maharashtra, India
              </span>
            </li>
            <li className={styles.contactItem}>
              <Phone className={styles.contactIcon} size={14} />
              <span>1800-ANTIQUE-ROYAL</span>
            </li>
            <li className={styles.contactItem}>
              <Mail className={styles.contactIcon} size={14} />
              <span>curator@antiques.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div className={styles.bottomRow}>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} Anique Marketplace. All rights reserved.
        </div>
        <div className={styles.socials}>
          <Link href="/privacy" className={styles.socialLink}>Privacy Shield</Link>
          <Link href="/terms" className={styles.socialLink}>Provenance Terms</Link>
          <Link href="/escrow" className={styles.socialLink}>Escrow Policy</Link>
        </div>
      </div>
    </footer>
  )
}
