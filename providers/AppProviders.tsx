import * as React from "react"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { QueryProvider } from "./QueryProvider"
import { Toaster } from "@/components/ui/toast"
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

export function AppProviders({
  children,
  session,
}: {
  children: React.ReactNode
  session?: Session | null
}) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
