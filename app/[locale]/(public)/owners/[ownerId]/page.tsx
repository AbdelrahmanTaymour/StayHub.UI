import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { EmptyState } from "@/components/feedback/EmptyState"
import { ApartmentGrid } from "@/features/apartments/components/ApartmentGrid"
import { Pagination } from "@/components/common/Pagination"
import { getOwnerProfileServer } from "@/features/users/api/users.server"
import { OwnerProfileView } from "@/features/users/components/OwnerProfileView"

interface OwnerPageProps {
  params: Promise<{ locale: string; ownerId: string }>
  searchParams: Promise<{ page?: string }>
}

function parsePage(value: string | undefined) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export async function generateMetadata({
  params,
}: OwnerPageProps): Promise<Metadata> {
  const { locale, ownerId } = await params
  const owner = await getOwnerProfileServer(ownerId)
  if (!owner) return {}

  const t = await getTranslations({ locale, namespace: "owner.meta" })
  const title = owner.fullName ?? t("fallbackTitle")
  const bio = owner.bio?.trim()

  return {
    title,
    description: bio ? bio.slice(0, 155) : t("withoutBio", { name: title }),
  }
}

export default async function OwnerPage({
  params,
  searchParams,
}: OwnerPageProps) {
  const { ownerId } = await params
  const { page: pageParam } = await searchParams

  const page = parsePage(pageParam)

  const owner = await getOwnerProfileServer(ownerId)

  if (!owner) notFound()

  const t = await getTranslations("owner")
  //  const items = listings.items ?? []
  const items = []

  return (
    <OwnerProfileView
      owner={owner}
      // listingsCount={listings.totalCount ?? 0}
      listingsCount={0}
      listings={
        items.length === 0 ? (
          <EmptyState title={t("listingsEmpty")} />
        ) : (
          <ApartmentGrid apartments={[]} />
        )
      }
      pagination={<Pagination page={page} totalPages={1} />}
    />
  )
}
