'use client'

import { ThemeToggle } from './theme-toggle'
import { useSession } from 'next-auth/react'
import { UserMenu } from './user-menu'
import { Button } from '@shared/ui/button'
import Link from 'next/link'

const ClientSection = () => {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <div className="flex items-center gap-1">
      <ThemeToggle />

      {user ? (
        <UserMenu user={user} />
      ) : (
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default ClientSection
