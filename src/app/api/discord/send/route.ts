// app/api/discord/send/route.ts
// ⚠️  PERSONAL TESTING ONLY — selfbots violate Discord ToS

import { NextRequest, NextResponse } from 'next/server'

const DISCORD_API = 'https://discord.com/api/v9'

// Shared headers using your user token (no "Bot" prefix)
function authHeaders() {
  const token = process.env.DISCORD_USER_TOKEN
  if (!token) throw new Error('DISCORD_USER_TOKEN is not set')
  return {
    Authorization: token, // raw user token, no prefix
    'Content-Type': 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
  }
}

// ─── POST /api/discord/send ───────────────────────────────────────────────────
// Body: { message: string, channelId?: string }
// channelId falls back to DISCORD_CHANNEL_ID env var
export async function POST(req: NextRequest) {
  let headers: ReturnType<typeof authHeaders>
  try {
    headers = authHeaders()
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }

  let body: { message: string; channelId: string } = await req.json()

  const { message, channelId } = body

  if (!message) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 })
  }
  if (!channelId) {
    return NextResponse.json(
      { error: 'channelId is required (or set DISCORD_CHANNEL_ID in env)' },
      { status: 400 }
    )
  }

  const res = await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ content: message }),
  })

  if (!res.ok) {
    const error = await res.json()
    return NextResponse.json(
      { error: 'Discord API error', details: error },
      { status: res.status }
    )
  }

  const data = await res.json()
  return NextResponse.json({ success: true, messageId: data.id })
}

// ─── GET /api/discord/send ────────────────────────────────────────────────────
// ?guildId=  → text channels in that guild
// (no param) → all guilds you're in
export async function GET(req: NextRequest) {
  let headers: ReturnType<typeof authHeaders>
  try {
    headers = authHeaders()
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const guildId = searchParams.get('guildId')

  if (guildId) {
    const res = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
      headers,
    })

    if (!res.ok) {
      const error = await res.json()
      return NextResponse.json(
        { error: 'Failed to fetch channels', details: error },
        { status: res.status }
      )
    }

    const channels = await res.json()
    const textChannels = channels
      .filter((c: { type: number }) => c.type === 0) // 0 = GUILD_TEXT
      .map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))

    return NextResponse.json({ channels: textChannels })
  }

  // No guildId → list all guilds the user is in
  const res = await fetch(`${DISCORD_API}/users/@me/guilds`, { headers })

  if (!res.ok) {
    const error = await res.json()
    return NextResponse.json(
      { error: 'Failed to fetch guilds', details: error },
      { status: res.status }
    )
  }

  const guilds = await res.json()
  return NextResponse.json({
    guilds: guilds.map((g: { id: string; name: string }) => ({
      id: g.id,
      name: g.name,
    })),
  })
}
