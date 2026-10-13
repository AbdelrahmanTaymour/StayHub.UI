"use client"

import { useTranslations } from "next-intl"
import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/providers/AuthContext"
import { ChatMessageBubble } from "./ChatMessageBubble"
import { useChatThread } from "../hooks/useChatThread"
import { useMarkConversationReadOnActivity } from "../hooks/useMarkConversationReadOnActivity"
import {
  groupMessagesByDayAndSender,
  isSameUtcDay,
} from "../utils/groupMessages"
import { isSameUser } from "../utils/isSameUser"

interface ChatMessageListProps {
  conversationId: string
  otherPartyAvatarUrl?: string | null
}

export function ChatMessageList({
  conversationId,
  otherPartyAvatarUrl,
}: ChatMessageListProps) {
  const t = useTranslations("chats")
  const { session } = useAuth()
  const currentUserId = session?.user?.id
  const {
    messages,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useChatThread(conversationId)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Track the unique identity of the very bottom message
  const lastMessageId = messages[messages.length - 1]?.id
  const previousLastId = useRef(lastMessageId)
  const isInitialLoad = useRef(true)

  useMarkConversationReadOnActivity(conversationId, lastMessageId)

  useEffect(() => {
    if (isInitialLoad.current && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ block: "end" })
      isInitialLoad.current = false
      previousLastId.current = lastMessageId
      return
    }

    if (lastMessageId !== previousLastId.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
      previousLastId.current = lastMessageId
    }
  }, [lastMessageId, messages.length])

  if (isPending) {
    return (
      <div
        role="status"
        className="flex flex-1 flex-col-reverse gap-3 overflow-hidden p-4"
      >
        <span className="sr-only">{t("loadingMessages")}</span>
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-10 w-2/3 animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {t("threadEmptyTitle")}
        </h3>
        <p className="max-w-md text-sm text-foreground">
          {t("threadEmptyDescription")}
        </p>
      </div>
    )
  }

  const sections = groupMessagesByDayAndSender(messages)
  const today = new Date()

  return (
    <ScrollArea className="min-h-0 flex-1 px-4 py-3">
      {hasNextPage ? (
        <div className="flex justify-center pb-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? t("loadingMore") : t("loadEarlier")}
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <div key={section.dateKey} className="flex flex-col gap-2">
            <div className="flex justify-center">
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-foreground">
                {formatDaySeparator(section.dateKey, today, t)}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              {section.items.map(({ message, isGroupStart, isGroupEnd }) => {
                const isOwn = isSameUser(message.senderId, currentUserId)

                return (
                  <ChatMessageBubble
                    key={message.id}
                    message={message}
                    isOwnMessage={isOwn}
                    isGroupStart={isGroupStart}
                    isGroupEnd={isGroupEnd}
                    otherPartyAvatarUrl={otherPartyAvatarUrl}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div ref={bottomRef} />
    </ScrollArea>
  )
}

function formatDaySeparator(
  dateKey: string,
  today: Date,
  t: ReturnType<typeof useTranslations<"chats">>
) {
  if (isSameUtcDay(dateKey, today)) return t("today")

  const yesterday = new Date(today)
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  if (isSameUtcDay(dateKey, yesterday)) return t("yesterday")

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateKey))
}
