import crypto from 'crypto'
import { UnauthorizedError } from './errors'

const ALGORITHM = 'aes-256-cbc'

function getKey(): Buffer {
  const secret = process.env.TOKEN_SECRET
  if (!secret) {
    throw new UnauthorizedError('TOKEN_SECRET environment variable is not set')
  }
  return crypto.createHash('sha256').update(secret).digest()
}

export async function encrypt(text: string) {
  const key = getKey()
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return `${iv.toString('hex')}:${encrypted}`
}

export async function decrypt(encryptedText: string) {
  const key = getKey()
  const [ivHex, encrypted] = encryptedText.split(':')

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(ivHex, 'hex')
  )

  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}
