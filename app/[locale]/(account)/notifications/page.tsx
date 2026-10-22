import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getTranslations } from "next-intl/server"

import { getMyNotificationsServer } from "@/features/notifications/api/notifications.server"
import { NotificationsList } from "@/features/notifications/components/NotificationsList"
import { getQueryClient } from "@/lib/query/get-query-client"
import { queryKeys } from "@/lib/query/query-keys"

const PAGE_SIZE = 20

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notifications")
  return { title: t("pageTitle"), description: t("metaDescription") }
}

interface NotificationsPageProps {
  searchParams: Promise<{ filter?: string; page?: string }>
}

export default async function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  const { filter, page: pageParam } = await searchParams

  const unreadOnly = filter === "unread"
  const page = Number(pageParam) || 1

  const t = await getTranslations("notifications")
  const queryClient = getQueryClient()
  await queryClient.query({
    queryKey: queryKeys.notifications.list(unreadOnly, page),
    queryFn: () =>
      getMyNotificationsServer({ unreadOnly, page, pageSize: PAGE_SIZE }),
  })

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-6">
      <header>
        <h1 className="text-xl font-semibold text-foreground">
          {t("pageTitle")}
        </h1>
        <p className="mt-1 text-sm text-foreground/70">
          {t("pageDescription")}
        </p>
      </header>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotificationsList />
      </HydrationBoundary>
    </div>
  )
}
