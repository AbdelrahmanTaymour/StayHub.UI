import { Skeleton } from "@/components/ui/skeleton"

export function MyApartmentsTableSkeleton() {
  return (
    <div
      role="status"
      className="overflow-hidden rounded-xl border border-border"
    >
      <span className="sr-only">Loading apartments…</span>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border p-4 last:border-0"
        >
          <Skeleton className="size-16 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
        </div>
      ))}
    </div>
  )
}
