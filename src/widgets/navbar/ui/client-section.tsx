'use client'

import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'
import { useSession } from '@entities/auth'
import { GithubLoginButton } from '@entities/auth'

const ClientSection = () => {
  const { data } = useSession()

  return (
    <div className="flex items-center gap-1">
      <ThemeToggle />

      {data?.user ? <UserMenu user={data?.user} /> : <GithubLoginButton />}
    </div>
  )
}

export default ClientSection
