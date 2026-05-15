import { JWT } from 'next-auth/jwt'
import { Role } from '@shared/prisma/generated/enums'

export const ADMIN_USER: JWT = {
  id: '672f182cd5370728d87c532e',
  role: Role.ADMIN,
  email: 'test@example.com',
  name: 'John Doe',
  emailVerified: new Date(Date.now()),
}

export const AUTH_USER: JWT = {
  id: '672f182cd5370728d87c535e',
  role: Role.USER,
  email: 'test@example.com',
  name: 'John Doe',
  emailVerified: new Date(Date.now()),
}
