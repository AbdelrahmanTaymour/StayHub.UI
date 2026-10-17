import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { getApartmentForEditServer } from "@/features/apartments/api/apartments.server"
import { ApartmentStatusToggle } from "@/features/apartments/components/ApartmentStatusToggle"
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <PageBreadcrumb
        items={[
          { label: t("breadcrumbApartments"), href: "/me/apartments" },
          { label: apartment.title ?? t("fallbackTitle") },
        ]}
      />

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {t("pageTitle")}
          </h1>
          <p className="mt-1 text-sm text-foreground/70">
            {t("pageDescription")}
          </p>
        </div>
        <ApartmentStatusToggle
          apartmentId={apartmentId}
          isActive={apartment.isActive ?? false}
        />
      </div>

      <ManageTabsNav apartmentId={apartmentId} />

      <div className="min-w-0 pb-16">{children}</div>
    </div>
  )
}
