'use client'
import { Button } from '@/shared/ui/button'
import { signOut } from '../lib/auth.client'

export function SignOutButton() {
  return (
    <Button onClick={async () => await signOut()} variant={'destructive'}>
      Sign Out
    </Button>
  )
}
