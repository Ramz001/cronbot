import { Button } from '@/shared/ui/button'
import Link from 'next/link'
import { getSession } from '@/auth'
import { headers } from 'next/headers'
import { RiArrowRightLine } from '@remixicon/react'
import { GithubLoginButton } from '@shared/ui/github-login-button'

export async function SessionButtons() {
  const session = await getSession({
    headers: await headers(),
  })

  return (
    <>
      {session ? (
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
      )}
    </>
  )
}
