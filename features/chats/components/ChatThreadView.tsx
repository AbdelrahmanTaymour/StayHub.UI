"use client"

import { ArrowLeft, Info, User } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useRouter } from "@/i18n/navigation"
import { useMarkConversationRead } from "@/features/chats/hooks/useMarkConversationRead"
import { useMyConversations } from "@/features/chats/hooks/useMyConversations"
import { useChatDetails } from "@/features/chats/providers/ChatDetailsProvider"
import { ChatComposer } from "./ChatComposer"
import { ChatMessageList } from "./ChatMessageList"
import { BookingDetailsPanel } from "./BookingDetailsPanel"
import { OwnerPreviewDialog } from "./OwnerPreviewDialog"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { cn } from "cn"

export function ChatThreadView({ conversationId }: { conversationId: string }) {
  const t = useTranslations("chats")
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const { data } = useMyConversations()
  const { mutate: markRead } = useMarkConversationRead()
  const {
    isOpen: isDetailsOpen,
    toggle: toggleDetails,
    close: closeDetails,
  } = useChatDetails()
  const [isOwnerPreviewOpen, setIsOwnerPreviewOpen] = useState(false)

  const conversation = data?.find((item) => item.id === conversationId)

  useEffect(() => {
    markRead(conversationId)
  }, [conversationId, markRead])

  const header = (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
      <div className="flex min-w-0 items-center gap-1">
        {!isDesktop ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push("/me/chats")}
            aria-label={t("backToConversations")}
            className="-ms-1 shrink-0"
          >
            <ArrowLeft aria-hidden="true" className="size-5 rtl:rotate-180" />
          </Button>
        ) : null}

        <button
          type="button"
          onClick={() => setIsOwnerPreviewOpen(true)}
          className="flex min-w-0 items-center gap-3 rounded-lg p-1 text-start hover:bg-muted"
        >
          <Avatar className="size-9 shrink-0">
            <AvatarImage
              src={conversation?.otherPartyAvatarUrl ?? undefined}
              alt=""
            />
            <AvatarFallback>
              <User aria-hidden="true" className="size-4" />
            </AvatarFallback>
          </Avatar>
          <span className="truncate font-semibold text-foreground">
            {conversation?.otherPartyName ?? t("unknownParticipant")}
          </span>
        </button>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="icon"
        aria-label={t("reservationDetails")}
        aria-pressed={isDetailsOpen}
        onClick={toggleDetails}
        className="shrink-0"
      >
        <Info aria-hidden="true" className="size-5" />
      </Button>
    </header>
  )

  const thread = (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      {header}
      <ChatMessageList
        conversationId={conversationId}
        otherPartyAvatarUrl={conversation?.otherPartyAvatarUrl}
      />
      <ChatComposer
        conversationId={conversationId}
        placeholder={
          conversation?.otherPartyName
            ? t("composerPlaceholderWithName", {
                name: conversation.otherPartyName,
              })
            : undefined
        }
      />
    </div>
  )

  return (
    <div className="flex h-full min-h-0 w-full">
      <div className="h-full min-w-0 flex-1 overflow-hidden">{thread}</div>

      {/* Plain CSS width toggle, not a resizable panel — avoids the
        conditional-mount recalculation bug that was corrupting sibling
        panel sizes and breaking the vertical layout on toggle. */}
      {isDesktop ? (
        <div
          className={cn(
            "h-full shrink-0 overflow-hidden border-s border-border transition-[width] duration-200 ease-out",
            isDetailsOpen ? "w-95" : "w-0 border-s-0"
          )}
        >
          <div className="h-full w-95">
            <BookingDetailsPanel />
          </div>
        </div>
      ) : null}

      {!isDesktop ? (
        <Sheet
          open={isDetailsOpen}
          onOpenChange={(open) => (open ? toggleDetails() : closeDetails())}
        >
          <SheetContent side="right" className="w-full p-0 sm:max-w-md">
            <SheetTitle className="sr-only">
              {t("reservationDetails")}
            </SheetTitle>
            <BookingDetailsPanel />
          </SheetContent>
        </Sheet>
      ) : null}

      <OwnerPreviewDialog
        ownerId={conversation?.otherPartyId}
        open={isOwnerPreviewOpen}
        onOpenChange={setIsOwnerPreviewOpen}
      />
    </div>
  )
}
