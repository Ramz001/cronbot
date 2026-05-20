// import '@shared/configs/env'
import ToastProvider from './toast.provider'
import ThemeProvider from './theme.provider'
import { TooltipProvider } from '@shared/ui/tooltip'
import NuqsProvider from './nuqs.provider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <TooltipProvider>
        <ThemeProvider>
          <NuqsProvider>
            <ToastProvider>{children}</ToastProvider>
          </NuqsProvider>
        </ThemeProvider>
      </TooltipProvider>
    </>
  )
}
