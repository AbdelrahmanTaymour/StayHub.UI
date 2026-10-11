import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { ChatThreadView } from "@/features/chats/components/ChatThreadView"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("chats")
  return {
    title: t("pageTitle"),
    description: t("metaDescription"),
  }
}

export default async function ChatThreadPage({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  const { chatId } = await params
  return <ChatThreadView conversationId={chatId} />
}
