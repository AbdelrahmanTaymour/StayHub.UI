"use client"

import { MessageSquareOff } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmptyState } from "@/components/feedback/EmptyState"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "cn"
import { useMyConversations } from "../hooks/useMyConversations"

export function ConversationsSidebar() {
  const t = useTranslations("chats")
  const locale = useLocale()
  const pathname = usePathname()
  const { data, isPending } = useMyConversations()
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const conversations = data ?? []

    if (!search.trim()) return conversations
    const needle = search.trim().toLowerCase()
    return conversations.filter((c) =>
      (c.otherPartyName ?? "").toLowerCase().includes(needle)
    )
  }, [data, search])

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="px-4 pt-4 lg:hidden">
        <h1 className="text-lg font-semibold text-foreground">
          {t("pageTitle")}
        </h1>
      </div>

      <div className="p-4 pb-2">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-foreground/60"
          />
          <Input
            id="chat-search"
            name="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            autoComplete="off"
            className="ps-9"
          />
        </div>
      </div>

      <ScrollArea
        className="min-h-0 flex-1"
        aria-label={t("conversationsListLabel")}
      >
        {isPending ? (
          <ConversationsSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<MessageSquareOff className="size-10" />}
            title={t("inboxEmptyTitle")}
            description={t("inboxEmptyDescription")}
            className="border-0"
          />
        ) : (
          <ul className="flex flex-col gap-1 px-2 py-2">
            {filtered.map((conversation) => {
              const isActive = pathname === `/me/chats/${conversation.id}`
              const name =
                conversation.otherPartyName ?? t("unknownParticipant")

              return (
                <li key={conversation.id}>
                  <Link
                    href={`/me/chats/${conversation.id}`}
                    className={cn(
                      "flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted",
                      isActive && "bg-muted"
                    )}
                  >
                    <Avatar className="size-12 shrink-0">
                      <AvatarImage
                        src={conversation.otherPartyAvatarUrl ?? undefined}
                        alt=""
                      />
                      <AvatarFallback>{getInitials(name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-center justify-between gap-1">
                        <span className="truncate font-semibold text-foreground">
                          {name}
                        </span>
                        {conversation.lastMessageOnUtc ? (
                          <span className="shrink-0 text-xs text-foreground/70">
                            {formatRelativeTime(
                              conversation.lastMessageOnUtc,
                              locale,
                              t
                            )}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={cn(
                            "truncate text-sm",
                            conversation.unreadCount
                              ? "font-medium text-foreground"
                              : "text-foreground/70"
                          )}
                        >
                          {conversation.lastMessagePreview ??
                            t("noMessagesPreview")}
                        </p>
                        {conversation.unreadCount ? (
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                            {conversation.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </ScrollArea>
    </div>
  )
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function formatRelativeTime(
  value: string,
  locale: string,
  t: ReturnType<typeof useTranslations<"chats">>
) {
  const date = new Date(value)
  const today = new Date()
  const dateKey = date.toISOString().slice(0, 10)

  if (dateKey === today.toISOString().slice(0, 10)) {
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }

  const yesterday = new Date(today)
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  if (dateKey === yesterday.toISOString().slice(0, 10)) return t("yesterday")

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(date)
}

function ConversationsSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-1 px-2 py-2">
      <span className="sr-only">Loading conversations…</span>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <div className="size-12 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
