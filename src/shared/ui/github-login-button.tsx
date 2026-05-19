'use client'

import { Button } from '@/shared/ui/button'
import { handleError } from '@shared/utils/handle-error'
import { signIn } from '@shared/utils/auth-client'
import { RiGithubFill } from '@remixicon/react'

export const GithubLoginButton = () => {
  const handleLogin = async () => {
    try {
      const { data } = await signIn.social({ provider: 'github' })
      console.log('Github login data:', data)
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <Button
      onClick={handleLogin}
      variant="outline"
      type="button"
      className="w-full"
    >
      <RiGithubFill className="h-4 w-4" />
      Sign in
    </Button>
  )
}
