"use client"

import { useSendMessage } from "../hooks/useSendMessage"
import { ChatComposerInput } from "./ChatComposerInput"

export function ChatComposer({
  conversationId,
  placeholder,
}: {
  conversationId: string
  placeholder?: string
}) {
  const { mutate, isPending } = useSendMessage(conversationId)
  return (
    <ChatComposerInput
      onSend={(body) => mutate({ body })}
      isSending={isPending}
      placeholder={placeholder}
    />
  )
}
