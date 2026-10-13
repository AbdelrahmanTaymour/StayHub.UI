"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useId, useState } from "react"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ValidationErrorList } from "@/components/feedback/ValidationErrorList"
import { getFormErrors } from "@/lib/errors/get-form-errors"
import {
  CreateApartmentFormInput,
  createApartmentSchema,
  type CreateApartmentFormValues,
} from "@/features/apartments/schemas/create-apartment-schema"
import { useCreateApartment } from "@/features/apartments/hooks/useCreateApartment"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query/query-keys"
import { SUPPORTED_CURRENCIES } from "../utils/currencies"

export function CreateApartmentSheet() {
  const t = useTranslations("myApartments.createSheet")
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const { mutate, isPending, error } = useCreateApartment()

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateApartmentFormInput, unknown, CreateApartmentFormValues>({
    resolver: zodResolver(createApartmentSchema),
    defaultValues: {
      name: "",
      description: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      priceAmount: "",
      priceCurrency: "USD",
      cleaningFeeAmount: "",
      cleaningFeeCurrency: "USD",
    },
  })

  function onSubmit(values: CreateApartmentFormValues) {
    mutate(values, {
      onSuccess: () => {
        setOpen(false)
        reset()

        queryClient.invalidateQueries({ queryKey: queryKeys.apartments.all })

        window.setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: queryKeys.apartments.all })
        }, 800)
      },
      onError: (err) => {
        getFormErrors(
          err,
          setError,
          Object.keys(values) as (keyof CreateApartmentFormValues)[]
        )
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

      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <form
          id="create-apartment-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4 px-4 py-2"
        >
          <Field label={t("fields.name")} error={errors.name} t={t}>
            <Input
              id="apartment-name"
              {...register("name")}
              aria-invalid={Boolean(errors.name)}
            />
          </Field>

          <Field
            label={t("fields.description")}
            error={errors.description}
            t={t}
          >
            <Textarea
              id="apartment-description"
              rows={3}
              {...register("description")}
              aria-invalid={Boolean(errors.description)}
            />
          </Field>

          <Field label={t("fields.street")} error={errors.street} t={t}>
            <Input
              id="apartment-street"
              {...register("street")}
              aria-invalid={Boolean(errors.street)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label={t("fields.city")} error={errors.city} t={t}>
              <Input
                id="apartment-city"
                {...register("city")}
                aria-invalid={Boolean(errors.city)}
              />
            </Field>
            <Field label={t("fields.state")} error={errors.state} t={t}>
              <Input
                id="apartment-state"
                {...register("state")}
                aria-invalid={Boolean(errors.state)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label={t("fields.zipCode")} error={errors.zipCode} t={t}>
              <Input
                id="apartment-zip"
                {...register("zipCode")}
                aria-invalid={Boolean(errors.zipCode)}
              />
            </Field>
            <Field label={t("fields.country")} error={errors.country} t={t}>
              <Input
                id="apartment-country"
                {...register("country")}
                aria-invalid={Boolean(errors.country)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-4">
            <Field
              label={t("fields.priceAmount")}
              error={errors.priceAmount}
              t={t}
            >
              <Input
                id="apartment-price"
                type="number"
                step="0.01"
                min={0}
                {...register("priceAmount")}
                aria-invalid={Boolean(errors.priceAmount)}
              />
            </Field>
            <CurrencyField
              name="priceCurrency"
              control={control}
              label={t("fields.currency")}
            />
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-4">
            <Field
              label={t("fields.cleaningFeeAmount")}
              error={errors.cleaningFeeAmount}
              t={t}
            >
              <Input
                id="apartment-cleaning-fee"
                type="number"
                step="0.01"
                min={0}
                {...register("cleaningFeeAmount")}
                aria-invalid={Boolean(errors.cleaningFeeAmount)}
              />
            </Field>
            <CurrencyField
              name="cleaningFeeCurrency"
              control={control}
              label={t("fields.currency")}
            />
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
            form="create-apartment-form"
            disabled={isPending}
          >
            {isPending ? t("creating") : t("create")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function Field({
  label,
  error,
  t,
  children,
}: {
  label: string
  error?: { message?: string }
  t: ReturnType<typeof useTranslations<"myApartments.createSheet">>
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error?.message ? (
        <p role="alert" className="text-sm text-destructive">
          {t(`errors.${error.message}`)}
        </p>
      ) : null}
    </div>
  )
}

function CurrencyField({
  name,
  control,
  label,
}: {
  name: "priceCurrency" | "cleaningFeeCurrency"
  control: ReturnType<
    typeof useForm<CreateApartmentFormInput, unknown, CreateApartmentFormValues>
  >["control"]
  label: string
}) {
  const labelId = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <Label id={labelId}>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-24" aria-labelledby={labelId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_CURRENCIES.map((code) => (
                <SelectItem key={code} value={code}>
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  )
}
