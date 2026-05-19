import { Button } from '@/shared/ui/button'
import Link from 'next/link'
import Gutter from '@shared/ui/gutter'
import { getSession } from '@/auth'
import { headers } from 'next/headers'
import Navbar from '@widgets/navbar'

export default async function HomePage() {
  const session = await getSession({
    headers: await headers(),
  })

  return (
    <>
      <Navbar />
      <Gutter className="flex min-h-[90dvh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-foreground mb-2 text-4xl font-bold">
          Welcome to the Cronbot project👋
        </h1>
        <p className="text-foreground/80 mb-4 text-lg">
          Manage your scheduled tasks and stay organized with ease.
        </p>
        <Button asChild>
          {session ? (
            <Link href={'/dashboard'}>Go to Dashboard</Link>
          ) : (
            <Link href={'/auth/sign-in'}>Sign In</Link>
          )}
        </Button>
      </Gutter>
    </>
  )
}
