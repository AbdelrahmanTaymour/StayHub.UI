import * as React from "react"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { QueryProvider } from "./QueryProvider"
import { Toaster } from "@/components/ui/toast"
import { AuthProvider } from "@/providers/AuthContext"
import { SessionWatcher } from "@/components/auth/session-watcher"
import type { Session } from "next-auth"

export function AppProviders({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <AuthProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>
          <SessionWatcher />
          {children}
          <Toaster />
        </QueryProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
