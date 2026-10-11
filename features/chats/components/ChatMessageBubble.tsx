import { Check, CheckCheck } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "cn"
import { ConversationMessagesResponse } from "@/lib/api/types/conversations"

interface ChatMessageBubbleProps {
  message: ConversationMessagesResponse
  isOwnMessage: boolean
  isGroupStart: boolean
  isGroupEnd: boolean
  otherPartyAvatarUrl?: string | null
}

export function ChatMessageBubble({
  message,
  isOwnMessage,
  isGroupStart,
  isGroupEnd,
  otherPartyAvatarUrl,
}: ChatMessageBubbleProps) {
  const t = useTranslations("chats")
  const locale = useLocale()
  const time = message.sentOnUtc
    ? new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(message.sentOnUtc))
    : ""

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      {/* Incoming messages show the sender's avatar on the first bubble of a group, a spacer otherwise */}
      {!isOwnMessage ? (
        isGroupStart ? (
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={otherPartyAvatarUrl ?? undefined} alt="" />
            <AvatarFallback className="text-xs">?</AvatarFallback>
          </Avatar>
        ) : (
          <div className="size-7 shrink-0" aria-hidden="true" />
        )
      ) : null}

      <div className="flex max-w-[85%] flex-col gap-0.5 md:max-w-xl">
        <div
          className={cn(
            "rounded-2xl px-4 py-2 text-sm shadow-sm",
            isOwnMessage
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground",
            // Tail only on the end of a group — matches the mockup's rounded-br-sm / rounded-bl-sm treatment
            isGroupEnd && isOwnMessage && "rounded-br-sm",
            isGroupEnd && !isOwnMessage && "rounded-bl-sm"
          )}
        >
          <p className="leading-snug whitespace-pre-line">{message.body}</p>
        </div>

        {isGroupEnd ? (
          <div
            className={cn(
              "flex items-center gap-1 px-1 text-[11px]",
              isOwnMessage ? "justify-end" : "justify-start"
            )}
          >
            <time dateTime={message.sentOnUtc} className="text-foreground/60">
              {time}
            </time>
            {isOwnMessage ? (
              message.readOnUtc ? (
                <span
                  className="flex items-center gap-0.5 text-tertiary"
                  aria-label={t("read")}
                >
                  {t("read")}
                  <CheckCheck aria-hidden="true" className="size-3.5" />
                </span>
              ) : (
                <span
                  className="flex items-center gap-0.5 text-foreground/60"
                  aria-label={t("delivered")}
                >
                  {t("delivered")}
                  <Check aria-hidden="true" className="size-3.5" />
                </span>
              )
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
