"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Banknote, MapPin, Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useEffect, useId, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"

import { DateRangePicker } from "@/components/common/DateRangePicker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter } from "@/i18n/navigation"
import {
  apartmentSearchSchema,
  type ApartmentSearchFormInput,
  type ApartmentSearchFormValues,
} from "@/features/apartments/schemas/apartment-search-schema"
import {
  filtersFromSearchParams,
  filtersToSearchParams,
} from "@/features/apartments/utils/search-params"
import { cn } from "cn"
import {
  formValuesToFilters,
  stayFromSearchParams,
} from "../schemas/search-params"

const FIELD_CLASS =
  "flex min-w-0 flex-1 flex-col gap-1 rounded-xl px-4 py-3 text-start transition-colors hover:bg-muted xl:rounded-full xl:px-5"
const LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-wider text-foreground"
const INPUT_CLASS =
  "h-8 border-0 bg-transparent px-0 py-0 font-semibold shadow-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:ring-0 dark:bg-transparent"

export function HeroSearchBar() {
  const t = useTranslations("search")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const cityId = useId()
  const stayId = useId()
  const minPriceId = useId()
  const maxPriceId = useId()
  const stayErrorId = useId()
  const maxPriceErrorId = useId()

  // Recomputed only when the URL changes, so typing isn't overwritten.
  const defaultValues = useMemo<ApartmentSearchFormInput>(() => {
    const filters = filtersFromSearchParams(searchParams)

    return {
      city: filters.city ?? "",
      minPrice: filters.minPrice !== undefined ? String(filters.minPrice) : "",
      maxPrice: filters.maxPrice !== undefined ? String(filters.maxPrice) : "",
      stay: stayFromSearchParams(filters),
    }
  }, [searchParams])

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApartmentSearchFormInput, unknown, ApartmentSearchFormValues>({
    resolver: zodResolver(apartmentSearchSchema),
    defaultValues,
  })

  // Keeps the form in sync with the URL, including after invalid input is cleared.
  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  function onSubmit(values: ApartmentSearchFormValues) {
    const query = filtersToSearchParams(formValuesToFilters(values)).toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    scrollToResults()
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label={t("formLabel")}
        className="flex w-full flex-col divide-y divide-border rounded-2xl border border-border bg-card p-1.5 shadow-xl xl:flex-row xl:items-center xl:divide-x xl:divide-y-0 xl:rounded-full"
      >
        <div className={FIELD_CLASS}>
          <label htmlFor={cityId} className={LABEL_CLASS}>
            {t("cityLabel")}
          </label>
          <div className="flex items-center gap-2">
            <MapPin
              aria-hidden="true"
              className="size-4 shrink-0 text-foreground"
            />
            <Input
              id={cityId}
              autoComplete="address-level2"
              placeholder={t("cityPlaceholder")}
              className={INPUT_CLASS}
              {...register("city")}
            />
          </div>
        </div>

        <div className={FIELD_CLASS}>
          <span className={LABEL_CLASS}>{t("stayLabel")}</span>
          <Controller
            control={control}
            name="stay"
            render={({ field }) => (
              <DateRangePicker
                id={stayId}
                value={field.value}
                onChange={field.onChange}
                placeholder={t("stayPlaceholder")}
                aria-invalid={Boolean(errors.stay)}
                aria-describedby={errors.stay ? stayErrorId : undefined}
                triggerClassName="h-8 border-0 bg-transparent px-0 shadow-none hover:bg-transparent"
              />
            )}
          />
        </div>

        <div className={cn(FIELD_CLASS, "flex-[1.25]")}>
          <span className={LABEL_CLASS}>{t("pricePerNightLabel")}</span>
          <div className="flex items-center gap-2">
            <Banknote
              aria-hidden="true"
              className="size-4 shrink-0 text-foreground"
            />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Input
                id={minPriceId}
                type="number"
                inputMode="numeric"
                min={0}
                aria-label={t("minPriceLabel")}
                placeholder={t("minPricePlaceholder")}
                className={INPUT_CLASS}
                {...register("minPrice")}
              />
              <span aria-hidden="true" className="text-muted-foreground">
                –
              </span>
              <Input
                id={maxPriceId}
                type="number"
                inputMode="numeric"
                min={0}
                aria-label={t("maxPriceLabel")}
                aria-invalid={Boolean(errors.maxPrice)}
                aria-describedby={errors.maxPrice ? maxPriceErrorId : undefined}
                placeholder={t("maxPricePlaceholder")}
                className={INPUT_CLASS}
                {...register("maxPrice")}
              />
            </div>
          </div>
        </div>

        <div className="p-1.5 xl:ps-2">
          <Button
            type="submit"
            size="lg"
            className="h-12 w-full gap-2 rounded-full px-8 xl:w-auto"
          >
            <Search aria-hidden="true" className="size-5" />
            {t("submit")}
          </Button>
        </div>
      </form>

      {errors.stay || errors.maxPrice ? (
        <div className="space-y-1 px-5 text-start xl:px-6">
          {errors.stay ? (
            <p
              id={stayErrorId}
              role="alert"
              className="text-xs text-destructive"
            >
              {t(`errors.${errors.stay.message ?? "datesIncomplete"}`)}
            </p>
          ) : null}
          {errors.maxPrice ? (
            <p
              id={maxPriceErrorId}
              role="alert"
              className="text-xs text-destructive"
            >
              {t(`errors.${errors.maxPrice.message ?? "maxBelowMin"}`)}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function scrollToResults() {
  document
    .getElementById("curated-stays")
    ?.scrollIntoView({ behavior: "smooth", block: "start" })
}
