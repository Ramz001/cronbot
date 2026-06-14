'use client'

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@shared/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar'
import { RiLogoutBoxRLine } from '@remixicon/react'
import { signOut, useSession } from '@entities/auth'

export function SidebarUser() {
  const { data } = useSession()
  const user = data?.user

  if (!user) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.image || undefined} alt={user.name || ''} />
            <AvatarFallback className="rounded-lg">
              {user.name?.slice(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={async () => await signOut()}>
          <RiLogoutBoxRLine />
          <span>Log out</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
