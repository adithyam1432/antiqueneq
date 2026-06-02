import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    // 1. Clear existing data to avoid conflicts during testing
    // (Optional, but safer for a clean start)
    // await pool.query("DELETE FROM users") 

    const adminId = 'admin-001'
    const sellerId = 'seller-001'
    const buyerId = 'buyer-001'
    const antiqueId = 'antique-001'

    // 2. Seed Default Admin
    await pool.query(`
      INSERT IGNORE INTO users (id, name, email, password, contact_number, payment_info, role, status) 
      VALUES (?, 'Antiquity Admin', 'admin@antiquity.com', 'admin123', '0000000000', '{"type": "bank", "account": "admin_acc"}', 'ADMIN', 'APPROVED')
    `, [adminId])

    // 3. Seed Default Seller
    await pool.query(`
      INSERT IGNORE INTO users (id, name, email, password, contact_number, payment_info, role, status) 
      VALUES (?, 'Himalayan Arts', 'seller@antiquity.com', 'seller123', '+919876543210', '{"type": "upi", "upi_id": "seller@bank"}', 'SELLER', 'APPROVED')
    `, [sellerId])

    // 4. Seed Default Buyer
    await pool.query(`
      INSERT IGNORE INTO users (id, name, email, password, contact_number, payment_info, role, status) 
      VALUES (?, 'Vikas Collector', 'buyer@antiquity.com', 'buyer123', '+919998887776', '{"type": "card", "last_four": "1234"}', 'BUYER', 'APPROVED')
    `, [buyerId])

    // 5. Seed Initial Antique (Admin Approved)
    await pool.query(`
      INSERT IGNORE INTO antiques (id, seller_id, title, description, price, category, status, image_url)
      VALUES (?, ?, 'Teal Filigree Vase', 'Hand-painted masterpiece from the late 17th century.', 85000, 'Ceramics', 'APPROVED', '/vase.webp')
    `, [antiqueId, sellerId])

    // 6. Seed Initial Antique 2
    await pool.query(`
      INSERT IGNORE INTO antiques (id, seller_id, title, description, price, category, status, image_url)
      VALUES (?, ?, 'Victorian Pocket Watch', 'Exquisite gold watch with intricate carvings.', 45000, 'Horology', 'APPROVED', '/watch.webp')
    `, ['antique-002', sellerId])

    return NextResponse.json({ 
      success: true, 
      message: "Infrastructure data synchronized. Masterpieces and credentials ready." 
    })
  } catch (error: any) {
    console.error("Seeding failed:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
