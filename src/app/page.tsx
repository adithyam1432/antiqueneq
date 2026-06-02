'use client'

import { useState, useEffect } from 'react'
import HeroScene from '@/components/three/HeroScene'
import {
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  History,
  Plus,
  RefreshCw
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function Home() {
  const { addToCart } = useCart()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All Artifacts')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/antiques')
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      console.error("Home feed fetch failed", e)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: any) => {
    addToCart(product)
  }

  const handleBuyNow = (product: any) => {
    addToCart(product)
    router.push('/cart')
  }

  const filteredProducts = Array.isArray(products)
    ? (filter === 'All Artifacts'
      ? products
      : products.filter(p => p.category === filter))
    : []

  return (
    <main className={styles.main}>
      {/* Hero Section with the Masterpiece Vase */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Royal Antique Collection</span>
          <h1 className="gold-gradient">Masterpieces of the Past, Today.</h1>
          <p className={styles.heroText}>
            Welcome to India's most Trusted antique marketplace.
            Every item is verified, every transaction is secure.
          </p>
          <div className={styles.actions}>
            <button className="button-premium" onClick={() => document.getElementById('explore')?.scrollIntoView()}>
              Explore Gallery <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <HeroScene />
        </div>
      </section>

      {/* Category Ribbon */}
      <div className={styles.categoryRibbon}>
        {['All Artifacts', 'Ceramics', 'Metalware', 'Furniture', 'Horology', 'Paintings'].map(cat => (
          <button
            key={cat}
            className={`${styles.categoryBtn} ${filter === cat ? styles.active : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Discovery Grid */}
      <section id="explore" className={styles.discovery}>
        <div className={styles.sectionHeader}>
          <h2 className="gold-gradient">Admin-Verified Masterpieces</h2>
          <p>Curated by experts. Verified for provenance. Delivered with care.</p>
        </div>

        {loading ? (
          <div className={styles.loader}>
            <RefreshCw className={styles.spin} />
            <p>Curating Gallery...</p>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {filteredProducts.length === 0 ? (
              <div className={styles.emptyDiscover}>
                <p className="text-muted">No artifacts found in this category yet.</p>
              </div>
            ) : filteredProducts.map(product => (
              <div key={product.id} className={`${styles.productCard} glass-card`}>
                {product.image_url ? (
                  <div className={styles.productImageContainer}>
                    <ShieldCheck className={styles.verifiedIcon} size={24} />
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className={styles.productImage}
                    />
                  </div>
                ) : (
                  <div className={styles.productImagePlaceholder}>
                    <ShieldCheck className={styles.verifiedIcon} size={24} />
                    <span className={styles.placeholderText}>{product.category} Artifact</span>
                  </div>
                )}
                <div className={styles.productInfo}>
                  <span className={styles.categoryTag}>{product.category}</span>
                  <h3>{product.title}</h3>
                  <p className={styles.price}>₹{product.price.toLocaleString()}</p>

                  <div className={styles.cardActions}>
                    <button
                      className="button-premium flex-1"
                      onClick={() => handleBuyNow(product)}
                    >
                      Buy Now
                    </button>
                    <button
                      className="button-outline"
                      onClick={() => handleAddToCart(product)}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.trustBanner}>
        <div className={styles.trustItem}>
          <ShieldCheck size={32} color="var(--gold)" />
          <div>
            <h4>Dual-Layer Verification</h4>
            <p>Physical inspection by specialized curators before shipment.</p>
          </div>
        </div>
        <div className={styles.trustItem}>
          <History size={32} color="var(--gold)" />
          <div>
            <h4>Full Order Tracking</h4>
            <p>Live GPS tracking and white-glove delivery for every treasure.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
