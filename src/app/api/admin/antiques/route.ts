import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs'
import path from 'path'

function saveBase64Image(base64Str: string): string {
  if (!base64Str || !base64Str.startsWith('data:image/')) {
    return base64Str
  }
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    if (matches && matches.length === 3) {
      const ext = matches[1].split('/')[1] || 'png'
      const buffer = Buffer.from(matches[2], 'base64')
      const fileName = `antique-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`
      const filePath = path.join(uploadsDir, fileName)
      fs.writeFileSync(filePath, buffer)
      return `/uploads/${fileName}`
    }
  } catch (error) {
    console.error("Failed to save uploaded image:", error)
  }
  return base64Str
}

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
        a.year_created,
        a.stock,
        a.status, 
        a.image_url,
        a.images,
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

export async function POST(request: Request) {
  const session: any = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, price, category, year_created, stock, image_url, status } = body

    if (!title || !price || !category) {
      return NextResponse.json({ error: "Missing required fields (title, price, category)" }, { status: 400 })
    }

    const sellerId = session.user.id || 'admin-001'
    const newId = `antique-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const finalStatus = status || 'APPROVED'
    
    // Save image if base64 upload
    const finalImageUrl = saveBase64Image(image_url)

    await pool.query(
      `INSERT INTO antiques (id, seller_id, title, description, price, category, year_created, stock, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newId, sellerId, title, description || '', parseFloat(price) || 0, category, year_created || 'Circa 1850', parseInt(stock) || 1, finalImageUrl, finalStatus]
    )

    return NextResponse.json({ success: true, id: newId, message: "Antique created successfully" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session: any = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, antiqueId, status, title, description, price, category, year_created, stock, image_url } = body
    const targetId = id || antiqueId

    if (!targetId) {
      return NextResponse.json({ error: "Missing antique ID" }, { status: 400 })
    }

    if (title !== undefined || description !== undefined || price !== undefined || category !== undefined || year_created !== undefined || stock !== undefined || image_url !== undefined) {
      const finalImageUrl = image_url !== undefined ? saveBase64Image(image_url) : undefined

      await pool.query(
        `UPDATE antiques 
         SET title = ?, description = ?, price = ?, category = ?, year_created = COALESCE(?, year_created), stock = COALESCE(?, stock), image_url = COALESCE(?, image_url), status = COALESCE(?, status)
         WHERE id = ?`,
        [title || '', description || '', parseFloat(price) || 0, category || '', year_created !== undefined ? year_created : null, stock !== undefined ? parseInt(stock) : null, finalImageUrl !== undefined ? finalImageUrl : null, status || null, targetId]
      )
      return NextResponse.json({ success: true, message: "Antique updated successfully" })
    } else {
      await pool.query(
        "UPDATE antiques SET status = ? WHERE id = ?",
        [status, targetId]
      )
      return NextResponse.json({ success: true, message: `Antique status updated to ${status}` })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session: any = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Missing antique ID" }, { status: 400 })
    }

    await pool.query("DELETE FROM antiques WHERE id = ?", [id])
    return NextResponse.json({ success: true, message: "Antique deleted successfully" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

