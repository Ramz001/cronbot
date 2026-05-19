import { Button } from '@/shared/ui/button'
import Link from 'next/link'
import Gutter from '@shared/ui/gutter'
import { getSession } from '@/auth'
import { headers } from 'next/headers'

export default async function HomePage() {
  const session = await getSession({
    headers: await headers(),
  })

  if (session) {
    return (
      <Gutter>
        <main className="flex h-[calc(100dvh-4rem)] flex-col"></main>
      </Gutter>
    )
  }

  return (
    <Gutter className="flex min-h-[90dvh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-foreground mb-2 text-4xl font-bold">
        Welcome to the Cronbot project👋
      </h1>

      <Button asChild>
        <Link href={'/auth/sign-in'}>Sign In</Link>
      </Button>
    </Gutter>
  )
}
