'use client'
import { Button } from '@/shared/ui/button'
import { signOut } from 'next-auth/react'

export function SignOutButton() {
  return (
    <Button onClick={async () => await signOut()} variant={'destructive'}>
      Sign Out
    </Button>
  )
}
