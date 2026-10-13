import { ComingSoonPanel } from "@/components/common/ComingSoonPanel"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apartmentManage.tabs")
  return { title: t("availability") }
}

export default async function ApartmentAvailabilityTabPage() {
  const t = await getTranslations("apartmentManage.comingSoon")
  return (
    <ComingSoonPanel
      title={t("availability.title")}
      description={t("availability.description")}
    />
  )
}
