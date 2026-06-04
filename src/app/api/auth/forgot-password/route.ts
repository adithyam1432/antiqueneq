import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body?.email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 })
    }

    const email = body.email.trim().toLowerCase()

    // 1. Verify user exists
    const [rows]: any = await pool.query(
      "SELECT id, name FROM users WHERE email = ?",
      [email]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "User with this email does not exist." },
        { status: 404 }
      )
    }

    // 2. Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // 3. Set expiry timestamp (10 minutes from now)
    const expiry = new Date(Date.now() + 10 * 60 * 1000)

    // 4. Update OTP fields in the database
    await pool.query(
      "UPDATE users SET reset_otp = ?, reset_otp_expiry = ? WHERE email = ?",
      [otp, expiry, email]
    )

    // 5. Log the OTP to the server console for local testing
    console.log("\n==========================================")
    console.log(`[PASSWORD RESET OTP]`)
    console.log(`Email:  ${email}`)
    console.log(`OTP:    ${otp}`)
    console.log(`Expiry: ${expiry.toISOString()}`)
    console.log("==========================================\n")

    return NextResponse.json({
      success: true,
      message: "Password reset OTP has been generated."
    })

  } catch (error: any) {
    console.error("Forgot password API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
