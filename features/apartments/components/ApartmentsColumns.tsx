"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { MapPin, Star } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { formatPrice } from "@/lib/utils/formatPrice"
import type { ApartmentsTableFeatures } from "../utils/apartments-table-features"
import { MyApartmentsResponse } from "@/lib/api/types/apartments"
import { ApartmentRowActions } from "./ApartmentRowActions"

const columnHelper = createColumnHelper<
  ApartmentsTableFeatures,
  MyApartmentsResponse
>()

/**
 * useApartmentColumns, not a static export, because row actions need
 * mutations and translations — both are hooks, so the column defs are
 * built inside a component, memoized per locale/mutation-identity.
 */
export function useApartmentColumns(locale: string) {
  const t = useTranslations("myApartments.table")

  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: t("apartmentDetails"),
      cell: ({ row }) => {
        const apartment = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
              {apartment.primaryImageUrl ? (
                <Image
                  src={apartment.primaryImageUrl}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">
                {apartment.name ?? t("untitled")}
              </p>
              {apartment.city || apartment.country ? (
                <p className="mt-1 flex items-center gap-1 text-sm text-foreground/70">
                  <MapPin aria-hidden="true" className="size-3.5" />
                  <span className="truncate">
                    {[apartment.city, apartment.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
        )
      },
    }),

    columnHelper.accessor("isActive", {
      header: t("status"),
      cell: ({ getValue }) => {
        const isActive = getValue()
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isActive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
            }`}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-amber-500"}`}
            />
            {isActive ? t("statusActive") : t("statusInactive")}
          </span>
        )
      },
    }),

    columnHelper.accessor("pricePerNight", {
      header: t("nightlyRate"),
      cell: ({ row }) => {
        const { pricePerNight, currency } = row.original
        if (pricePerNight == null || !currency) return "—"
        return (
          <span className="font-semibold text-foreground">
            {formatPrice(pricePerNight, currency, locale)}
            <span className="ms-1 font-normal text-foreground/70">
              {t("perNight")}
            </span>
          </span>
        )
      },
    }),

    columnHelper.display({
      id: "performance",
      header: t("performance"),
      cell: ({ row }) => {
        const { occupancyRateLast30Days, rating, reviewCount } = row.original
        return (
          <div>
            {occupancyRateLast30Days != null ? (
              <p className="font-semibold text-foreground">
                {t("occupancyPercent", {
                  value: occupancyRateLast30Days.toFixed(0),
                })}
              </p>
            ) : null}
            {rating != null ? (
              <p className="mt-0.5 flex items-center gap-1 text-sm text-foreground/70">
                <Star
                  aria-hidden="true"
                  className="size-3.5 fill-rating text-rating"
                />
                <span className="font-medium text-foreground">
                  {rating.toFixed(2)}
                </span>
                <span>{t("reviewsCount", { count: reviewCount ?? 0 })}</span>
              </p>
            ) : null}
          </div>
        )
      },
    }),

    columnHelper.display({
      id: "subResources",
      header: t("subResources"),
      cell: ({ row }) => {
        const { photoCount, pendingBookingsCount } = row.original
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs text-foreground">
              {t("photosCount", { count: photoCount ?? 0 })}
            </span>
            {pendingBookingsCount ? (
              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                {t("pendingCount", { count: pendingBookingsCount })}
              </span>
            ) : null}
          </div>
        )
      },
    }),

    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">{t("operations")}</span>,
      cell: ({ row }) => <ApartmentRowActions apartment={row.original} t={t} />,
    }),
  ])
}
