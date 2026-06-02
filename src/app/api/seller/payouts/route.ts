import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || (session.user as any).role !== 'SELLER') {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }

    const sellerId = (session.user as any).id

    // Fetch payouts with basic order info
    const [payouts]: any = await pool.query(`
      SELECT p.id, p.amount, p.status, p.created_at, a.title as product_title 
      FROM payouts p
      JOIN orders o ON p.order_id = o.id
      JOIN antiques a ON o.product_id = a.id
      WHERE p.seller_id = ?
      ORDER BY p.created_at DESC
    `, [sellerId])

    return NextResponse.json({ success: true, payouts })
  } catch (error: any) {
    console.error("Failed to fetch payouts:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
