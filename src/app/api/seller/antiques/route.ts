import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session: any = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== 'SELLER') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const [rows]: any = await pool.query(
      "SELECT id, title, description, price, category, image_url, status, created_at FROM antiques WHERE seller_id = ? ORDER BY created_at DESC",
      [session.user.id]
    )
    return NextResponse.json(rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session: any = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== 'SELLER') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, description, price, category, imageUrl } = await request.json()

  try {
    const antiqueId = crypto.randomUUID()
    await pool.query(
      "INSERT INTO antiques (id, seller_id, title, description, price, category, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [antiqueId, (session.user as any).id, title, description, price, category, imageUrl || '', 'PENDING']
    )

    return NextResponse.json({ 
      success: true, 
      message: "Antique listing submitted for verification.", 
      antiqueId 
    })
  } catch (error: any) {
    console.error("Seller product post failed:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
