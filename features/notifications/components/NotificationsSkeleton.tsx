import { Skeleton } from "@/components/ui/skeleton"

export function NotificationsSkeleton() {
  return (
    <div
      role="status"
      className="flex flex-col gap-2 rounded-xl border border-border bg-card p-2"
    >
      <span className="sr-only">Loading notifications…</span>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 p-4">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
