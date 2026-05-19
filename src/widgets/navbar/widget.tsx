import Link from 'next/link'
import Gutter from '@shared/ui/gutter'
import ClientSection from './ui/client-section'
import { RiTimeFill } from '@remixicon/react'

export default function Navbar() {
  return (
    <nav className="border-border/40 bg-background/80 supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <Gutter className="flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-foreground flex shrink-0 items-center gap-2 font-semibold transition-opacity hover:opacity-80"
        >
          <RiTimeFill className="text-primary size-5" />
          <span className="inline">CronBot</span>
        </Link>
        <ClientSection />
      </Gutter>
    </nav>
  )
}
