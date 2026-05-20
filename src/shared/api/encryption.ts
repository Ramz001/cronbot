'use server'

import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'
const SECRET = process.env.TOKEN_SECRET!

// must be 32 bytes
const KEY = crypto.createHash('sha256').update(SECRET).digest()

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return `${iv.toString('hex')}:${encrypted}`
}

export function decrypt(encryptedText: string) {
  const [ivHex, encrypted] = encryptedText.split(':')

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(ivHex, 'hex')
  )

  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}
