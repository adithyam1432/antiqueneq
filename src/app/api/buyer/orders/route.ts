import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const buyerId = (session.user as any).id

    const [orders]: any = await pool.query(`
      SELECT 
        o.id,
        o.buyer_name as buyerName,
        o.buyer_email as buyerEmail,
        o.contact_number as contactNumber,
        o.shipping_address as shippingAddress,
        o.total_amount as totalAmount,
        o.commission_earned as commissionEarned,
        o.delivery_charge as deliveryCharge,
        o.payment_method as paymentMethod,
        o.transaction_id as transactionId,
        o.receipt_url as receiptUrl,
        o.status,
        o.rejection_reason as rejectionReason,
        o.created_at as createdAt,
        a.title as productTitle,
        a.image_url as productImageUrl,
        a.price as productPrice,
        u.name as sellerBusinessName
      FROM orders o
      JOIN antiques a ON o.product_id = a.id
      JOIN users u ON a.seller_id = u.id
      WHERE o.buyer_id = ?
      ORDER BY o.created_at DESC
    `, [buyerId])

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error("Fetch buyer orders failed:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
