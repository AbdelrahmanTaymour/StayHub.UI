import { User } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { RatingSummary } from "@/components/common/RatingSummary"
import { StarRating } from "@/components/common/StarRating"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { ApartmentReview } from "@/features/apartments/types/apartment-details"
import { formatDate } from "@/features/apartments/utils/format-date"
import { Link } from "@/i18n/navigation"

interface ApartmentReviewsProps {
  apartmentId: string
  rating?: number | null
  reviewCount?: number | null
  reviews: ApartmentReview[]
}

export function ApartmentReviews({
  apartmentId,
  rating,
  reviewCount,
  reviews,
}: ApartmentReviewsProps) {
  const t = useTranslations("apartmentDetails.reviews")
  const locale = useLocale()

  return (
    <Card as="section" aria-labelledby="apartment-reviews-heading">
      <div className="flex flex-col gap-2">
        <h2
          id="apartment-reviews-heading"
          className="text-lg font-semibold text-foreground"
        >
          {t("title")}
        </h2>
        <RatingSummary rating={rating} reviewCount={reviewCount} />
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-foreground">{t("empty")}</p>
      ) : (
        <ul className="flex flex-col gap-6">
          {reviews.map((review) => (
            <li key={review.id} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage
                    src={review.reviewerAvatarUrl ?? undefined}
                    alt=""
                  />
                  <AvatarFallback>
                    <User aria-hidden="true" className="size-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-medium text-foreground">
                    {review.reviewerName ?? t("anonymousGuest")}
                  </h3>
                  {review.createdOnUtc ? (
                    <time
                      dateTime={review.createdOnUtc}
                      className="text-sm text-foreground"
                    >
                      {formatDate(review.createdOnUtc, locale)}
                    </time>
                  ) : null}
                </div>
              </div>

              <StarRating value={review.rating ?? 0} />

              {review.comment ? (
                <p className="text-sm leading-relaxed text-foreground">
                  {review.comment}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {reviews.length > 0 && apartmentId ? (
        <Link
          href={`/apartments/${apartmentId}/reviews`}
          className={buttonVariants({
            variant: "outline",
            className: "self-start",
          })}
        >
          {t("viewAll")}
        </Link>
      ) : null}
    </Card>
  )
}
