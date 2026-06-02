import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      name, email, password, role = 'BUYER',
      contact_number, business_name, pan_number, business_address, tax_id 
    } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
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

    // Determine initial status based on role
    const initialStatus = role === 'SELLER' ? 'PENDING' : 'APPROVED'

    // Insert user
    await pool.query(
      'INSERT INTO users (id, name, email, password, contact_number, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, name, sanitizedEmail, hashedPassword, contact_number || null, role, initialStatus]
    )

    // If role is SELLER, create a pending seller profile
    if (role === 'SELLER') {
      await pool.query(
        'INSERT INTO seller_profiles (user_id, business_name, pan_number, business_address, tax_id, status) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, business_name, pan_number, business_address, tax_id, 'PENDING']
      )
    }

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
