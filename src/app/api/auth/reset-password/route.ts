import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, otp, new_password } = body

    if (!email || !otp || !new_password) {
      return NextResponse.json(
        { error: "Email, OTP, and new password are required." },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // 1. Fetch user's stored OTP details
    const [rows]: any = await pool.query(
      "SELECT id, reset_otp, reset_otp_expiry FROM users WHERE email = ?",
      [normalizedEmail]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "User with this email does not exist." },
        { status: 404 }
      )
    }

    const user = rows[0]

    // 2. Validate OTP existence and match
    if (!user.reset_otp || user.reset_otp !== otp.trim()) {
      return NextResponse.json(
        { error: "Invalid OTP code." },
        { status: 400 }
      )
    }

    // 3. Verify expiry (check if current time exceeds reset_otp_expiry)
    const currentTime = new Date()
    const expiryTime = new Date(user.reset_otp_expiry)
    if (currentTime > expiryTime) {
      return NextResponse.json(
        { error: "OTP code has expired. Please request a new one." },
        { status: 400 }
      )
    }

    // 4. Hash the new password (matching salt: 12)
    const hashedPassword = await bcrypt.hash(new_password, 12)

    // 5. Update user password and clear OTP fields
    await pool.query(
      "UPDATE users SET password = ?, reset_otp = NULL, reset_otp_expiry = NULL WHERE email = ?",
      [hashedPassword, normalizedEmail]
    )

    return NextResponse.json({
      success: true,
      message: "Password reset successful."
    })

  } catch (error: any) {
    console.error("Reset password API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
