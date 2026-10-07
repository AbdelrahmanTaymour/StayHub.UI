import { AppShell } from "@/components/layout/AppShell"
import { Locale } from "@/i18n/routing"
import { requireSession } from "@/lib/auth/server/require-session"

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  await requireSession({ locale })

  return <AppShell>{children}</AppShell>
}
