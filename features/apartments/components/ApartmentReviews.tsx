import { User } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { RatingSummary } from "@/components/common/RatingSummary"
import { StarRating } from "@/components/common/StarRating"
import type { ApartmentReview } from "@/features/apartments/types/apartment-details"
import { formatDate } from "@/features/apartments/utils/format-date"

interface ApartmentReviewsProps {
  rating?: number | null
  reviewCount?: number | null
  reviews: ApartmentReview[]
}

export function ApartmentReviews({
  rating,
  reviewCount,
  reviews,
}: ApartmentReviewsProps) {
  const t = useTranslations("apartmentDetails.reviews")
  const locale = useLocale()

  return (
    <section
      aria-labelledby="apartment-reviews-heading"
      className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex flex-col gap-2">
        <h2
          id="apartment-reviews-heading"
          className="text-xl font-semibold text-foreground"
        >
          {t("title")}
        </h2>
        <RatingSummary rating={rating} reviewCount={reviewCount} />
      </div>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground">{t("empty")}</p>
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
                      className="text-sm text-muted-foreground"
                    >
                      {formatDate(review.createdOnUtc, locale)}
                    </time>
                  ) : null}
                </div>
              </div>

              <StarRating value={review.rating ?? 0} />

              {review.comment ? (
                <p className="leading-relaxed text-foreground">
                  {review.comment}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <Button type="button" variant="outline" disabled className="self-start">
        {t("viewAll")}
      </Button>
    </section>
  )
}
