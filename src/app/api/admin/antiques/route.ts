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
        a.id, 
        a.title, 
        a.description, 
        a.price, 
        a.category, 
        a.status, 
        a.created_at,
        u.name AS seller_name
      FROM antiques a
      JOIN users u ON a.seller_id = u.id
      ORDER BY a.created_at DESC
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

  const { antiqueId, status } = await request.json()

  try {
    await pool.query(
      "UPDATE antiques SET status = ? WHERE id = ?",
      [status, antiqueId]
    )

    return NextResponse.json({ success: true, message: `Antique status updated to ${status}` })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
