"use client"

import * as React from "react"
import { useAuthStore } from "@/lib/auth/auth-store"
import { login } from "@/features/auth/api/auth-api"
import { useMyApartments } from "@/features/apartments/api/useMyApartments"
import { getErrorMessage } from "@/lib/errors/problem-details"
import { Button } from "@/components/ui/button"

export function ApiTestProbe() {
  const { accessToken, clearSession, setSession } = useAuthStore()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loginError, setLoginError] = React.useState<string | null>(null)

  const { data, error, isLoading, isFetching, refetch } = useMyApartments()

  async function handleLogin() {
    setLoginError(null)
    try {
      const res = await login({ email, password })
      if (res?.accessToken && res?.refreshToken) {
        setSession({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        })
      }
    } catch (err) {
      setLoginError(getErrorMessage(err))
    }
  }

  return (
    <div className="flex max-w-md flex-col gap-3 rounded-lg border p-4">
      <p className="text-sm font-medium">Auth + API Test</p>

      {!accessToken ? (
        <>
          <input
            className="rounded-md border px-2 py-1 text-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="rounded-md border px-2 py-1 text-sm"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button size="sm" onClick={handleLogin}>
            Login
          </Button>
          {loginError && (
            <p className="text-xs text-destructive">{loginError}</p>
          )}
        </>
      ) : (
        <>
          <p className="text-xs text-green-600">Logged in ✓ (token stored)</p>
          <Button size="sm" variant="outline" onClick={clearSession}>
            Logout
          </Button>
          <Button size="sm" onClick={() => refetch()}>
            Fetch my apartments
          </Button>
        </>
      )}

      {(isLoading || isFetching) && (
        <p className="text-xs text-muted-foreground">جاري التحميل...</p>
      )}

      {error ? (
        <p className="text-xs text-destructive">
          خطأ: {getErrorMessage(error)}
        </p>
      ) : null}

      {data ? (
        <pre className="max-h-60 overflow-auto rounded-md bg-muted p-2 text-xs">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : null}
    </div>
  )
}
