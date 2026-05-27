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
  RiStackLine,
  RiRobot2Line,
  RiFileListLine,
  RiFlowChart,
} from '@remixicon/react'

const tabs = [
  { title: 'Calendar', url: '', icon: RiCalendarLine },
  { title: 'Builder', url: '/builder', icon: RiFlowChart },
  { title: 'Automations', url: '/automations', icon: RiRobot2Line },
  { title: 'Integrations', url: '/integrations', icon: RiStackLine },
  { title: 'Logs', url: '/logs', icon: RiFileListLine },
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
