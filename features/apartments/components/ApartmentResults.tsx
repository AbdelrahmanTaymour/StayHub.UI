"use client"

import { SearchX } from "lucide-react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

import { Link, usePathname } from "@/i18n/navigation"
import { buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import {
  ApartmentGrid,
  ApartmentGridSkeleton,
} from "@/features/apartments/components/ApartmentGrid"
import { useSearchApartments } from "@/features/apartments/hooks/useSearchApartments"
import {
  filtersFromSearchParams,
  filtersToSearchParams,
} from "@/features/apartments/utils/search-params"
import { cn } from "cn"
import { useEffect, useRef } from "react"

export function ApartmentResults() {
  const t = useTranslations("home")
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const filters = filtersFromSearchParams(searchParams)

  const { data, isPending, isPlaceholderData, isError, refetch, isFetching } =
    useSearchApartments(filters)

  const isSearching = isPlaceholderData
  const showSkeleton = isPending || isSearching

  const items = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const page = data?.page ?? filters.page ?? 1
  const totalPages = data?.totalPages ?? 1

  const sectionRef = useRef<HTMLDivElement>(null)
  const previousPage = useRef(page)

  useEffect(() => {
    // Skip the first render and any unchanged page, so loading doesn't jump the scroll.
    if (previousPage.current === page) return
    previousPage.current = page

    // Wait until the new results are rendered, not the skeleton from the previous page.
    if (isPlaceholderData || isPending) return

    sectionRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    })
  }, [page, isPlaceholderData, isPending])

  function hrefForPage(targetPage: number) {
    const params = filtersToSearchParams({ ...filters, page: targetPage })
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  return (
    <div ref={sectionRef} className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-2 border-b border-border pb-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <h2
            id="results-heading"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            {t("resultsHeading")}
          </h2>
          <p
            className="text-sm text-foreground"
            role="status"
            aria-live="polite"
          >
            {showSkeleton
              ? t("resultsLoading")
              : t("resultsCount", { count: totalCount })}
          </p>
        </div>
      </div>

      {showSkeleton ? (
        <ApartmentGridSkeleton />
      ) : isError ? (
        <ErrorState
          title={t("errorTitle")}
          description={t("errorDescription")}
          retryLabel={t("retry")}
          onRetry={() => refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<SearchX className="size-10" />}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <Link
              href={pathname}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              {t("clearFilters")}
            </Link>
          }
        />
      ) : (
        <>
          <ApartmentGrid apartments={items} />

          {totalPages > 1 ? (
            <nav
              aria-label={t("paginationLabel")}
              className="flex items-center justify-center gap-4 pt-2"
            >
              <Link
                href={hrefForPage(page - 1)}
                scroll={false}
                aria-disabled={page <= 1}
                tabIndex={page <= 1 ? -1 : undefined}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  page <= 1 && "pointer-events-none opacity-50"
                )}
              >
                {t("pagination.previous")}
              </Link>

              <span className="text-sm text-foreground" aria-live="polite">
                {t("pagination.status", { page, totalPages })}
              </span>
              <Link
                href={hrefForPage(page + 1)}
                scroll={false}
                aria-disabled={page >= totalPages}
                tabIndex={page >= totalPages ? -1 : undefined}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  (page >= totalPages || isFetching) &&
                    "pointer-events-none opacity-50"
                )}
              >
                {t("pagination.next")}
              </Link>
            </nav>
          ) : null}
        </>
      )}
    </div>
  )
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
