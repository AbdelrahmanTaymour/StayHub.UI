"use client"

import { Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { FilterTabs } from "@/components/common/FilterTabs"
import { Pagination } from "@/components/common/Pagination"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/feedback/ErrorState"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useApartmentMaintenanceRequests } from "@/features/maintenance/hooks/useApartmentMaintenanceRequests"
import {
  DEFAULT_MAINTENANCE_TAB,
  MAINTENANCE_TABS,
  getMaintenanceFilter,
} from "@/features/maintenance/utils/maintenance-filters"
import { ApartmentMaintenanceTable } from "./ApartmentMaintenanceTable"
import { CreateMaintenanceRequestSheet } from "./CreateMaintenanceRequestSheet"
import { useDebouncedValue } from "@/features/apartments/hooks/useDebouncedValue"

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 350

export function ApartmentMaintenanceManager({
  apartmentId,
}: {
  apartmentId: string
}) {
  const t = useTranslations("apartmentManage.maintenance")
  const searchParams = useSearchParams()

  const status = getMaintenanceFilter(searchParams.get("filter") ?? undefined)
  const search = searchParams.get("q") ?? ""
  const page = Number(searchParams.get("page")) || 1

  const { data, isPending, isPlaceholderData, isError, refetch } =
    useApartmentMaintenanceRequests({
      apartmentId,
      status,
      search: search || undefined,
      page,
      pageSize: PAGE_SIZE,
    })

  const showSkeleton = isPending || isPlaceholderData
  const items = data?.items ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          ariaLabel={t("filterLabel")}
          defaultValue={DEFAULT_MAINTENANCE_TAB}
          options={MAINTENANCE_TABS.map((value) => ({
            value,
            label: t(`tabs.${value}`),
          }))}
        />
        <div className="flex items-center gap-2">
          <SearchField />
          <CreateMaintenanceRequestSheet apartmentId={apartmentId} />
        </div>
      </div>

      {showSkeleton ? (
        <MaintenanceTableSkeleton />
      ) : isError ? (
        <ErrorState
          title={t("errorTitle")}
          description={t("errorDescription")}
          retryLabel={t("retry")}
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <ApartmentMaintenanceTable requests={items} />
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground/70 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {t("showingCount", {
                count: items.length,
                total: data?.totalCount ?? 0,
              })}
            </span>
            <Pagination
              page={data?.page ?? page}
              totalPages={data?.totalPages ?? 1}
            />
          </div>
        </>
      )}
    </div>
  )
}

function SearchField() {
  const t = useTranslations("apartmentManage.maintenance")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const urlQuery = searchParams.get("q") ?? ""
  const [value, setValue] = useState(urlQuery)
  const debouncedValue = useDebouncedValue(value, SEARCH_DEBOUNCE_MS)

  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery)
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery)
    setValue(urlQuery)
  }

  useEffect(() => {
    if (debouncedValue === urlQuery) return

    const params = new URLSearchParams(searchParams.toString())
    if (debouncedValue) params.set("q", debouncedValue)
    else params.delete("q")
    params.delete("page")

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [debouncedValue, urlQuery, pathname, router, searchParams])

  return (
    <div className="relative w-full lg:max-w-sm">
      <Search
        aria-hidden="true"
        className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-foreground/60"
      />
      <Input
        id="maintenance-search"
        name="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
        autoComplete="off"
        className="ps-9"
      />
    </div>
  )
}

function MaintenanceTableSkeleton() {
  return (
    <div
      role="status"
      className="overflow-hidden rounded-xl border border-border"
    >
      <span className="sr-only">Loading maintenance requests…</span>
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border p-4 last:border-0"
        >
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-8 w-28 shrink-0 rounded-lg" />
        </div>
      ))}
    </div>
  )
}
