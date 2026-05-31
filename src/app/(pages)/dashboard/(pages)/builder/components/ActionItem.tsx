'use client'

export default function ActionItem({
  a,
  isActive,
  className = '',
}: {
  a: any
  isActive: boolean
  className?: string
}) {
  if (!a) return null

  const Icon = a.icon
  return (
    <div
      className={`hover:bg-muted/50 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        isActive ? 'bg-muted/80 font-medium' : 'text-muted-foreground'
      } ${className}`}
    >
      <span className="inline-flex items-center justify-center size-7 rounded-md bg-background border border-border/50 shadow-sm">
        <Icon className={`size-4 ${a.color}`} />
      </span>
      <span className="truncate">{a.label}</span>
    </div>
  )
}
