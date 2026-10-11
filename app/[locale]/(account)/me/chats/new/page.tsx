import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { getMyConversationsServer } from "@/features/chats/api/conversations.server"
import { NewChatComposer } from "@/features/chats/components/NewChatComposer"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("chats")
  return {
    title: t("pageTitle"),
    description: t("metaDescription"),
  }
}

interface NewChatPageProps {
  searchParams: Promise<{ apartmentId?: string; bookingId?: string }>
}

export default async function NewChatPage({ searchParams }: NewChatPageProps) {
  const { apartmentId, bookingId } = await searchParams

  if (!apartmentId) return null

  const conversations = await getMyConversationsServer()
  const match = conversations.find(
    (conversation) => conversation.apartmentId === apartmentId
  )

  if (match?.id) {
    redirect(`/me/chats/${match.id}`)
  }

  return <NewChatComposer apartmentId={apartmentId} bookingId={bookingId} />
}
