import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("chats")
  return {
    title: t("pageTitle"),
    description: t("metaDescription"),
  }
}

export default async function ChatsIndexPage() {
  const t = await getTranslations("chats")

  return (
    <div className="hidden h-full flex-col items-center justify-center gap-2 p-8 text-center lg:flex">
      <p className="text-lg font-semibold text-foreground">
        {t("selectConversationTitle")}
      </p>
      <p className="text-sm text-foreground/70">
        {t("selectConversationDescription")}
      </p>
    </div>
  )
}
