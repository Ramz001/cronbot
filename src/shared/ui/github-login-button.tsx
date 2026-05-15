import { Button } from '@/shared/ui/button'
import { handleError } from '@shared/utils/handle-error'
import { signIn } from 'next-auth/react'
import { usePostHog } from 'posthog-js/react'

export const GithubLoginButton = () => {
  const posthog = usePostHog()

  const handleLogin = async () => {
    try {
      await signIn('github', { redirect: true, redirectTo: '/' })
      posthog.capture('signed_in_github')
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <Button onClick={handleLogin} variant="outline" type="button">
      Login with Github
    </Button>
  )
}
