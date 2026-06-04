import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [orders]: any = await pool.query(`
      SELECT 
        o.id, 
        o.buyer_id, 
        o.buyer_name, 
        o.buyer_email, 
        o.contact_number as contactNumber,
        o.shipping_address, 
        o.total_amount as totalAmount, 
        o.commission_earned as commissionEarned, 
        o.delivery_charge as deliveryCharge, 
        o.payment_method as paymentMethod,
        o.transaction_id as transactionId,
        o.receipt_url as receiptUrl,
        o.status, 
        o.rejection_reason as rejectionReason,
        o.created_at as createdAt,
        o.product_id as productId,
        a.title as productTitle,
        a.image_url as productImageUrl,
        u.name as sellerBusinessName
      FROM orders o
      JOIN antiques a ON o.product_id = a.id
      JOIN users u ON a.seller_id = u.id
      ORDER BY o.created_at DESC
    `)

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error("Fetch admin orders failed:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId, status, rejectionReason } = await req.json()
    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const allowedStatuses = ['PENDING', 'CONFIRMED', 'REJECTED', 'SHIPPED', 'DELIVERED', 'RETURN_REQUESTED', 'RETURNED']
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      // Fetch order details
      const [orderRows]: any = await connection.query(
        "SELECT product_id, buyer_id FROM orders WHERE id = ?",
        [orderId]
      )

      if (orderRows.length === 0) {
        throw new Error("Order not found")
      }

      const order = orderRows[0]

      // 1. Update the order status and rejection reason
      if (status === 'REJECTED') {
        await connection.query(
          "UPDATE orders SET status = ?, rejection_reason = ? WHERE id = ?",
          [status, rejectionReason || 'Curator verification rejected or payment transfer failed.', orderId]
        )
      } else {
        await connection.query(
          "UPDATE orders SET status = ?, rejection_reason = NULL WHERE id = ?",
          [status, orderId]
        )
      }

      // 2. Handle product state if REJECTED
      if (status === 'REJECTED') {
        // Revert product status to APPROVED so it is buyable again
        await connection.query(
          "UPDATE antiques SET status = 'APPROVED' WHERE id = ?",
          [order.product_id]
        )
        // Clean up payout (none needed)
      }

      await connection.commit()
      connection.release()

      return NextResponse.json({ success: true, message: `Order status updated to ${status}` })

    } catch (err: any) {
      await connection.rollback()
      connection.release()
      throw err
    }

  } catch (error: any) {
    console.error("Update admin order failed:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
