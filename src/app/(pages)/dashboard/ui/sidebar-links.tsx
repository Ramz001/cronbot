'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@shared/ui/sidebar'
import {
  RiCalendarLine,
  RiBarChartLine,
  RiHammerLine,
  RiStackLine,
} from '@remixicon/react'

const tabs = [
  { title: 'Calendar', url: '', icon: RiCalendarLine },
  { title: 'Stats', url: '/stats', icon: RiBarChartLine },
  { title: 'Builder', url: '/builder', icon: RiHammerLine },
  { title: 'Integrations', url: '/integrations', icon: RiStackLine },
]

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
