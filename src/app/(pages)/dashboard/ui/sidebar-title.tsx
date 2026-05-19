import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@shared/ui/sidebar'
import { RiRobot2Line, RiCommandLine } from '@remixicon/react'

const SidebarTitle = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="relative flex items-center gap-2">
        <SidebarMenuButton size="lg" className="group relative w-full flex-1">
          <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <RiRobot2Line className="size-4" />
          </div>
          <span className="truncate text-lg font-semibold">Cronbot</span>

          <div className="bg-muted text-muted-foreground ml-auto flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-xs group-data-[collapsible=icon]:hidden">
            <RiCommandLine className="size-3" />
            <span>B</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default SidebarTitle
