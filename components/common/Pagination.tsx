"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "cn"

interface PaginationProps {
  page: number
  totalPages: number
  className?: string
}

/** Page links that keep every other query parameter, so filters survive paging. */
export function Pagination({ page, totalPages, className }: PaginationProps) {
  const t = useTranslations("common.pagination")
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const isFirst = page <= 1
  const isLast = page >= totalPages

  function hrefFor(target: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (target <= 1) params.delete("page")
    else params.set("page", String(target))

    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  return (
    <nav
      aria-label={t("label")}
      className={cn("flex items-center justify-center gap-4", className)}
    >
      <Link
        href={hrefFor(page - 1)}
        scroll={false}
        aria-disabled={isFirst}
        tabIndex={isFirst ? -1 : undefined}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-1",
          isFirst && "pointer-events-none opacity-50"
        )}
      >
        <ChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
        {t("previous")}
      </Link>

      <span className="text-sm text-foreground" aria-live="polite">
        {t("status", { page, totalPages })}
      </span>

      <Link
        href={hrefFor(page + 1)}
        scroll={false}
        aria-disabled={isLast}
        tabIndex={isLast ? -1 : undefined}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-1",
          isLast && "pointer-events-none opacity-50"
        )}
      >
        {t("next")}
        <ChevronRight aria-hidden="true" className="size-4 rtl:rotate-180" />
      </Link>
    </nav>
  )
}
