export function LogItemSkeleton() {
  return (
    <div className="border-border bg-card animate-pulse overflow-hidden rounded-xl border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted h-8 w-8 rounded-full" />
          <div className="bg-muted h-4 w-44 rounded" />
        </div>
        <div className="bg-muted h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function LogsPageSkeleton() {
  return (
    <>
      <div className="bg-muted h-8 w-56 animate-pulse rounded" />
      <div className="bg-muted mt-2 h-6 w-28 animate-pulse rounded" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <LogItemSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
