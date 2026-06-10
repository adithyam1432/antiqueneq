import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import nodemailer from 'nodemailer'

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

    const user = rows[0]

    // 2. Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // 3. Set expiry timestamp (10 minutes from now)
    const expiry = new Date(Date.now() + 10 * 60 * 1000)

    // 4. Update OTP fields in the database
    await pool.query(
      "UPDATE users SET reset_otp = ?, reset_otp_expiry = ? WHERE email = ?",
      [otp, expiry, email]
    )

    // 5. Check if SMTP configuration is available
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPassword = process.env.SMTP_PASSWORD
    const emailFrom = process.env.EMAIL_FROM || 'no-reply@antiques.com'

    const isSmtpConfigured = smtpHost && smtpPort && smtpUser && smtpPassword

    if (isSmtpConfigured) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort || '587'),
          secure: smtpPort === '465', // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPassword,
          },
          tls: {
            rejectUnauthorized: false // Avoid blocking on self-signed cert issues
          }
        })

        const mailOptions = {
          from: `"Antiques Marketplace" <${emailFrom}>`,
          to: email,
          subject: 'Your Password Reset OTP - Antiques Marketplace',
          text: `Hello ${user.name},\n\nYou requested a password reset. Your 6-digit verification code is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #d4af37; border-radius: 8px; background-color: #032b2b; color: #ffffff;">
              <h2 style="color: #d4af37; border-bottom: 1px solid #d4af37; padding-bottom: 10px; margin-top: 0; font-family: Georgia, serif;">Antiques Marketplace</h2>
              <p style="font-size: 16px; line-height: 1.5; color: #e2e8f0;">Hello ${user.name},</p>
              <p style="font-size: 16px; line-height: 1.5; color: #e2e8f0;">You requested a password reset. Please use the following 6-digit verification code to complete the process:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 30px 0; color: #d4af37; padding: 12px; background-color: rgba(212, 175, 55, 0.08); border-radius: 6px; border: 1px dashed #d4af37; font-family: monospace;">
                ${otp}
              </div>
              <p style="font-size: 14px; color: #a0aec0; line-height: 1.5;">This verification code is valid for 10 minutes. If you did not request a password reset, please ignore this email and secure your account.</p>
              <hr style="border: 0; border-top: 1px solid rgba(212, 175, 55, 0.3); margin: 20px 0;">
              <p style="font-size: 12px; color: #a0aec0; text-align: center; margin-bottom: 0; letter-spacing: 1px;">Secure Antique Transactions & Escrow Network</p>
            </div>
          `
        }

        await transporter.sendMail(mailOptions)
        console.log(`[SMTP] Successfully sent password reset email to: ${email}`)

        return NextResponse.json({
          success: true,
          message: "Password reset OTP has been sent to your email."
        })

      } catch (mailError: any) {
        console.error("[SMTP] Mail delivery failed, logging OTP to console:", mailError)
        // Fallback logging in case of mail delivery failure
      }
    }

    // 6. Fallback: Log the OTP to the server console if SMTP is unconfigured or failed
    console.log("\n==========================================")
    console.log(`[PASSWORD RESET OTP] (Console Fallback)`)
    console.log(`Email:  ${email}`)
    console.log(`OTP:    ${otp}`)
    console.log(`Expiry: ${expiry.toISOString()}`)
    console.log("==========================================\n")

    return NextResponse.json({
      success: true,
      message: "Password reset OTP has been generated. (Please check server logs or inbox)"
    })

  } catch (error: any) {
    console.error("Forgot password API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
