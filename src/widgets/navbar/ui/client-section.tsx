'use client'

import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'
import { useSession } from '@shared/utils/auth-client'
import { Button } from '@shared/ui/button'
import Link from 'next/link'
import { GithubLoginButton } from '@shared/ui/github-login-button'

const ClientSection = () => {
  const { data } = useSession()
  const user = data?.user

  return (
    <div className="flex items-center gap-1">
      <ThemeToggle />

      {user ? <UserMenu user={user} /> : <GithubLoginButton />}
    </div>
  )
}

export default ClientSection
