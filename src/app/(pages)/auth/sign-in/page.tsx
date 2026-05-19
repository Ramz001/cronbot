import Gutter from '@shared/ui/gutter'
import { GithubLoginButton } from '@shared/ui/github-login-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'

export default function SignInPage() {
  return (
    <Gutter className="flex min-h-[90dvh] flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription>
            Log in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GithubLoginButton />
        </CardContent>
      </Card>
    </Gutter>
  )
}
