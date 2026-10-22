"use client"

import { BellOff } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { FilterTabs } from "@/components/common/FilterTabs"
import { Pagination } from "@/components/common/Pagination"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { useMyNotifications } from "@/features/notifications/hooks/useMyNotifications"
import { NotificationRow } from "./NotificationRow"
import { NotificationsSkeleton } from "./NotificationsSkeleton"

const PAGE_SIZE = 20
const TABS = [
  { value: "all", label: "all" },
  { value: "unread", label: "unread" },
] as const

export function NotificationsList() {
  const t = useTranslations("notifications")
  const searchParams = useSearchParams()

  const filter = searchParams.get("filter") === "unread" ? "unread" : "all"
  const page = Number(searchParams.get("page")) || 1

  const { data, isPending, isPlaceholderData, isError, refetch } =
    useMyNotifications({
      unreadOnly: filter === "unread",
      page,
      pageSize: PAGE_SIZE,
    })

  const showSkeleton = isPending || isPlaceholderData
  const items = data?.items ?? []

  return (
    <div className="flex flex-col gap-4">
      <FilterTabs
        ariaLabel={t("filterLabel")}
        defaultValue="all"
        options={TABS.map((tab) => ({
          value: tab.value,
          label: t(`tabs.${tab.label}`),
        }))}
      />

      {showSkeleton ? (
        <NotificationsSkeleton />
      ) : isError ? (
        <ErrorState
          title={t("errorTitle")}
          description={t("errorDescription")}
          retryLabel={t("retry")}
          onRetry={() => refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<BellOff className="size-10" />}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <>
          <ul className="flex flex-col gap-1 rounded-xl border border-border bg-card p-2 shadow-sm">
            {items.map((notification) => (
              <li key={notification.id}>
                <NotificationRow notification={notification} />
              </li>
            ))}
          </ul>
          <Pagination
            page={data?.page ?? page}
            totalPages={data?.totalPages ?? 1}
          />
        </>
      )}
    </div>
  )
}
