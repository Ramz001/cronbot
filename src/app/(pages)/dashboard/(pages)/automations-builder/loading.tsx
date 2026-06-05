import { Skeleton } from '@/shared/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'

export default function CreateAutomationLoading() {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-6 pb-6">
        {/* Automation Name */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Integration */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-20 w-32 rounded-xl" />
        </div>

        {/* Server */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Channel */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Submit Button */}
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}
