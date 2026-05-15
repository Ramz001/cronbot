import Gutter from '@shared/ui/gutter'
import { VerifyEmailForm } from './ui/verify-email-form'

export default async function VerifyEmailPage() {
  return (
    <Gutter className="flex min-h-[90dvh] flex-col items-center justify-center gap-4">
      <header className="max-w-md space-y-1 text-center">
        <h1 className="text-foreground text-3xl font-semibold">
          Verify Your Email
        </h1>
        <p className="text-muted-foreground text-sm">
          Please verify your email address to complete your registration and
          access all features
        </p>
      </header>
      <VerifyEmailForm />
    </Gutter>
  )
}
