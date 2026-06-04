import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import pool from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Sanitize: trim whitespace
        const email = credentials.email.trim().toLowerCase()
        const password = credentials.password

        try {
          const [rows]: any = await pool.query(
            "SELECT id, name, email, password, role, status, contact_number, permanent_address FROM users WHERE email = ?",
            [email]
          )

          if (rows.length === 0) return null

          const user = rows[0]

          if (user.status === 'REJECTED') {
            throw new Error("Your account has been deactivated. Contact support.")
          }
          if (user.status === 'PENDING') {
            throw new Error("Your account is pending admin approval.")
          }

          // Secure comparison: bcrypt hash vs plain (with fallback for legacy)
          const passwordMatch = await bcrypt.compare(password, user.password)
            .catch(() => false)

          // Legacy fallback: plain-text match (for dev seeds), then upgrade hash
          const legacyMatch = !passwordMatch && (user.password === password)
          if (legacyMatch) {
            // Upgrade to hashed password transparently
            const hashed = await bcrypt.hash(password, 12)
            await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashed, user.id])
          }

          if (!passwordMatch && !legacyMatch) return null

          // Never expose password hash to session
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            contact_number: user.contact_number,
            permanent_address: user.permanent_address,
          }
        } catch (error: any) {
          // Surface user-visible errors (like deactivated), suppress system errors
          if (error.message?.includes("deactivated")) throw error
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.contact_number = user.contact_number
        token.permanent_address = user.permanent_address
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).contact_number = token.contact_number;
        (session.user as any).permanent_address = token.permanent_address;
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 8 * 60 * 60, // 8 hours
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

