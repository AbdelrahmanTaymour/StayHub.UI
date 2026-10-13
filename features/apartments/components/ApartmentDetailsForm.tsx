"use client"

import { useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, MapPin } from "lucide-react"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"

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
import { Skeleton } from "@/components/ui/skeleton"
import { UnsavedChangesBar } from "@/components/common/UnsavedChangesBar"
import { ValidationErrorList } from "@/components/feedback/ValidationErrorList"
import { getFormErrors } from "@/lib/errors/get-form-errors"
import { useApartmentForEdit } from "@/features/apartments/hooks/useApartmentForEdit"
import { useUpdateApartment } from "@/features/apartments/hooks/useUpdateApartment"
import { SUPPORTED_CURRENCIES } from "@/features/apartments/utils/currencies"
import {
  editApartmentSchema,
  type EditApartmentFormInput,
  type EditApartmentFormValues,
} from "@/features/apartments/schemas/edit-apartment-schema"
import type { ApartmentForEditResponse } from "@/lib/api/types/apartments"

const DEFAULT_FORM_VALUES: EditApartmentFormInput = {
  title: "",
  description: "",
  nightlyRate: "",
  cleaningFee: "",
  currency: "USD",
}

function toFormValues(
  apartment: ApartmentForEditResponse
): EditApartmentFormInput {
  return {
    title: apartment.title ?? "",
    description: apartment.description ?? "",
    nightlyRate:
      apartment.pricing.nightlyRate != null
        ? String(apartment.pricing.nightlyRate)
        : "",
    cleaningFee:
      apartment.pricing.cleaningFee != null
        ? String(apartment.pricing.cleaningFee)
        : "",
    currency: apartment.pricing.currency ?? "USD",
  }
}

function toFormInput(values: EditApartmentFormValues): EditApartmentFormInput {
  return {
    title: values.title,
    description: values.description,
    nightlyRate: String(values.nightlyRate),
    cleaningFee: String(values.cleaningFee),
    currency: values.currency,
  }
}

export function ApartmentDetailsForm({ apartmentId }: { apartmentId: string }) {
  const t = useTranslations("apartmentManage.details")

  const { data: apartment, isPending } = useApartmentForEdit(apartmentId)

  const {
    mutate: update,
    isPending: isSaving,
    error: saveError,
  } = useUpdateApartment()

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<EditApartmentFormInput, unknown, EditApartmentFormValues>({
    resolver: zodResolver(editApartmentSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  })

  // Initialize once for each apartment. Subsequent background refetches
  // must not overwrite the values the user is currently editing.
  const initializedApartmentIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!apartment) return
    if (initializedApartmentIdRef.current === apartmentId) return

    reset(toFormValues(apartment))
    initializedApartmentIdRef.current = apartmentId
  }, [apartment, apartmentId, reset])

  function onSubmit(values: EditApartmentFormValues) {
    update(
      {
        id: apartmentId,
        body: {
          name: values.title,
          description: values.description,
          priceAmount: values.nightlyRate,
          priceCurrency: values.currency,
          cleaningFeeAmount: values.cleaningFee,
          cleaningFeeCurrency: values.currency,
        },
      },
      {
        onSuccess: () => {
          // Establish the successfully submitted values as the new baseline.
          // A plain reset() afterwards will restore these values.
          reset(toFormInput(values))
        },
        onError: (err) => {
          getFormErrors(err, setError, [
            "title",
            "description",
            "nightlyRate",
            "cleaningFee",
            "currency",
          ])
        },
      }
    )
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  if (!apartment) return null

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* Basic information */}
        <section
          aria-labelledby="basic-info-heading"
          className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <h2
            id="basic-info-heading"
            className="text-lg font-semibold text-foreground"
          >
            {t("basicInfo")}
          </h2>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="apartment-title">{t("titleLabel")}</Label>
            <Input
              id="apartment-title"
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
            <Label htmlFor="apartment-description">
              {t("descriptionLabel")}
            </Label>
            <Textarea
              id="apartment-description"
              rows={8}
              {...register("description")}
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description?.message ? (
              <p role="alert" className="text-sm text-destructive">
                {t(`errors.${errors.description.message}`)}
              </p>
            ) : null}
          </div>
        </section>

        {/* Pricing */}
        <section
          aria-labelledby="pricing-heading"
          className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              id="pricing-heading"
              className="text-lg font-semibold text-foreground"
            >
              {t("pricing")}
            </h2>

            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-24"
                    aria-label={t("currencyLabel")}
                    aria-invalid={Boolean(errors.currency)}
                  >
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

          {errors.currency?.message ? (
            <p role="alert" className="text-sm text-destructive">
              {t(`errors.${errors.currency.message}`)}
            </p>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="apartment-nightly-rate">
              {t("nightlyRateLabel")}
            </Label>
            <Input
              id="apartment-nightly-rate"
              type="number"
              step="0.01"
              min={0}
              {...register("nightlyRate")}
              aria-invalid={Boolean(errors.nightlyRate)}
            />
            {errors.nightlyRate?.message ? (
              <p role="alert" className="text-sm text-destructive">
                {t(`errors.${errors.nightlyRate.message}`)}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="apartment-cleaning-fee">
              {t("cleaningFeeLabel")}
            </Label>
            <Input
              id="apartment-cleaning-fee"
              type="number"
              step="0.01"
              min={0}
              {...register("cleaningFee")}
              aria-invalid={Boolean(errors.cleaningFee)}
            />
            {errors.cleaningFee?.message ? (
              <p role="alert" className="text-sm text-destructive">
                {t(`errors.${errors.cleaningFee.message}`)}
              </p>
            ) : null}
          </div>
        </section>

        {/* Address — read-only */}
        <section
          aria-labelledby="address-heading"
          className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2"
        >
          <h2
            id="address-heading"
            className="text-lg font-semibold text-foreground"
          >
            {t("address")}
          </h2>

          <div className="flex items-start gap-3 rounded-xl bg-muted p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-destructive shadow-sm">
              <Lock aria-hidden="true" className="size-4" />
            </span>
            <div>
              <h3 className="font-semibold text-foreground">
                {t("addressLockedTitle")}
              </h3>
              <p className="mt-1 text-sm text-foreground/70">
                {t("addressLockedDescription")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AddressField
              label={t("street")}
              value={apartment.address.street}
            />
            <AddressField label={t("city")} value={apartment.address.city} />
            <AddressField
              label={t("zipCode")}
              value={apartment.address.zipCode}
            />
            <AddressField
              label={t("country")}
              value={apartment.address.country}
            />
          </div>

          {/* Map placeholder */}
          <div
            role="img"
            aria-label={t("mapDisabledAria")}
            className="flex h-44 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted text-sm text-foreground/70"
          >
            <MapPin aria-hidden="true" className="size-6" />
            <span>{t("mapComingSoon")}</span>
          </div>
        </section>
      </div>

      {saveError ? <ValidationErrorList errors={[t("submitError")]} /> : null}

      <UnsavedChangesBar
        isVisible={isDirty}
        isSaving={isSaving}
        onSave={handleSubmit(onSubmit)}
        onReset={() => reset()}
      />
    </form>
  )
}

function AddressField({
  label,
  value,
}: {
  label: string
  value?: string | null
}) {
  return (
    <div className="space-y-1 rounded-lg bg-muted p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-wide text-foreground/70 uppercase">
          {label}
        </span>
        <Lock aria-hidden="true" className="size-3.5 text-foreground/50" />
      </div>
      <p className="font-medium text-foreground">{value ?? "—"}</p>
    </div>
  )
}
