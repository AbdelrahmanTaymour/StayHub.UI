// features/apartments/components/ApartmentReviewCard.tsx
"use client"

import { User } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ReviewResponseComposer } from "./ReviewResponseComposer"
import { ApartmentReviewResponse } from "@/lib/api/types/reviews"
import { formatDate } from "@/features/apartments/utils/format-date"
import { StarRating } from "@/components/common/StarRating"

export function ApartmentReviewCard({
  apartmentId,
  review,
}: {
  apartmentId: string
  review: ApartmentReviewResponse
}) {
  const t = useTranslations("apartmentManage.reviews")
  const locale = useLocale()
  const [isComposerOpen, setIsComposerOpen] = useState(false)

  const hasResponse = Boolean(review.ownerResponseComment)
  const reviewerName = review.reviewerName ?? t("unknownReviewer")
  const createdOn = review.createdOnUtc
    ? formatDate(review.createdOnUtc, locale)
    : null

  return (
    <article className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      {!hasResponse ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-primary"
        />
      ) : null}

      <div className="flex flex-col justify-between gap-3 pb-3 md:flex-row md:items-start">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar className="size-12 shrink-0 shadow-sm">
            <AvatarImage src={review.reviewerAvatarUrl ?? undefined} alt="" />
            <AvatarFallback>
              <User aria-hidden="true" className="size-5" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">
                {reviewerName}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground/70">
                {t("verifiedStay")}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-foreground/70">
              {createdOn ? <span>{createdOn}</span> : null}
              {createdOn && review.nightsStayed != null ? (
                <span aria-hidden="true">•</span>
              ) : null}
              {review.nightsStayed != null ? (
                <span>{t("stayedNights", { count: review.nightsStayed })}</span>
              ) : null}
            </div>
          </div>
        </div>

        <StarRating value={review.rating ?? 0} />
      </div>

      {review.comment ? (
        <p className="max-w-4xl py-2 leading-relaxed text-foreground">
          {review.comment}
        </p>
      ) : null}

      {hasResponse ? (
        <div className="mt-4 flex flex-col gap-2 rounded-xl bg-muted p-4">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User aria-hidden="true" className="size-4" />
              </span>
              <span className="font-semibold text-foreground">
                {t("hostLabel")}
              </span>
            </div>
            {review.ownerResponseCreatedOnUtc ? (
              <span className="text-sm text-foreground/70">
                {t("respondedOn", {
                  date: formatDate(review.ownerResponseCreatedOnUtc, locale),
                })}
              </span>
            ) : null}
          </div>
          <p className="ms-10 border-s-2 border-primary/20 ps-3 text-sm text-foreground/70">
            {review.ownerResponseComment}
          </p>
        </div>
      ) : isComposerOpen && review.id ? (
        <div className="mt-4">
          <ReviewResponseComposer
            apartmentId={apartmentId}
            reviewId={review.id}
            onCancel={() => setIsComposerOpen(false)}
            onSubmitted={() => setIsComposerOpen(false)}
          />
        </div>
      ) : (
        <div className="mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsComposerOpen(true)}
          >
            {t("respond")}
          </Button>
        </div>
      )}
    </article>
  )
}
