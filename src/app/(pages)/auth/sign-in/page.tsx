import Gutter from '@shared/ui/gutter'
import { SignInForm } from './ui/sign-in-form'

export default function SignInPage() {
  return (
    <Gutter className="flex min-h-[90dvh] flex-col items-center justify-center gap-4">
      <header className="space-y-1 text-center">
        <h1 className="text-foreground text-3xl font-semibold">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Sign in with your email and password to continue.
        </p>
      </header>

      <SignInForm />
    </Gutter>
  )
}
