import "server-only"

import { NextResponse } from "next/server"

import { getServerAccessToken } from "@/lib/auth/server/server-access-token"

export async function GET() {
  const accessToken = await getServerAccessToken()

  if (!accessToken) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 })
  }

  return NextResponse.json({ accessToken })
}
