"use client"

import { useId, useState } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRespondToReview } from "@/features/reviews/hooks/useRespondToReview"

interface ReviewResponseComposerProps {
  apartmentId: string
  reviewId: string
  onCancel: () => void
  onSubmitted: () => void
}

export function ReviewResponseComposer({
  apartmentId,
  reviewId,
  onCancel,
  onSubmitted,
}: ReviewResponseComposerProps) {
  const t = useTranslations("apartmentManage.reviews")
  const textareaId = useId()
  const [comment, setComment] = useState("")
  const { mutate, isPending, error } = useRespondToReview(apartmentId)

  function handleSubmit() {
    const trimmed = comment.trim()
    if (!trimmed) return
    mutate({ reviewId, comment: trimmed }, { onSuccess: onSubmitted })
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-muted p-4">
      <Label htmlFor={textareaId}>{t("responseLabel")}</Label>
      <Textarea
        id={textareaId}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder={t("responsePlaceholder")}
        rows={3}
        disabled={isPending}
      />
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {t("responseErrorToast")}
        </p>
      ) : null}
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
        >
          {t("cancel")}
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={isPending || !comment.trim()}
        >
          {isPending ? t("submitting") : t("postResponse")}
        </Button>
      </div>
    </div>
  )
}
