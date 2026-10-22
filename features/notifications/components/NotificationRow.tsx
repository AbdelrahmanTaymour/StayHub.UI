"use client"

import { useLocale, useTranslations } from "next-intl"

import { Link, useRouter } from "@/i18n/navigation"
import { cn } from "cn"
import { useMarkNotificationRead } from "@/features/notifications/hooks/useMarkNotificationRead"
import {
  getNotificationHref,
  getNotificationMessage,
} from "@/features/notifications/utils/notification-target"
import { NOTIFICATION_ICONS } from "@/features/notifications/utils/notification-icon"
import { MyNotificationsResponse } from "@/lib/api/types/notifications"

export function NotificationRow({
  notification,
}: {
  notification: MyNotificationsResponse
}) {
  const t = useTranslations("notifications")
  const locale = useLocale()
  const router = useRouter()
  const { mutate: markRead } = useMarkNotificationRead()

  if (!notification.type) return null

  const Icon = NOTIFICATION_ICONS[notification.type]
  const message = getNotificationMessage(
    notification.type,
    notification.payload,
    t("genericMessage")
  )
  const href = getNotificationHref(notification.type, notification.payload)
  const isUnread = !notification.isRead
  const timeLabel = notification.createdOnUtc
    ? formatRelative(notification.createdOnUtc, locale, t)
    : null

  function handleActivate() {
    if (isUnread && notification.id) markRead(notification.id)
    if (href) router.push(href)
  }

  const content = (
    <div
      className={cn(
        "flex w-full items-start gap-3 rounded-xl p-4 text-start transition-colors",
        isUnread ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          isUnread
            ? "bg-primary/10 text-primary"
            : "bg-muted text-foreground/70"
        )}
      >
        <Icon className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm leading-relaxed",
            isUnread ? "font-medium text-foreground" : "text-foreground/80"
          )}
        >
          {message}
        </p>
        {timeLabel ? (
          <p className="mt-1 text-xs text-foreground/60">{timeLabel}</p>
        ) : null}
      </div>

      {isUnread ? (
        <span
          aria-label={t("unreadLabel")}
          className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
        />
      ) : null}
    </div>
  )

  if (href) {
    return (
      <Link
        href={href}
        onClick={handleActivate}
        className="block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={handleActivate}
      disabled={!isUnread}
      className="block w-full disabled:cursor-default"
    >
      {content}
    </button>
  )
}

function formatRelative(
  value: string,
  locale: string,
  t: ReturnType<typeof useTranslations<"notifications">>
) {
  const diffMs = Date.now() - new Date(value).getTime()
  const diffMinutes = Math.floor(diffMs / 60_000)
  if (diffMinutes < 1) return t("justNow")
  if (diffMinutes < 60) return t("minutesAgo", { count: diffMinutes })
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return t("hoursAgo", { count: diffHours })
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return t("daysAgo", { count: diffDays })
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}
