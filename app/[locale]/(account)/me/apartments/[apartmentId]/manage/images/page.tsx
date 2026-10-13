import { ComingSoonPanel } from "@/components/common/ComingSoonPanel"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apartmentManage.tabs")
  return { title: t("images") }
}

export default async function ApartmentImagesTabPage() {
  const t = await getTranslations("apartmentManage.comingSoon")
  return (
    <ComingSoonPanel
      title={t("images.title")}
      description={t("images.description")}
    />
  )
}
