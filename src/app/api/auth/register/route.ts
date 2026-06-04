import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      name, email, password, contact_number, permanent_address
    } = body
    const role = 'BUYER'

    if (!name || !email || !password || !contact_number || !permanent_address) {
      return NextResponse.json(
        { error: 'Name, email, password, contact number, and permanent address are required' },
        { status: 400 }
      )
    }

    // Sanitize
    const sanitizedEmail = email.trim().toLowerCase()
    
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [sanitizedEmail]
    ) as [unknown[], unknown];

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    const userId = crypto.randomUUID()

    const initialStatus = 'APPROVED'

    // Insert user
    await pool.query(
      'INSERT INTO users (id, name, email, password, contact_number, permanent_address, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, name, sanitizedEmail, hashedPassword, contact_number, permanent_address, role, initialStatus]
    )

    return NextResponse.json(
      { success: true, message: 'Account created successfully' },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again later.' },
      { status: 500 }
    )
  }
}
