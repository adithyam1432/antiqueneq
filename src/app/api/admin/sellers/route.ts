import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session: any = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const [rows]: any = await pool.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.status, 
        s.business_name, 
        s.business_address, 
        s.id_proof_url,
        s.tax_id
      FROM users u
      LEFT JOIN seller_profiles s ON u.id = s.user_id
      WHERE u.role = 'SELLER'
      ORDER BY u.created_at DESC
    `)

    return NextResponse.json(rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session: any = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { userId, status } = await request.json()

  try {
    await pool.query(
      "UPDATE users SET status = ? WHERE id = ?",
      [status, userId]
    )
    
    // Also update seller_profiles status
    await pool.query(
      "UPDATE seller_profiles SET status = ? WHERE user_id = ?",
      [status, userId]
    )

    return NextResponse.json({ success: true, message: `Seller status updated to ${status}` })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
