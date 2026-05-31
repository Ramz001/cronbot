'use client'

import { signOut } from '@shared/utils/auth-client'
import { RiLogoutBoxFill } from '@remixicon/react'
import { Button } from '@shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu'
import { cn } from '@shared/utils/cn'
import { User } from 'better-auth'

type UserMenuProps = {
  user: User
}

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return email?.[0]?.toUpperCase() ?? 'U'
}

export function UserMenu({ user }: UserMenuProps) {
  const initials = getInitials(user.name, user.email)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="focus-visible:ring-ring size-9 rounded-full focus-visible:ring-2"
          aria-label="User menu"
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name ?? 'User avatar'}
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <span
              className={cn(
                'flex size-8 items-center justify-center rounded-full text-xs font-semibold',
                'bg-secondary text-secondary-foreground'
              )}
            >
              {initials}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* User info header */}
        <div className="flex items-start gap-3 px-3 py-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-foreground truncate text-sm font-medium">
                {user.name ?? ''}
              </p>
            </div>
            <p className="text-muted-foreground truncate text-xs">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={async () => await signOut()}
          className="cursor-pointer"
        >
          <RiLogoutBoxFill />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
