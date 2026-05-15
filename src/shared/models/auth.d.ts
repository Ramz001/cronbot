import { Role } from '@shared/prisma/generated/enums'
import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string
    role?: Role
    emailVerified: Date | null
  }

  interface Session {
    user: {
      id: string
      role: Role
      emailVerified: Date | null
    } & DefaultSession['user']
  }

  interface JWT {
    id: string
    name: string
    email: string
    emailVerified: Date | null
    role: Role
    image?: string
  }
}
