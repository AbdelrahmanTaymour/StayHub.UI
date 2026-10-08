import { AppShell } from "@/components/layout/AppShell"
import type { Locale } from "@/i18n/routing"
import { requireSession } from "@/lib/auth/server/require-session"

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await requireSession({ locale: locale as Locale })

  return <AppShell>{children}</AppShell>
}
