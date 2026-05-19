'use client'
import { SidebarProvider, SidebarTrigger } from '@shared/ui/sidebar'
import { AppSidebar } from './ui/app-sidebar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default DashboardLayout
