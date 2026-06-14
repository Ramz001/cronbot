'use client'

import { Button } from '@/shared/ui/button'
import { handleError } from '@shared/utils/handle-error'
import { signIn } from '@shared/utils/auth-client'
import { RiGithubFill } from '@remixicon/react'

export const GithubLoginButton = ({
  className,
  title = 'Sign in',
}: {
  className?: string
  title?: string
}) => {
  const handleLogin = async () => {
    try {
      const result = await signIn.social({ provider: 'github' })
      result.error && handleError(result.error?.message || result.error?.code)
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <Button
      onClick={handleLogin}
      variant="outline"
      type="button"
      className={className}
    >
      <RiGithubFill className="h-4 w-4" />
      {title}
    </Button>
  )
}
