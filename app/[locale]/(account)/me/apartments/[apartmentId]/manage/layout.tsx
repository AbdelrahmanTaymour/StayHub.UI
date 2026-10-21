import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { getApartmentForEditServer } from "@/features/apartments/api/apartments.server"
import { ManageTabsNav } from "@/features/apartments/components/ManageTabsNav"

interface ManageLayoutProps {
  children: React.ReactNode
  params: Promise<{ apartmentId: string }>
}

export default async function ApartmentManageLayout({
  children,
  params,
}: ManageLayoutProps) {
  const { apartmentId } = await params
  const apartment = await getApartmentForEditServer(apartmentId)
  if (!apartment) notFound()

  const t = await getTranslations("apartmentManage")

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 md:py-8">
      <PageBreadcrumb
        items={[
          { label: t("breadcrumbApartments"), href: "/me/apartments" },
          { label: apartment.title ?? t("fallbackTitle") },
        ]}
      />

      <ManageTabsNav apartmentId={apartmentId} />

      <div className="min-w-0 pb-16">{children}</div>
    </div>
  )
}
