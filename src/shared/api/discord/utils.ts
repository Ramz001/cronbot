export const DISCORD_API = 'https://discord.com/api/v9'
import UserAgent from 'user-agents'

const ua = new UserAgent({ deviceCategory: 'desktop' })

const SESSION_HEADERS = {
  'User-Agent': ua.toString(),

  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',

  'Accept-Language': 'en-US,en;q=0.9',

  Connection: 'keep-alive',

  'sec-ch-ua':
    '"Google Chrome";v="124", "Chromium";v="124", "Not-A.Brand";v="99"',

  'sec-ch-ua-mobile': '?0',

  'sec-ch-ua-platform': '"Windows"',
}

export const authHeaders = () => {
  const token = process.env.DISCORD_USER_TOKEN

  if (!token) throw new Error('DISCORD_USER_TOKEN is not set')

  return {
    Authorization: token,
    ...SESSION_HEADERS,
  }
}
