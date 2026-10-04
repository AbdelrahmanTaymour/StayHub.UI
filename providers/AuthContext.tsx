"use client"

import * as React from "react"
import type { Session } from "next-auth"

const AuthContext = React.createContext<Session | null | undefined>(undefined)

export function AuthProvider({
  session,
  children,
}: {
  session: Session | null
  children: React.ReactNode
}) {
  return <AuthContext value={session}>{children}</AuthContext>
}

export function useAuth() {
  const session = React.useContext(AuthContext)

  if (session === undefined) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return {
    session,
    status: session ? ("authenticated" as const) : ("unauthenticated" as const),
  }
}
