"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Banknote, CalendarDays, MapPin, Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"

import { usePathname, useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ApartmentSearchFormInput,
  apartmentSearchSchema,
  type ApartmentSearchFormValues,
} from "@/features/apartments/schemas/apartment-search-schema"
import {
  filtersFromSearchParams,
  filtersToSearchParams,
} from "@/features/apartments/utils/search-params"

const fieldInputClassName =
  "h-8 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"

function getTodayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function HeroSearchBar() {
  const t = useTranslations("search")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const defaults = filtersFromSearchParams(searchParams)
  const todayIso = getTodayIso()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApartmentSearchFormInput, unknown, ApartmentSearchFormValues>({
    resolver: zodResolver(apartmentSearchSchema),
    defaultValues: {
      city: defaults.city ?? "",
      minPrice:
        defaults.minPrice !== undefined ? String(defaults.minPrice) : "",
      maxPrice:
        defaults.maxPrice !== undefined ? String(defaults.maxPrice) : "",
      start: defaults.start ?? todayIso,
      end: defaults.end ?? todayIso,
    },
  })

  const errorMessages: Record<string, string> = {
    maxBelowMin: t("errors.maxBelowMin"),
    datesIncomplete: t("errors.datesIncomplete"),
    endBeforeStart: t("errors.endBeforeStart"),
    invalidNumber: t("errors.invalidNumber"),
    mustBePositive: t("errors.mustBePositive"),
    mustBeNonNegative: t("errors.mustBeNonNegative"),
  }

  function messageFor(code?: string) {
    return code ? errorMessages[code] : undefined
  }

  function onSubmit(values: ApartmentSearchFormValues) {
    const params = filtersToSearchParams(values)
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  const endErrorMessage = messageFor(errors.end?.message)
  const maxPriceErrorMessage = messageFor(errors.maxPrice?.message)

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={t("formLabel")}
      className="flex w-full max-w-7xl flex-col items-stretch divide-y divide-border rounded-2xl border border-border bg-card p-1.5 shadow-xl transition-shadow hover:shadow-2xl xl:flex-row xl:items-center xl:divide-x xl:divide-y-0 xl:rounded-full"
    >
      {/* City */}
      <div className="group flex-1 rounded-xl px-5 py-3 text-start transition-colors hover:bg-muted xl:rounded-full xl:py-2.5">
        <label
          htmlFor="search-city"
          className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
        >
          {t("cityLabel")}
        </label>

        <div className="flex items-center gap-2">
          <MapPin
            className="size-[18px] shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
            aria-hidden="true"
          />

          <Input
            id="search-city"
            placeholder={t("cityPlaceholder")}
            autoComplete="address-level2"
            className={`${fieldInputClassName} min-w-0 truncate font-semibold`}
            {...register("city")}
          />
        </div>
      </div>

      {/* Check-in */}
      <div className="group flex-1 rounded-xl px-5 py-3 text-start transition-colors hover:bg-muted xl:rounded-full xl:py-2.5">
        <label
          htmlFor="search-start"
          className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
        >
          {t("checkInLabel")}
        </label>

        <div className="flex items-center gap-2">
          <CalendarDays
            className="size-[18px] shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
            aria-hidden="true"
          />

          <Input
            id="search-start"
            type="date"
            className={`${fieldInputClassName} min-w-0 truncate font-semibold`}
            {...register("start")}
          />
        </div>
      </div>

      {/* Check-out */}
      <div className="group flex-1 rounded-xl px-5 py-3 text-start transition-colors hover:bg-muted xl:rounded-full xl:py-2.5">
        <label
          htmlFor="search-end"
          className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
        >
          {t("checkOutLabel")}
        </label>

        <div className="flex items-center gap-2">
          <CalendarDays
            className="size-[18px] shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
            aria-hidden="true"
          />

          <Input
            id="search-end"
            type="date"
            aria-invalid={Boolean(errors.end)}
            aria-describedby={endErrorMessage ? "search-end-error" : undefined}
            className={`${fieldInputClassName} min-w-0 truncate font-semibold`}
            {...register("end")}
          />
        </div>
      </div>

      {/* Price range */}
      <div className="group flex-[1.25] rounded-xl px-5 py-3 text-start transition-colors hover:bg-muted xl:rounded-full xl:py-2.5">
        <label className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {t("pricePerNightLabel")}
        </label>

        <div className="flex items-center gap-2">
          <Banknote
            className="size-[18px] shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
            aria-hidden="true"
          />

          <div className="flex w-full min-w-0 items-center gap-1.5">
            <span
              className="shrink-0 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              $
            </span>

            <Input
              id="search-min-price"
              type="number"
              inputMode="numeric"
              min={0}
              aria-label={t("minPriceLabel")}
              placeholder={t("minPricePlaceholder")}
              className={`${fieldInputClassName} min-w-0 flex-1 font-semibold`}
              {...register("minPrice")}
            />

            <Input
              id="search-max-price"
              type="number"
              inputMode="numeric"
              min={0}
              aria-label={t("maxPriceLabel")}
              aria-invalid={Boolean(errors.maxPrice)}
              aria-describedby={
                maxPriceErrorMessage ? "search-max-price-error" : undefined
              }
              placeholder={t("maxPricePlaceholder")}
              className={`${fieldInputClassName} min-w-0 flex-1 font-semibold`}
              {...register("maxPrice")}
            />
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex items-center justify-center p-1.5 xl:pl-2">
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full gap-2 rounded-full px-8 font-semibold transition-all active:scale-95 xl:w-auto"
        >
          <Search className="size-5" aria-hidden="true" />
          <span>{t("submit")}</span>
        </Button>
      </div>

      {/* Validation errors */}
      {(endErrorMessage || maxPriceErrorMessage) && (
        <div className="order-last basis-full space-y-1 px-4 pt-1 pb-2 text-start">
          {endErrorMessage && (
            <p
              id="search-end-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {endErrorMessage}
            </p>
          )}

          {maxPriceErrorMessage && (
            <p
              id="search-max-price-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {maxPriceErrorMessage}
            </p>
          )}
        </div>
      )}
    </form>
  )
}
