import { useTranslations } from "next-intl"

import { Skeleton } from "@/components/ui/skeleton"

/** Mirrors the final layout so nothing shifts when the content arrives. */
export function ApartmentDetailsSkeleton() {
  const t = useTranslations("apartmentDetails")

  return (
    <div
      role="status"
      className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 md:py-8 lg:px-8"
    >
      <span className="sr-only">{t("loading")}</span>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-9 w-2/3 md:w-1/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
          <Skeleton className="h-96 w-full rounded-2xl md:h-120" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
