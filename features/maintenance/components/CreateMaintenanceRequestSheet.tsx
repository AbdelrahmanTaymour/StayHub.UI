"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ValidationErrorList } from "@/components/feedback/ValidationErrorList"
import { getFormErrors } from "@/lib/errors/get-form-errors"
import {
  createMaintenanceRequestSchema,
  type CreateMaintenanceRequestFormValues,
} from "@/features/maintenance/schemas/create-maintenance-request-schema"
import { useCreateMaintenanceRequest } from "@/features/maintenance/hooks/useCreateMaintenanceRequest"

export function CreateMaintenanceRequestSheet({
  apartmentId,
}: {
  apartmentId: string
}) {
  const t = useTranslations("apartmentManage.maintenance.createSheet")
  const [open, setOpen] = useState(false)
  const { mutate, isPending, error } = useCreateMaintenanceRequest(apartmentId)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateMaintenanceRequestFormValues>({
    resolver: zodResolver(createMaintenanceRequestSchema),
    defaultValues: { title: "", description: "" },
  })

  function onSubmit(values: CreateMaintenanceRequestFormValues) {
    mutate(values, {
      onSuccess: () => {
        setOpen(false)
        reset()
      },
      onError: (err) => {
        getFormErrors(err, setError, ["title", "description"])
      },
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      <SheetTrigger render={<Button type="button" className="gap-2" />}>
        {t("triggerLabel")}
      </SheetTrigger>

      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <form
          id="create-maintenance-request-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4 px-4 py-2"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ticket-title">{t("fields.title")}</Label>
            <Input
              id="ticket-title"
              placeholder={t("fields.titlePlaceholder")}
              {...register("title")}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title?.message ? (
              <p role="alert" className="text-sm text-destructive">
                {t(`errors.${errors.title.message}`)}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ticket-description">
              {t("fields.description")}
            </Label>
            <Textarea
              id="ticket-description"
              rows={4}
              placeholder={t("fields.descriptionPlaceholder")}
              {...register("description")}
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description?.message ? (
              <p role="alert" className="text-sm text-destructive">
                {t(`errors.${errors.description.message}`)}
              </p>
            ) : null}
          </div>

          {error ? <ValidationErrorList errors={[t("submitError")]} /> : null}
        </form>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            form="create-maintenance-request-form"
            disabled={isPending}
          >
            {isPending ? t("creating") : t("create")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
