'use client'
import { SidebarProvider, SidebarTrigger } from '@shared/ui/sidebar'
import { AppSidebar } from './ui/app-sidebar'
import BackgroundPattern from '@shared/ui/background-pattern'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <BackgroundPattern />
      <AppSidebar />
      <main className="flex-1 w-full p-4 lg:p-8">{children}</main>
    </SidebarProvider>
  )
}

export default DashboardLayout
