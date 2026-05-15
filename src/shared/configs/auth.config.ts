import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/shared/lib/prisma'
import { LoginSchema } from '@shared/models/auth.schema'
import GithubProvider from 'next-auth/providers/github'
import { NextAuthConfig } from 'next-auth'
import { Role } from '@shared/prisma/generated/enums'
import { PrismaAdapter } from '@auth/prisma-adapter'

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/sign-in',
    newUser: '/auth/sign-up',
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = LoginSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user?.password) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (!passwordsMatch) return null

          return user
        } catch (error) {
          console.error(error, 'Unexpected error in authorize:')
          return null
        }
      },
    }),
  ],
  callbacks: {
    // With database sessions, we receive user directly from DB
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.emailVerified = user.emailVerified
      }
      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as Role
      session.user.emailVerified = token.emailVerified as Date | null
      return session
    },
  },
} satisfies NextAuthConfig
