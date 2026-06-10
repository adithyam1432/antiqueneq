'use client'

import { useState, useEffect } from 'react'
import HeroScene from '@/components/three/HeroScene'
import {
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  History,
  Plus,
  RefreshCw,
  X
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import styles from './page.module.css'

export default function Home() {
  const { data: session } = useSession()
  const { addToCart } = useCart()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All Artifacts')
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  const baseCategories = ['Ceramics', 'Metalware', 'Furniture', 'Horology', 'Paintings']
  const dynamicCategories = Array.isArray(products)
    ? Array.from(new Set([
        ...baseCategories,
        ...products.map((p: any) => p.category).filter(Boolean)
      ]))
    : baseCategories

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

  const handleAddToCart = (product: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    addToCart(product)
  }

  const handleBuyNow = (product: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    addToCart(product)
    if (!session) {
      router.push('/register?redirect=/checkout')
    } else {
      router.push('/checkout')
    }
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
          <span className={styles.badge}>Royal Indian Antiquities</span>
          <h1 className="gold-gradient">Masterpieces of the Past, Today.</h1>
          <p className={styles.heroText}>
            Welcome to India's most trusted, direct-to-consumer antique network.
            Every artifact is curated by experts, physically verified, and safely shipped to your doorstep.
          </p>
          <div className={styles.actions}>
            <button 
              className="button-premium" 
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textTransform: 'none' }}
              onClick={() => document.getElementById('explore')?.scrollIntoView()}
            >
              Explore Gallery <ArrowRight size={18} style={{ marginLeft: '8px', display: 'inline-block' }} />
            </button>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <HeroScene />
        </div>
      </section>

      {/* Category Ribbon */}
      <div className={styles.categoryRibbon}>
        {['All Artifacts', ...dynamicCategories].map(cat => (
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
              <div 
                key={product.id} 
                className={`${styles.productCard} glass-card`}
                onClick={() => setSelectedProduct(product)}
                style={{ cursor: 'pointer' }}
              >
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

                  <div className={styles.cardActions} style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', width: '100%', marginTop: 'auto' }}>
                    <button
                      className="button-premium"
                      style={{ flex: 1, padding: '10px 16px', fontSize: '12px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '38px' }}
                      onClick={(e) => handleBuyNow(product, e)}
                    >
                      Buy Now
                    </button>
                    <button
                      className="button-outline"
                      style={{ width: '38px', height: '38px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minHeight: '38px' }}
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <Plus size={18} style={{ display: 'inline-block' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProduct(null)}>
          <div className={`${styles.modalContainer} glass-card`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setSelectedProduct(null)}>
              <X size={24} />
            </button>
            
            <div className={styles.modalImageSection}>
              {selectedProduct.image_url ? (
                <img src={selectedProduct.image_url} alt={selectedProduct.title} className={styles.modalImage} />
              ) : (
                <div className={styles.modalImagePlaceholder}>
                  <span>{selectedProduct.category} Artifact</span>
                </div>
              )}
            </div>

            <div className={styles.modalDetailsSection}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className={styles.modalCategory}>{selectedProduct.category}</span>
                <span className={styles.verifiedBadge} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--gold)', fontWeight: 600 }}>
                  <ShieldCheck size={16} /> Verified Authenticity
                </span>
              </div>
              
              <h2 className={`${styles.modalTitle} gold-gradient`}>{selectedProduct.title}</h2>
              <p className={styles.modalPrice}>₹{selectedProduct.price.toLocaleString()}</p>
              
              <div className={styles.modalMetaInfo}>
                <div className={styles.metaItem}>
                  <strong>Year of Origin:</strong> <span>{selectedProduct.year_created || 'Circa 1850'}</span>
                </div>
                <div className={styles.metaItem}>
                  <strong>Seller ID:</strong> <span>{selectedProduct.seller_id}</span>
                </div>
                <div className={styles.metaItem}>
                  <strong>Delivery:</strong> <span>₹{selectedProduct.delivery_charge?.toLocaleString() || '500'} (Insured Shipping)</span>
                </div>
              </div>

              <div className={styles.modalDescContainer}>
                <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '8px', fontSize: '18px' }}>History & Provenance</h4>
                <p className={styles.modalDesc}>
                  {selectedProduct.description || "A rare and beautiful historic artifact, curated by experts and verified for authenticity. This item is safely stored and ready to be shipped directly to the buyer."}
                </p>
              </div>

              <div className={styles.modalActions}>
                <button
                  className="button-premium"
                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '48px' }}
                  onClick={(e) => {
                    handleBuyNow(selectedProduct, e);
                    setSelectedProduct(null);
                  }}
                >
                  Buy Now
                </button>
                <button
                  className="button-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '48px', padding: '0 24px' }}
                  onClick={(e) => {
                    handleAddToCart(selectedProduct, e);
                    setSelectedProduct(null);
                  }}
                >
                  <Plus size={18} /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
