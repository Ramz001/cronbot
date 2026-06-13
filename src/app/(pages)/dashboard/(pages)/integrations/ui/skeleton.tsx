import { Skeleton } from '@shared/ui/skeleton'

export function IntegrationsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card flex flex-col rounded-xl border p-5">
            {/* Card header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-3.5 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            {/* Card body */}
            <div className="mt-5 space-y-4">
              <Skeleton className="h-9 w-full rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>

            {/* Card footer */}
            <div className="mt-4 flex justify-end">
              <Skeleton className="h-9 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
