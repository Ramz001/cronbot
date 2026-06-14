import { SidebarProvider } from '@shared/ui/sidebar'
import { AppSidebar } from '@widgets/sidebar'
import BackgroundPattern from '@shared/ui/background-pattern'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <BackgroundPattern />
      <AppSidebar />
      <main className="w-full flex-1 space-y-6 p-4 lg:p-8">{children}</main>
    </SidebarProvider>
  )
}

export default DashboardLayout
