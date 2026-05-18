import { Button } from '@/shared/ui/button'
import { handleError } from '@shared/utils/handle-error'
import { signIn } from '@shared/utils/auth-client'

export const GithubLoginButton = () => {
  const handleLogin = async () => {
    try {
      const { data, error } = await signIn.social({
        provider: 'github',
      })
      if (error) {
        throw new Error(error.message || 'Github login failed')
      }
      console.log(data)
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
