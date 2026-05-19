import { cn } from '@shared/utils/cn'

export default function Gutter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('container mx-auto px-4', className)}>
      {children}
    </section>
  )
}
