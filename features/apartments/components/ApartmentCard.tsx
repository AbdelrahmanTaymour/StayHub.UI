import Image from "next/image"
import { MapPin, Star } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton"
import { formatPrice } from "@/features/apartments/utils/formatPrice"
import type { ApartmentSummary } from "@/features/apartments/types/search"
import { useSession } from "next-auth/react"

interface ApartmentCardProps {
  apartment: ApartmentSummary
}

export function ApartmentCard({ apartment }: ApartmentCardProps) {
  const t = useTranslations("apartmentCard")
  const locale = useLocale()
  const { status } = useSession()
  const isAuthenticated = status === "authenticated"

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
    isFavorited,
  } = apartment

  const title = name ?? t("untitled")

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        {primaryImageUrl ? (
          <Image
            src={primaryImageUrl}
            alt={city ? `${title} — ${city}` : title}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}

        {id ? (
          <FavoriteButton
            apartmentId={id}
            initialIsFavorited={isFavorited}
            className="absolute inset-e-3 top-3 z-10"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            {city && country ? (
              <div className="flex min-w-0 items-center gap-2">
                <MapPin className="size-3 shrink-0 text-muted-foreground" />
                <span className="truncate text-xs text-muted-foreground">
                  {city}, {country}
                </span>
              </div>
            ) : (
              <span />
            )}
            {rating != null && (
              <span className="flex shrink-0 items-center gap-1 text-sm">
                <Star
                  className="size-3.5 fill-amber-500 text-amber-500"
                  aria-hidden="true"
                />
                <span className="font-medium">{rating.toFixed(2)}</span>
                <span className="text-muted-foreground">
                  ({reviewCount ?? 0})
                </span>
              </span>
            )}
          </div>
          <h3 className="mt-1 font-medium text-foreground transition-colors group-hover:text-primary">
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

        <div className="flex items-baseline justify-between gap-2 border-t border-border pt-2">
          {pricePerNight != null && currency ? (
            <p>
              <span className="text-base font-semibold text-foreground">
                {formatPrice(pricePerNight, currency, locale)}
              </span>
              <span className="text-sm text-muted-foreground">
                {" "}
                {t("perNight")}
              </span>
            </p>
          ) : null}
          {totalPrice != null && currency ? (
            <span className="text-xs text-muted-foreground">
              {t("total", {
                amount: formatPrice(totalPrice, currency, locale),
              })}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
