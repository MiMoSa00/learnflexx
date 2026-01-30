import type { NextAuthOptions, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare, hash } from "bcryptjs"
import { PrismaClient } from "@prisma/client"

// INLINE PRISMA CLIENT - No separate file needed!
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Extend the built-in User type
interface ExtendedUser extends User {
  password?: string
  phone?: string
  location?: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        fullName: { label: "Full Name", type: "text" },
        phone: { label: "Phone", type: "text" },
        location: { label: "Location", type: "text" },
        isSignup: { label: "Is Signup", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const isSignup = credentials.isSignup === "true"

        try {
          if (isSignup) {
            // Sign up flow
            const existingUser = await prisma.user.findUnique({
              where: { email: credentials.email }
            })
            
            if (existingUser) {
              throw new Error("User already exists")
            }

            const hashedPassword = await hash(credentials.password, 12)
            
            const newUser = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.fullName || "",
                password: hashedPassword,
                phone: credentials.phone || null,
                location: credentials.location || null,
              }
            })

            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
            }
          } else {
            // Login flow
            const user = await prisma.user.findUnique({
              where: { email: credentials.email }
            })

            if (!user || !user.password) {
              throw new Error("Invalid email or password")
            }

            const isPasswordValid = await compare(credentials.password, user.password)

            if (!isPasswordValid) {
              throw new Error("Invalid email or password")
            }

            return {
              id: user.id,
              email: user.email || "",
              name: user.name || "",
            }
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      // Handle first-time Google sign-in
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email || "" }
          })
          
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email || "",
                name: user.name || "",
                image: user.image,
                emailVerified: new Date(),
              }
            })
          }
        } catch (error) {
          console.error("Error creating Google user:", error)
          return false
        }
      }
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after successful sign-in
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
}