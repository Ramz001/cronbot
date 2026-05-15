import Link from 'next/link'
import { MessageSquareText } from 'lucide-react'
import Gutter from '@shared/ui/gutter'
import ClientSection from './ui/client-section'

export default function Navbar() {
  return (
    <header className="border-border/40 bg-background/80 supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <Gutter className="flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-foreground flex shrink-0 items-center gap-2 font-semibold transition-opacity hover:opacity-80"
        >
          <MessageSquareText className="text-primary size-5" />
          <span className="inline">Future Generations AI</span>
        </Link>

        {/* <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-foreground text-sm font-medium transition-opacity hover:opacity-80"
          >
            Home
          </Link>
          <Link
            href="/blogs"
            className="text-foreground text-sm font-medium transition-opacity hover:opacity-80"
          >
            Blogs
          </Link>
          <Link
            href="/blogs"
            className="text-foreground text-sm font-medium transition-opacity hover:opacity-80"
          >
            Privacy
          </Link>
        </div> */}
        <ClientSection />
      </Gutter>
    </header>
  )
}
