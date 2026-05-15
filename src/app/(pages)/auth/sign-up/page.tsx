import Gutter from '@shared/ui/gutter'
import { SignUpForm } from './ui/sign-up-form'

export default function SignUpPage() {
  return (
    <Gutter className="flex min-h-[90dvh] flex-col items-center justify-center gap-4">
      <header className="space-y-1 text-center">
        <h1 className="text-foreground text-3xl font-semibold">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign up with your email and a secure password to get started.
        </p>
      </header>

      <SignUpForm />
    </Gutter>
  )
}
