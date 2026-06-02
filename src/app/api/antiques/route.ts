import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    // Only return APPROVED antiques for the landing page gallery
    const [rows]: any = await pool.query(`
      SELECT * FROM antiques 
      WHERE status = 'APPROVED' 
      ORDER BY created_at DESC
    `)
    
    return NextResponse.json(rows)
  } catch (error: any) {
    console.error("Public Antiques fetch failed:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
