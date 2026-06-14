import { Button } from '@/shared/ui/button'
import { Suspense } from 'react'
import { RiSparklingLine } from '@remixicon/react'
import { getSession } from '@/auth'
import { headers } from 'next/headers'
import { RiArrowRightLine } from '@remixicon/react'
import { GithubLoginButton } from '@entities/auth'
import Link from 'next/link'
import Gutter from '@shared/ui/gutter'
import Navbar from '@widgets/navbar'

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background layer */}
      <div className="bg-background pointer-events-none absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-size-[24px_24px]">
        <div className="bg-primary absolute top-0 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full opacity-50 blur-[120px]" />
      </div>

      <Navbar />

      {/* Content layer */}
      <Gutter className="relative z-10 flex min-h-[90dvh] flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
        <div className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors sm:mb-4">
          <RiSparklingLine className="text-primary h-4 w-4" />
          <span>Discord Self-Bot Integration</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Automate your{' '}
          <span className="from-primary to-primary/60 bg-linear-to-r bg-clip-text text-transparent">
            work tasks
          </span>
        </h1>

        <p className="text-muted-foreground max-w-2xl sm:text-xl sm:leading-8">
          Professional Discord self-bot platform to manage, execute, and scale
          daily automated work routines.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <Suspense
            fallback={
              <Button
                size="lg"
                className="h-12 w-full px-8 font-semibold sm:w-auto"
                disabled
              >
                Loading...
              </Button>
            }
          >
            <SessionButtons />
          </Suspense>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 w-full px-8 font-semibold sm:w-auto"
          >
            <Link href={'https://docs.cronbot.uz'}>Documentation</Link>
          </Button>
        </div>
      </Gutter>
    </main>
  )
}

async function SessionButtons() {
  const session = await getSession({
    headers: await headers(),
  })

  return session ? (
    <Button
      asChild
      size="lg"
      className="h-12 w-full px-8 font-semibold sm:w-auto"
    >
      <Link href="/dashboard">
        Go to Dashboard <RiArrowRightLine className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  ) : (
    <GithubLoginButton
      className="h-12 w-full px-8 font-semibold sm:w-auto"
      title="Continue with GitHub"
    />
  )
}
