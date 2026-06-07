import { Skeleton } from '@shared/ui/skeleton'

export const DashboardSkeleton = () => {
  return (
    <div className="border-border flex h-full w-full flex-col rounded-lg border-2 border-solid p-4">
      {/* Toolbar skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>

      {/* Day headers skeleton */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-5 w-full" />
        ))}
      </div>

      {/* Week view grid skeleton — 7 columns × ~12 rows of time slots */}
      <div className="grid flex-1 grid-cols-7 gap-px">
        {/* Time gutter */}
        <div className="flex flex-col gap-3 pr-2 pt-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={`time-${i}`} className="h-4 w-10" />
          ))}
        </div>
        {/* Day columns */}
        {Array.from({ length: 7 }).map((_, col) => (
          <div key={`col-${col}`} className="relative flex flex-col gap-3">
            {Array.from({ length: 12 }).map((_, row) => (
              <div key={`slot-${col}-${row}`} className="flex flex-col">
                <Skeleton className="h-px w-full" />
                {/* Occasional event blocks */}
                {(col === 1 && row === 2) || (col === 3 && row === 5) || (col === 5 && row === 8) ? (
                  <div className="mt-1 space-y-1 px-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
