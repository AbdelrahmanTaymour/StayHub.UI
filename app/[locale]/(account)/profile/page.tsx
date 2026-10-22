// app/[locale]/(account)/profile/page.tsx
import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getTranslations } from "next-intl/server"

import { getLoggedInUserServer } from "@/features/users/api/users.server"
import { ProfileForm } from "@/features/users/components/ProfileForm"
import { getQueryClient } from "@/lib/query/get-query-client"
import { queryKeys } from "@/lib/query/query-keys"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profile")
  return { title: t("pageTitle"), description: t("metaDescription") }
}

export default async function ProfilePage() {
  const queryClient = getQueryClient()
  await queryClient.query({
    queryKey: queryKeys.users.me(),
    queryFn: getLoggedInUserServer,
  })

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-6">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProfileForm />
      </HydrationBoundary>
    </div>
  )
}
