"use client"

import { useTranslations } from "next-intl"
import { ChatComposerInput } from "./ChatComposerInput"

export function DraftChatComposer({
  onSend,
  isSending,
}: {
  onSend: (body: string) => void
  isSending: boolean
}) {
  const t = useTranslations("chats")

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 items-center justify-center p-8 text-center">
        <p className="text-sm text-foreground">
          {t("newChatIntro", { name: t("unknownParticipant") })}
        </p>
      </div>
      <ChatComposerInput onSend={onSend} isSending={isSending} />
    </div>
  )
}
