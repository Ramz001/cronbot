import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RootProvider from '@app/_providers/root.provider'
import Navbar from '@widgets/navbar'
import BackgroundPattern from '@shared/ui/background-pattern'
import { cn } from '@shared/utils/cn'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Cronbot - Schedule and automate your tasks with ease',
  description:
    'Cronbot is a task scheduling and automation tool that helps you manage your tasks efficiently. With Cronbot, you can easily create, schedule, and automate your tasks to save time and increase productivity.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('font-sans', inter.variable)}
    >
      <body className={`${inter.variable} antialiased`}>
        <RootProvider>
          <BackgroundPattern />
          <Navbar />
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
