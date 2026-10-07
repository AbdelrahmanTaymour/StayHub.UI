import { AppShell } from "@/components/layout/AppShell"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
