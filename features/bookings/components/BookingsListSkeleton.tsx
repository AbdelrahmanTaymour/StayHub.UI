import { Skeleton } from "@/components/ui/skeleton"

export function BookingsListSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-4">
      <span className="sr-only">Loading bookings…</span>
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-border lg:grid lg:grid-cols-12"
        >
          <Skeleton className="aspect-video w-full lg:col-span-4 lg:aspect-auto lg:h-full" />
          <div className="flex flex-col gap-3 p-6 lg:col-span-8">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
