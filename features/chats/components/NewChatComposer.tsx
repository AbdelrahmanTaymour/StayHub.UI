"use client"

import { useRouter } from "@/i18n/navigation"
import { useStartConversation } from "@/features/chats/hooks/useStartConversation"
import { DraftChatComposer } from "@/features/chats/components/DraftChatComposer"

interface NewChatComposerProps {
  apartmentId: string
  bookingId?: string
}

export function NewChatComposer({
  apartmentId,
  bookingId,
}: NewChatComposerProps) {
  const router = useRouter()
  const { mutate: start, isPending } = useStartConversation()

  function handleFirstMessage(body: string) {
    start(
      { apartmentId, bookingId, initialMessage: body },
      { onSuccess: (newId) => router.replace(`/me/chats/${newId}`) }
    )
  }

  return <DraftChatComposer onSend={handleFirstMessage} isSending={isPending} />
}
