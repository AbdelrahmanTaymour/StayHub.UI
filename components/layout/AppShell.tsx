"use client"

import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { usePathname } from "@/i18n/navigation"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideFooter =
    pathname === "/me/chats" || pathname.startsWith("/me/chats/")

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden pt-16">
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </main>
      {hideFooter ? null : <SiteFooter />}
    </div>
  )
}
