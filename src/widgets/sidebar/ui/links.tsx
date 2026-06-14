'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@shared/ui/sidebar'
import { tabs } from '../consts/tabs'

export function SidebarLinks() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {tabs.map((item) => {
        const itemPath = `/dashboard${item.url}`
        const isActive = pathname === itemPath
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link href={itemPath}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
