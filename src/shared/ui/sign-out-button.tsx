'use client'
import { Button } from '@/shared/ui/button'
import { signOut } from '@shared/utils/auth-client'

export function SignOutButton() {
  return (
    <Button onClick={async () => await signOut()} variant={'destructive'}>
      Sign Out
    </Button>
  )
}
