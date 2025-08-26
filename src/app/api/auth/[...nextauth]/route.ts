import { prisma } from "@/lib/prisma"
import NextAuth from "next-auth"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        // Add your authentication logic here
        // Example:
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (user && await compare(credentials.password, user.password)) {
          return user
        }
        
        return null
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
    signOut: "/admin/login",
    error: "/admin/login"
  },
  session: {
    strategy: "jwt"
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }