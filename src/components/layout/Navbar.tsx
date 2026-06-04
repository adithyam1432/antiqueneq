'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Search, 
  ShoppingBag, 
  User, 
  LogOut, 
  Menu,
  X
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import ThemeToggle from './ThemeToggle'
import styles from './navbar.module.css'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const { data: session, status } = useSession()
  const { cartCount } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  if (pathname?.startsWith('/admin/dashboard')) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const getDashboardLink = () => {
    if (!session?.user) return '/login'
    const role = (session.user as any).role
    if (role === 'ADMIN') return '/admin/dashboard'
    return '/profile'
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo} onClick={() => router.push('/')}>
          <div className={styles.logoContainer}>
            <img src="/anique_logo.png" alt="Anique Logo" className={styles.logoImg} />
          </div>
          <span className={styles.logoText}>Anique</span>
        </div>

        {/* Desktop Actions */}
        <div className={styles.desktopActions}>
        <Link href="/" className={styles.navLink}>Explore</Link>
          
          <ThemeToggle />

          <button className={styles.cartBtn} onClick={() => router.push('/cart')}>
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>

          {status === 'authenticated' ? (
            <div className={styles.profileGroup}>
              <button 
                className={styles.profileBtn}
                onClick={() => router.push(getDashboardLink())}
              >
                <User size={20} />
                <span className={styles.userName}>{session.user?.name || 'User'}</span>
              </button>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button className="button-premium" onClick={() => router.push('/login')}>
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.mobileMenuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" onClick={() => setIsMenuOpen(false)}>Explore</Link>
          <Link href="/cart" onClick={() => setIsMenuOpen(false)}>Cart ({cartCount})</Link>
          {status === 'authenticated' ? (
            <>
              <Link href={getDashboardLink()} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className={styles.mobileLogout}>Logout</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  )
}
