"use client"

import { Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { Pagination } from "@/components/common/Pagination"
import { FilterTabs } from "@/components/common/FilterTabs"
import { Input } from "@/components/ui/input"
import { ErrorState } from "@/components/feedback/ErrorState"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useMyApartments } from "@/features/apartments/hooks/useMyApartments"
import {
  APARTMENT_TABS,
  DEFAULT_APARTMENT_TAB,
  getApartmentFilter,
} from "@/features/apartments/utils/apartment-filters"
import { MyApartmentsTable } from "./MyApartmentsTable"
import { MyApartmentsTableSkeleton } from "./MyApartmentsTableSkeleton"
import { useDebouncedValue } from "../hooks/useDebouncedValue"

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 350

export function MyApartmentsView() {
  const t = useTranslations("myApartments")
  const searchParams = useSearchParams()

  const status = getApartmentFilter(searchParams.get("filter") ?? undefined)
  const search = searchParams.get("q") ?? ""
  const page = Number(searchParams.get("page")) || 1

  const { data, isPending, isPlaceholderData, isError, refetch } =
    useMyApartments({
      status,
      search: search || undefined,
      page,
      pageSize: PAGE_SIZE,
    })

  const showSkeleton = isPending || isPlaceholderData
  const items = data?.items ?? []

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          ariaLabel={t("table.filterLabel")}
          defaultValue={DEFAULT_APARTMENT_TAB}
          options={APARTMENT_TABS.map((value) => ({
            value,
            label: t(`tabs.${value}`),
          }))}
        />
        <SearchField />
      </div>

      {showSkeleton ? (
        <MyApartmentsTableSkeleton />
      ) : isError ? (
        <ErrorState
          title={t("errorTitle")}
          description={t("errorDescription")}
          retryLabel={t("retry")}
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <MyApartmentsTable data={items} emptyMessage={t("table.empty")} />
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
  const t = useTranslations("myApartments")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const urlQuery = searchParams.get("q") ?? ""
  const [value, setValue] = useState(urlQuery)
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery)

  // Synchronize input state when the URL changes externally.
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery)
    setValue(urlQuery)
  }

  const debouncedValue = useDebouncedValue(value, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    // Ignore stale debounce values after URL navigation.
    if (debouncedValue !== value) return

    if (debouncedValue === urlQuery) return

    const params = new URLSearchParams(searchParams.toString())

    if (debouncedValue) {
      params.set("q", debouncedValue)
    } else {
      params.delete("q")
    }

    params.delete("page")

    const query = params.toString()
    const nextUrl = query ? `${pathname}?${query}` : pathname

    router.replace(nextUrl, { scroll: false })
  }, [debouncedValue, value, urlQuery, searchParams, pathname, router])

  return (
    <div className="relative w-full lg:max-w-sm">
      <Search
        aria-hidden="true"
        className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-foreground/60"
      />

      <Input
        id="apartments-search"
        name="search"
        type="search"
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
