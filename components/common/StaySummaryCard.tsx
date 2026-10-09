import { MessageCircle, User } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import type { ReactNode } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"

export interface StaySummaryHost {
  id?: string
  fullName?: string | null
  avatarUrl?: string | null
}

interface StaySummaryCardProps {
  imageUrl?: string | null
  imageAlt: string
  /** Rendered as an overlay on the image, bottom-start (apartment name/location, etc). Omit to move that content elsewhere, e.g. a separate stay-details card. */
  overlay?: ReactNode
  host?: StaySummaryHost
  /** Overrides the default disabled-message-host button, e.g. a working link once conversations exist. */
  messageHostAction?: ReactNode
}

/**
 * Shared "property photo + host strip" card used by the apartment details
 * page and the booking detail page. Takes one hero image, not a gallery —
 * pages needing a full photo grid compose their own gallery above this.
 */
export function StaySummaryCard({
  imageUrl,
  imageAlt,
  overlay,
  host,
  messageHostAction,
}: StaySummaryCardProps) {
  const t = useTranslations("common.staySummary")
  const hostName = host?.fullName ?? t("fallbackHostName")

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="relative h-72 w-full bg-muted md:h-96">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover"
          />
        ) : null}
        {overlay ? (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-foreground/80 via-transparent to-transparent"
            />
            <div className="absolute inset-x-4 bottom-4 text-background">
              {overlay}
            </div>
          </>
        ) : null}
      </div>

      {host ? (
        <div className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarImage src={host.avatarUrl ?? undefined} alt="" />
              <AvatarFallback>
                <User aria-hidden="true" className="size-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base text-foreground">
                {t("hostedBy")}{" "}
                {host.id ? (
                  <Link
                    href={`/owners/${host.id}`}
                    className="font-semibold text-tertiary hover:underline"
                  >
                    {hostName}
                  </Link>
                ) : (
                  <span className="font-semibold text-foreground">
                    {hostName}
                  </span>
                )}
              </p>
              <p className="text-sm text-foreground">{t("readyToHelp")}</p>
            </div>
          </div>

          {messageHostAction ?? (
            <Button
              type="button"
              variant="secondary"
              disabled
              className="gap-2"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              {t("messageHost")}
            </Button>
          )}
        </div>
      ) : null}
    </Card>
  )
}
