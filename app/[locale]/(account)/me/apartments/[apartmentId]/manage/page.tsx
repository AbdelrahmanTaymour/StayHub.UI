import { redirect } from "next/navigation"

export default async function ManageIndexPage({
  params,
}: {
  params: Promise<{ apartmentId: string }>
}) {
  const { apartmentId } = await params
  redirect(`/me/apartments/${apartmentId}/manage/details`)
}
