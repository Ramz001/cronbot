'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@shared/ui/sidebar'
import Link from 'next/link'
import {
  Calendar,
  BarChart,
  Hammer,
  Blocks,
  Bot,
  LogOut,
  Command,
} from 'lucide-react'
import { useSession, signOut } from '@shared/utils/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/avatar'

const items = [
  { title: 'Calendar', url: '/', icon: Calendar },
  { title: 'Stats', url: '/stats', icon: BarChart },
  { title: 'Builder', url: '/builder', icon: Hammer },
  { title: 'Integrations', url: '/integrations', icon: Blocks },
]

export function AppSidebar() {
  const { data } = useSession()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="relative flex items-center gap-2">
            <SidebarMenuButton
              size="lg"
              className="group relative w-full flex-1"
            >
              <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Bot className="size-4" />
              </div>
              <span className="truncate text-lg font-semibold">Cronbot</span>

              <div className="bg-muted text-muted-foreground ml-auto flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-xs group-data-[collapsible=icon]:hidden">
                <Command className="size-3" />
                <span>B</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={'/dashboard' + item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {data?.user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={data.user.image || undefined}
                    alt={data.user.name || ''}
                  />
                  <AvatarFallback className="rounded-lg">
                    {data.user.name?.slice(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {data.user.name}
                  </span>
                  <span className="truncate text-xs">{data.user.email}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={async () => await signOut()}>
                <LogOut />
                <span>Log out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
