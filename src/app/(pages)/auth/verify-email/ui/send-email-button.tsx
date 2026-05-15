'use client'
import { Button } from '@shared/ui/button'
import { Send } from 'lucide-react'
import {
  SendEmailSchema,
  type SendEmailType,
} from '../models/verify-email.schema'
import { handleError } from '@shared/utils/handle-error'
import { useTransition, useState, useEffect } from 'react'
import { sendEmailOTPAction } from '../api/send-email-otp.action'
import { isSuccess } from '@shared/api/server-error-handlers'
import { Spinner } from '@shared/ui/spinner'
import { toast } from 'sonner'

export default function SendEmailButton({ email, name }: SendEmailType) {
  const [isPending, startTransition] = useTransition()
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleClick = () => {
    startTransition(async () => {
      try {
        const validated = SendEmailSchema.parse({ email, name })

        const res = await sendEmailOTPAction(validated)

        if (!isSuccess(res)) {
          throw new Error(
            res?.error?.message || 'Failed to send verification email'
          )
        }

        toast.success('Verification email sent! Check your inbox.')
        setCountdown(60)
      } catch (error) {
        handleError(error)
      }
    })
  }

  return (
    <Button
      variant={'outline'}
      size={'sm'}
      onClick={handleClick}
      disabled={isPending || countdown > 0}
    >
      {isPending ? <Spinner /> : <Send />}
      {countdown > 0 ? `Wait ${countdown}s` : 'Send Email'}
    </Button>
  )
}
