'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { LogOut, Settings, Shield } from 'lucide-react'
import { Role } from '@shared/prisma/generated/enums'
import { Button } from '@shared/ui/button'
import { Badge } from '@shared/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu'
import { cn } from '@shared/utils/cn'
import type { Session } from 'next-auth'

type UserMenuProps = {
  user: Session['user']
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
  const isAdmin = user.role === Role.ADMIN

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
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? 'User avatar'}
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <span
              className={cn(
                'flex size-8 items-center justify-center rounded-full text-xs font-semibold',
                isAdmin
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
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
                {user.name ?? 'User'}
              </p>
              {isAdmin && (
                <Badge
                  variant="secondary"
                  className="h-4 shrink-0 px-1.5 text-[10px]"
                >
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground truncate text-xs">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings />
              Settings
            </Link>
          </DropdownMenuItem>

          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <Shield />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={async () => await signOut()}
          className="cursor-pointer"
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
