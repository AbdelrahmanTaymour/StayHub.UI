"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { ReactElement } from "react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Controller, useForm, useWatch } from "react-hook-form"

import { StarRatingInput } from "@/components/common/StarRatingInput"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ValidationErrorList } from "@/components/feedback/ValidationErrorList"
import {
  reviewSchema,
  type ReviewFormValues,
} from "@/features/reviews/schemas/review-schema"
import { useCreateReview } from "@/features/reviews/hooks/useCreateReview"
import { Textarea } from "@/components/ui/textarea"

const COMMENT_MAX_LENGTH = 2000

interface WriteReviewDialogProps {
  bookingId: string
  apartmentName: string
  trigger: ReactElement
}

export function WriteReviewDialog({
  bookingId,
  apartmentName,
  trigger,
}: WriteReviewDialogProps) {
  const t = useTranslations("reviews")
  const [open, setOpen] = useState(false)
  const { mutate, isPending, error } = useCreateReview()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  })

  const comment = useWatch({
    control,
    name: "comment",
  })

  const commentLength = comment?.length ?? 0

  function onSubmit(values: ReviewFormValues) {
    mutate(
      { bookingId, rating: values.rating, comment: values.comment },
      {
        onSuccess: () => {
          setOpen(false)
          reset()
        },
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("dialogDescription", { name: apartmentName })}
          </DialogDescription>
        </DialogHeader>

        <form
          id="write-review-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col items-center gap-2">
            <Controller
              control={control}
              name="rating"
              render={({ field }) => (
                <StarRatingInput
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={Boolean(errors.rating)}
                  aria-describedby={errors.rating ? "rating-error" : undefined}
                />
              )}
            />
            {errors.rating ? (
              <p
                id="rating-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {t(`errors.${errors.rating.message}`)}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="review-comment">{t("commentLabel")}</Label>
            <Textarea
              id="review-comment"
              rows={5}
              maxLength={COMMENT_MAX_LENGTH}
              placeholder={t("commentPlaceholder")}
              aria-invalid={Boolean(errors.comment)}
              aria-describedby={
                errors.comment ? "comment-error" : "comment-count"
              }
              {...register("comment")}
            />
            <div className="flex items-center justify-between">
              {errors.comment ? (
                <p
                  id="comment-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {t(`errors.${errors.comment.message}`)}
                </p>
              ) : (
                <span id="comment-count" className="text-xs text-foreground">
                  {t("commentCount", {
                    count: commentLength,
                    max: COMMENT_MAX_LENGTH,
                  })}
                </span>
              )}
            </div>
          </div>

          {error ? <ValidationErrorList errors={[t("submitError")]} /> : null}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" form="write-review-form" disabled={isPending}>
            {isPending ? t("submitting") : t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
