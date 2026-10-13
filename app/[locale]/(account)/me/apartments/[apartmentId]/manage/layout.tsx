import { notFound } from "next/navigation"

import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { getApartmentForEditServer } from "@/features/apartments/api/apartments.server"
import { ApartmentStatusToggle } from "@/features/apartments/components/ApartmentStatusToggle"
import { ManageTabsNav } from "@/features/apartments/components/ManageTabsNav"
import { getTranslations } from "next-intl/server"
import { PageHeader } from "@/components/common/PageHeader"

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
    <>
      <div className="mx-auto w-full max-w-7xl px-6 pt-6">
        <PageBreadcrumb
          items={[
            { label: t("breadcrumbApartments"), href: "/me/apartments" },
            { label: apartment.title ?? t("fallbackTitle") },
          ]}
        />
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 md:py-8">
        {/* Breadcrumb lives in the page.tsx server component since it needs no client state */}

        <PageHeader
          title={t("pageTitle")}
          meta={t("pageDescription")}
          actions={
            <ApartmentStatusToggle
              apartmentId={apartmentId}
              isActive={apartment.isActive ?? false}
            />
          }
        />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <ManageTabsNav apartmentId={apartmentId} />
          <div className="min-w-0 flex-1 pb-24">{children}</div>
        </div>
      </div>
    </>
  )
}
