import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const buyerId = (session.user as any).id
    const { 
      items, 
      shippingAddress, 
      buyerName, 
      buyerEmail, 
      contactNumber, 
      paymentMethod, 
      transactionId, 
      receiptBase64 
    } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    const name = buyerName || session.user.name || 'Anonymous Buyer'
    const email = buyerEmail || session.user.email || 'buyer@antiques.com'
    const address = shippingAddress || 'Default Shipping Address'

    // Process receipt image if base64 provided
    let receiptUrl = null
    if (paymentMethod === 'qr_code' && receiptBase64) {
      const receiptsDir = path.join(process.cwd(), 'public', 'receipts')
      if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true })
      }
      
      const matches = receiptBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      if (matches && matches.length === 3) {
        const ext = matches[1].split('/')[1] || 'png'
        const buffer = Buffer.from(matches[2], 'base64')
        const fileName = `receipt-${crypto.randomUUID()}.${ext}`
        const filePath = path.join(receiptsDir, fileName)
        fs.writeFileSync(filePath, buffer)
        receiptUrl = `/receipts/${fileName}`
      }
    }

    // Connect to DB and use a transaction to ensure atomicity
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      const orderIds = []

      for (const item of items) {
        // 1. Verify item is still available
        const [antiques]: any = await connection.query(
          "SELECT * FROM antiques WHERE id = ? FOR UPDATE", 
          [item.id]
        )
        
        if (antiques.length === 0 || antiques[0].status !== 'APPROVED') {
          throw new Error(`Item ${item.title} is no longer available.`)
        }

        const antique = antiques[0]
        const orderId = `ord-${crypto.randomUUID()}`
        
        const price = parseFloat(antique.price)
        const commissionRate = parseFloat(antique.commission_rate) || 10
        const deliveryCharge = parseFloat(antique.delivery_charge) || 500

        const commissionEarned = price * (commissionRate / 100)
        const totalAmount = price + deliveryCharge

        // 2. Mark item as SOLD (so it doesn't display in list during verification)
        await connection.query(
          "UPDATE antiques SET status = 'SOLD' WHERE id = ?",
          [antique.id]
        )

        // 3. Create Order
        await connection.query(`
          INSERT INTO orders (
            id, buyer_id, product_id, buyer_name, buyer_email, contact_number, 
            shipping_address, total_amount, commission_earned, delivery_charge, 
            payment_method, transaction_id, receipt_url, status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
        `, [
          orderId, buyerId, antique.id, name, email, contactNumber || null,
          address, totalAmount, commissionEarned, deliveryCharge,
          paymentMethod || 'credit_card', transactionId || null, receiptUrl, 'PENDING'
        ])

        orderIds.push(orderId)
      }

      // 5. Clear user's cart in DB
      await connection.query("DELETE FROM cart_items WHERE user_id = ?", [buyerId])

      await connection.commit()
      connection.release()

      return NextResponse.json({ success: true, orders: orderIds })

    } catch (err: any) {
      await connection.rollback()
      connection.release()
      throw err
    }

  } catch (error: any) {
    console.error("Checkout failed:", error)
    return NextResponse.json({ error: error.message || "Failed to process checkout" }, { status: 500 })
  }
}
