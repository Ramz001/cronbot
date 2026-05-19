import { cn } from '@/shared/lib/utils'
import { RiLoaderLine } from '@remixicon/react'

function Spinner(props: React.ComponentProps<typeof RiLoaderLine>) {
  const { className, ...rest } = props

  return (
    <RiLoaderLine
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...rest}
    />
  )
}

export { Spinner }
