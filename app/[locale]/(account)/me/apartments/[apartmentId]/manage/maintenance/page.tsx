import { ComingSoonPanel } from "@/components/common/ComingSoonPanel"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apartmentManage.tabs")
  return { title: t("maintenance") }
}

export default async function ApartmentMaintenanceTabPage() {
  const t = await getTranslations("apartmentManage.comingSoon")
  return (
    <ComingSoonPanel
      title={t("maintenance.title")}
      description={t("maintenance.description")}
    />
  )
}
