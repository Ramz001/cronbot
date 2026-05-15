import { Card, CardContent, CardFooter } from '@shared/ui/card'
import { auth } from '@shared/api/auth'
import OTPInputSection from './otp-input'
import SendEmailButton from './send-email-button'

export async function VerifyEmailForm() {
  const session = await auth()

  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-muted-foreground mb-1 text-sm">Email address</p>
          <p className="font-medium">{session?.user?.email}</p>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            We&apos;ll send a verification link to your email address. If you
            don&apos;t see the email, please check your spam folder.
          </p>
        </div>
        <SendEmailButton
          name={session?.user?.name || ''}
          email={session?.user?.email || ''}
        />
      </CardContent>
      <CardFooter className="w-full">
        <OTPInputSection
          name={session?.user?.name || ''}
          email={session?.user?.email || ''}
        />
      </CardFooter>
    </Card>
  )
}
