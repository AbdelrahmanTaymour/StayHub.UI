import { MapPin, Star } from "lucide-react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import type { ReactNode } from "react"

import { Link } from "@/i18n/navigation"
import { cn } from "cn"
import { formatPrice } from "../../lib/utils/formatPrice"

/** Shape shared by search results and owner listings. Every field is optional so either API response fits. */
export interface ApartmentCardData {
  id?: string
  name?: string | null
  city?: string | null
  country?: string | null
  pricePerNight?: number | null
  totalPrice?: number | null
  currency?: string | null
  primaryImageUrl?: string | null
  rating?: number | null
  reviewCount?: number | null
  isFavorited?: boolean
}

interface ApartmentCardProps {
  apartment: ApartmentCardData
  /** Rendered in the top-right corner of the image. Pass the page's FavoriteButton. */
  favoriteButton?: ReactNode
  className?: string
}

export function ApartmentCard({
  apartment,
  favoriteButton,
  className,
}: ApartmentCardProps) {
  const t = useTranslations("apartmentCard")
  const locale = useLocale()

  const {
    id,
    name,
    city,
    country,
    pricePerNight,
    totalPrice,
    currency,
    primaryImageUrl,
    rating,
    reviewCount,
  } = apartment

  const title = name ?? t("untitled")
  const imageAlt = city ? `${title} — ${city}` : title

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        {primaryImageUrl ? (
          <Image
            src={primaryImageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : null}

        {favoriteButton ? (
          <div className="absolute inset-e-3 top-3 z-10">{favoriteButton}</div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            {city && country ? (
              <p className="flex min-w-0 items-center gap-1.5 text-xs text-foreground">
                <MapPin aria-hidden="true" className="size-3 shrink-0" />
                <span className="truncate">
                  {city}, {country}
                </span>
              </p>
            ) : (
              <span />
            )}

            {rating != null ? (
              <p className="flex shrink-0 items-center gap-1 text-sm">
                <Star
                  aria-hidden="true"
                  className="size-3.5 fill-rating text-rating"
                />
                <span className="font-medium text-foreground">
                  {rating.toFixed(2)}
                </span>
                <span className="text-foreground">({reviewCount ?? 0})</span>
              </p>
            ) : null}
          </div>

          <h3 className="mt-1 font-medium text-foreground transition-colors group-hover:text-tertiary">
            {id ? (
              <Link
                href={`/apartments/${id}`}
                className="static before:absolute before:inset-0 before:z-0 before:content-['']"
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </h3>
        </div>

        {pricePerNight != null && currency ? (
          <div className="flex items-baseline justify-between gap-2 border-t border-border pt-2">
            <p>
              <span className="text-base font-semibold text-foreground tabular-nums">
                {formatPrice(pricePerNight, currency, locale)}
              </span>
              <span className="text-sm text-foreground"> {t("perNight")}</span>
            </p>
            {totalPrice != null ? (
              <span className="text-xs text-foreground tabular-nums">
                {t("total", {
                  amount: formatPrice(totalPrice, currency, locale),
                })}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}
