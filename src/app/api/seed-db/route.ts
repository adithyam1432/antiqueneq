import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    // 1. Clear existing data to avoid conflicts during testing
    // (Optional, but safer for a clean start)
    // To ensure clean seeding on multiple hits, we delete existing records in order of dependencies.
    await pool.query("SET FOREIGN_KEY_CHECKS = 0")
    await pool.query("DELETE FROM cart_items")
    await pool.query("DELETE FROM orders")
    await pool.query("DELETE FROM antiques")
    await pool.query("DELETE FROM users")
    await pool.query("SET FOREIGN_KEY_CHECKS = 1")

    const adminId = 'admin-001'
    const buyerId = 'buyer-001'

    // 2. Seed Default Admin
    await pool.query(`
      INSERT INTO users (id, name, email, password, contact_number, payment_info, role, status, permanent_address) 
      VALUES (?, 'Antiques Admin', 'admin@antiques.com', 'admin123', '0000000000', '{"type": "bank", "account": "admin_acc"}', 'ADMIN', 'APPROVED', 'Admin HQ, London, UK')
    `, [adminId])

    // 3. Seed Default Buyer
    await pool.query(`
      INSERT INTO users (id, name, email, password, contact_number, payment_info, role, status, permanent_address) 
      VALUES (?, 'Vikas Collector', 'buyer@antiques.com', 'buyer123', '+919998887776', '{"type": "card", "last_four": "1234"}', 'BUYER', 'APPROVED', '123 Heritage Lane, Jaipur, Rajasthan, India')
    `, [buyerId])

    // 4. Seed 8 Antiques/Products matching public folder assets
    const products = [
      {
        id: 'prod-vase-filigree',
        seller_id: adminId,
        title: 'Teal Filigree Vase',
        description: 'A beautiful hand-painted ceramic vase with fine teal filigree patterns, dating back to the late 17th century.',
        price: 85000.00,
        category: 'Ceramics',
        year_created: 'c. 1680',
        stock: 1,
        status: 'APPROVED',
        image_url: '/vase_filigree.png',
        images: JSON.stringify(['/vase_filigree.png'])
      },
      {
        id: 'prod-vase',
        seller_id: adminId,
        title: 'Antique Ceramic Vase',
        description: 'An elegant vintage clay vase with smooth terracotta finish and classical contours.',
        price: 12000.00,
        category: 'Ceramics',
        year_created: 'Circa 1820',
        stock: 1,
        status: 'APPROVED',
        image_url: '/vase.png',
        images: JSON.stringify(['/vase.png'])
      },
      {
        id: 'prod-watch',
        seller_id: adminId,
        title: 'Victorian Pocket Watch',
        description: 'Exquisite 18K gold pocket watch with elaborate engravings and mechanical movements.',
        price: 45000.00,
        category: 'Horology',
        year_created: 'c. 1895',
        stock: 3,
        status: 'APPROVED',
        image_url: '/watch.png',
        images: JSON.stringify(['/watch.png'])
      },
      {
        id: 'prod-clock',
        seller_id: adminId,
        title: 'French Ormolu Mantel Clock',
        description: 'Stunning 19th-century French gilt-bronze (ormolu) mantel clock featuring neoclassical figures.',
        price: 150000.00,
        category: 'Horology',
        year_created: 'c. 1840',
        stock: 1,
        status: 'APPROVED',
        image_url: '/clock_ormolu.png',
        images: JSON.stringify(['/clock_ormolu.png'])
      },
      {
        id: 'prod-painting',
        seller_id: adminId,
        title: 'Kangra Miniature Painting',
        description: 'An authentic Kangra school miniature painting depicting a legendary scene with vibrant natural colors.',
        price: 95000.00,
        category: 'Paintings',
        year_created: 'c. 1790',
        stock: 1,
        status: 'APPROVED',
        image_url: '/painting_kangra.png',
        images: JSON.stringify(['/painting_kangra.png'])
      },
      {
        id: 'prod-shield',
        seller_id: adminId,
        title: 'Mughal Steel Shield',
        description: 'An authentic 18th-century Mughal steel shield featuring ornate gold damascening artwork.',
        price: 220000.00,
        category: 'Metalware',
        year_created: 'c. 1750',
        stock: 1,
        status: 'APPROVED',
        image_url: '/shield_mughal.png',
        images: JSON.stringify(['/shield_mughal.png'])
      },
      {
        id: 'prod-telescope',
        seller_id: adminId,
        title: 'Brass Marine Telescope',
        description: 'A detailed Victorian-era leather-bound brass telescope used by maritime navigators.',
        price: 38000.00,
        category: 'Metalware',
        year_created: 'c. 1870',
        stock: 5,
        status: 'APPROVED',
        image_url: '/telescope_brass.png',
        images: JSON.stringify(['/telescope_brass.png'])
      },
      {
        id: 'prod-cabinet',
        seller_id: adminId,
        title: 'Rosewood Display Cabinet',
        description: 'Hand-carved solid rosewood cabinet with glass panels, perfect for showcasing rare antiquities.',
        price: 310000.00,
        category: 'Furniture',
        year_created: 'c. 1910',
        stock: 1,
        status: 'APPROVED',
        image_url: '/cabinet_rosewood.png',
        images: JSON.stringify(['/cabinet_rosewood.png'])
      }
    ]

    for (const product of products) {
      await pool.query(`
        INSERT INTO antiques (id, seller_id, title, description, price, category, year_created, stock, status, image_url, images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        product.id,
        product.seller_id,
        product.title,
        product.description,
        product.price,
        product.category,
        product.year_created,
        product.stock,
        product.status,
        product.image_url,
        product.images
      ])
    }

    // 5. Seed 7 Mock Orders spread across statuses and dates
    const orders = [
      {
        id: 'order-001',
        buyer_id: buyerId,
        product_id: 'prod-vase-filigree',
        buyer_name: 'Vikas Collector',
        buyer_email: 'buyer@antiques.com',
        shipping_address: '123 Heritage Lane, Jaipur, Rajasthan, India',
        contact_number: '+919998887776',
        payment_method: 'UPI',
        transaction_id: 'tx_8273918273',
        receipt_url: '/receipts/receipt-f432286f-d2f5-47ec-b69a-f7e33f8e256d.png',
        total_amount: 85500.00,
        commission_earned: 8500.00,
        delivery_charge: 500.00,
        status: 'DELIVERED',
        rejection_reason: null,
        created_at: new Date('2026-05-10T10:00:00Z')
      },
      {
        id: 'order-002',
        buyer_id: buyerId,
        product_id: 'prod-watch',
        buyer_name: 'Vikas Collector',
        buyer_email: 'buyer@antiques.com',
        shipping_address: '123 Heritage Lane, Jaipur, Rajasthan, India',
        contact_number: '+919998887776',
        payment_method: 'Card',
        transaction_id: 'tx_1234567890',
        receipt_url: '/receipts/receipt-a9dd2949-0b12-4791-89da-ff4b3c53d61f.jpeg',
        total_amount: 45500.00,
        commission_earned: 4500.00,
        delivery_charge: 500.00,
        status: 'SHIPPED',
        rejection_reason: null,
        created_at: new Date('2026-05-20T14:30:00Z')
      },
      {
        id: 'order-003',
        buyer_id: buyerId,
        product_id: 'prod-vase',
        buyer_name: 'Vikas Collector',
        buyer_email: 'buyer@antiques.com',
        shipping_address: '123 Heritage Lane, Jaipur, Rajasthan, India',
        contact_number: '+919998887776',
        payment_method: 'Bank Transfer',
        transaction_id: 'tx_9876543210',
        receipt_url: '/receipts/receipt-537a6e12-144b-496e-87a9-14e061d8bbda.jpeg',
        total_amount: 12500.00,
        commission_earned: 1200.00,
        delivery_charge: 500.00,
        status: 'PENDING',
        rejection_reason: null,
        created_at: new Date('2026-06-01T09:15:00Z')
      },
      {
        id: 'order-004',
        buyer_id: buyerId,
        product_id: 'prod-clock',
        buyer_name: 'Vikas Collector',
        buyer_email: 'buyer@antiques.com',
        shipping_address: '123 Heritage Lane, Jaipur, Rajasthan, India',
        contact_number: '+919998887776',
        payment_method: 'Card',
        transaction_id: 'tx_246813579',
        receipt_url: null,
        total_amount: 150500.00,
        commission_earned: 15000.00,
        delivery_charge: 500.00,
        status: 'CONFIRMED',
        rejection_reason: null,
        created_at: new Date('2026-06-02T11:45:00Z')
      },
      {
        id: 'order-005',
        buyer_id: buyerId,
        product_id: 'prod-painting',
        buyer_name: 'Vikas Collector',
        buyer_email: 'buyer@antiques.com',
        shipping_address: '123 Heritage Lane, Jaipur, Rajasthan, India',
        contact_number: '+919998887776',
        payment_method: 'UPI',
        transaction_id: 'tx_135792468',
        receipt_url: null,
        total_amount: 95500.00,
        commission_earned: 9500.00,
        delivery_charge: 500.00,
        status: 'REJECTED',
        rejection_reason: 'Payment verification failed. Invalid transaction reference.',
        created_at: new Date('2026-05-28T16:20:00Z')
      },
      {
        id: 'order-006',
        buyer_id: buyerId,
        product_id: 'prod-telescope',
        buyer_name: 'Vikas Collector',
        buyer_email: 'buyer@antiques.com',
        shipping_address: '123 Heritage Lane, Jaipur, Rajasthan, India',
        contact_number: '+919998887776',
        payment_method: 'UPI',
        transaction_id: 'tx_1122334455',
        receipt_url: null,
        total_amount: 38500.00,
        commission_earned: 3800.00,
        delivery_charge: 500.00,
        status: 'RETURNED',
        rejection_reason: null,
        created_at: new Date('2026-04-15T08:00:00Z')
      },
      {
        id: 'order-007',
        buyer_id: buyerId,
        product_id: 'prod-cabinet',
        buyer_name: 'Vikas Collector',
        buyer_email: 'buyer@antiques.com',
        shipping_address: '123 Heritage Lane, Jaipur, Rajasthan, India',
        contact_number: '+919998887776',
        payment_method: 'Bank Transfer',
        transaction_id: 'tx_6677889900',
        receipt_url: null,
        total_amount: 310500.00,
        commission_earned: 31000.00,
        delivery_charge: 500.00,
        status: 'RETURN_REQUESTED',
        rejection_reason: null,
        created_at: new Date('2026-05-02T12:00:00Z')
      }
    ]

    for (const order of orders) {
      await pool.query(`
        INSERT INTO orders (id, buyer_id, product_id, buyer_name, buyer_email, shipping_address, contact_number, payment_method, transaction_id, receipt_url, total_amount, commission_earned, delivery_charge, status, rejection_reason, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        order.id,
        order.buyer_id,
        order.product_id,
        order.buyer_name,
        order.buyer_email,
        order.shipping_address,
        order.contact_number,
        order.payment_method,
        order.transaction_id,
        order.receipt_url,
        order.total_amount,
        order.commission_earned,
        order.delivery_charge,
        order.status,
        order.rejection_reason,
        order.created_at
      ])
    }

    return NextResponse.json({ 
      success: true, 
      message: "Infrastructure data synchronized. Masterpieces and credentials ready." 
    })
  } catch (error: any) {
    console.error("Seeding failed:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
