interface AccessTokenPayload {
  sub: string
  email: string
  given_name?: string
  family_name?: string
}

export function decodeAccessToken(token: string): AccessTokenPayload {
  const payload = token.split(".")[1]
  const decoded = Buffer.from(payload, "base64").toString("utf-8")
  return JSON.parse(decoded)
}
