import { User } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "@/components/common/StarRating"
import { formatDate } from "@/features/apartments/utils/format-date"
import { ApartmentReviewResponse } from "@/lib/api/types/reviews"

export function PublicReviewCard({
  review,
}: {
  review: ApartmentReviewResponse
}) {
  const t = useTranslations("apartmentReviewsPage")
  const locale = useLocale()

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 shrink-0">
            <AvatarImage src={review.reviewerAvatarUrl ?? undefined} alt="" />
            <AvatarFallback>
              <User aria-hidden="true" className="size-5" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="font-medium text-foreground">
              {review.reviewerName ?? t("anonymousGuest")}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 text-sm text-foreground/70">
              {review.createdOnUtc ? (
                <time dateTime={review.createdOnUtc}>
                  {formatDate(review.createdOnUtc, locale)}
                </time>
              ) : null}
              {review.nightsStayed != null ? (
                <>
                  <span aria-hidden="true">•</span>
                  <span>
                    {t("stayedNights", { count: review.nightsStayed })}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <StarRating value={review.rating ?? 0} />
      </div>

      {review.comment ? (
        <p className="text-sm leading-relaxed text-foreground">
          {review.comment}
        </p>
      ) : null}

      {review.ownerResponseComment ? (
        <div className="ms-10 flex flex-col gap-1 rounded-lg bg-muted p-3">
          <span className="text-sm font-medium text-foreground">
            {t("hostResponse")}
          </span>
          <p className="text-sm text-foreground/70">
            {review.ownerResponseComment}
          </p>
        </div>
      ) : null}
    </article>
  )
}
