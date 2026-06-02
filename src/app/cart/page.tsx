'use client'

import { useCart } from '@/context/CartContext'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import styles from './cart.module.css'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()
  const router = useRouter()

  if (cartCount === 0) {
    return (
      <div className={styles.emptyCart}>
        <ShoppingBag size={64} color="var(--gold)" />
        <h2 className="gold-gradient">Your cart is empty</h2>
        <p>Explore our exclusive collection of 3D antiques.</p>
        <button className="button-premium" onClick={() => router.push('/')}>
          Start Shopping
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className="gold-gradient">Your Selection</h1>
      
      <div className={styles.cartContent}>
        <div className={styles.itemList}>
          {cart.map((item) => (
            <div key={item.id} className={`${styles.cartItem} glass-card`}>
              <div className={styles.itemImage}>
                <span className={styles.categoryTag}>{item.category}</span>
              </div>
              <div className={styles.itemInfo}>
                <div className={styles.header}>
                  <h3>{item.title}</h3>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className={styles.removeBtn}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className={styles.price}>₹{item.price.toLocaleString()}</p>
                
                <div className={styles.controls}>
                  <div className={styles.quantity}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className={styles.subtotal}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <div className="glass-card p-6">
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span className={styles.free}>FREE</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total Amount</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            
            <button className="button-premium w-full mt-6" onClick={() => router.push('/checkout')}>
              Proceed to Checkout <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
            <p className={styles.secureText}>
              Every transaction is protected with military-grade encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
