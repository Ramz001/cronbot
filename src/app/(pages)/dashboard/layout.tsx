'use client'
import { SidebarProvider, SidebarTrigger } from '@shared/ui/sidebar'
import { AppSidebar } from './ui/app-sidebar'
import BackgroundPattern from '@shared/ui/background-pattern'
import Gutter from '@shared/ui/gutter'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <BackgroundPattern />
      <AppSidebar />
      <Gutter className="py-4 lg:py-8">{children}</Gutter>
    </SidebarProvider>
  )
}

export default DashboardLayout
