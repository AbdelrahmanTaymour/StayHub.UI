"use client"

import { ArrowLeft, Phone, User } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "@/i18n/navigation"
import { StatusBadge } from "@/components/common/StatusBadge"
import { bookingStatusConfig } from "@/lib/status/status-config"
import { formatPrice } from "@/lib/utils/formatPrice"
import { useBookingDetailsForConversation } from "../hooks/useBookingDetailsForConversation"
import { useChatDetails } from "../providers/ChatDetailsProvider"

export function BookingDetailsPanel() {
  const t = useTranslations("chats")
  const locale = useLocale()
  const { close } = useChatDetails()
  const params = useParams<{ chatId?: string }>()
  const conversationId = params.chatId

  const { data, isPending } = useBookingDetailsForConversation(
    conversationId ?? "",
    Boolean(conversationId)
  )

  const nights =
    data?.checkIn && data?.checkOut
      ? Math.round(
          (new Date(data.checkOut).getTime() -
            new Date(data.checkIn).getTime()) /
            86_400_000
        )
      : null

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-2 border-b border-border p-4 lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={close}
          aria-label={t("backToConversation")}
        >
          <ArrowLeft aria-hidden="true" className="size-5 rtl:rotate-180" />
        </Button>
        <h2 className="font-semibold text-foreground">
          {t("reservationDetails")}
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isPending ? (
          <div className="flex flex-col gap-4 p-5">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
        ) : !data ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
            <p className="font-medium text-foreground">{t("noBookingTitle")}</p>
            <p className="text-sm text-foreground/70">
              {t("noBookingDescription")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 p-5">
            <div className="hidden items-center justify-between lg:flex">
              <h3 className="text-base font-semibold text-foreground">
                {t("reservationDetails")}
              </h3>
              {data.status ? (
                <StatusBadge
                  status={data.status}
                  config={bookingStatusConfig}
                  namespace="bookings.status"
                />
              ) : null}
            </div>

            <div className="relative h-44 w-full overflow-hidden rounded-xl bg-muted">
              {data.apartmentImageUrl ? (
                <Image
                  src={data.apartmentImageUrl}
                  alt=""
                  fill
                  sizes="380px"
                  className="object-cover"
                />
              ) : null}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-end bg-linear-to-t from-foreground/70 via-transparent to-transparent p-4"
              >
                <span className="truncate text-base font-semibold text-background">
                  {data.apartmentName}
                </span>
              </div>
            </div>

            {data.apartmentAddress ? (
              <p className="text-sm text-foreground/70">
                {data.apartmentAddress}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 rounded-xl bg-muted p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[11px] tracking-wide text-foreground/70 uppercase">
                    {t("checkIn")}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {data.checkIn ? formatDate(data.checkIn, locale) : "—"}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] tracking-wide text-foreground/70 uppercase">
                    {t("checkOut")}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {data.checkOut ? formatDate(data.checkOut, locale) : "—"}
                  </span>
                </div>
              </div>
              {nights != null ? (
                <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="text-foreground/70">{t("duration")}</span>
                  <span className="font-medium text-foreground">
                    {t("nights", { count: nights })}
                  </span>
                </div>
              ) : null}
              {data.totalPriceAmount != null && data.totalPriceCurrency ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">{t("totalCost")}</span>
                  <span className="font-semibold text-tertiary">
                    {formatPrice(
                      data.totalPriceAmount,
                      data.totalPriceCurrency,
                      locale
                    )}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-[11px] tracking-wide text-foreground/70 uppercase">
                {t("primaryHost")}
              </h4>
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <Avatar className="size-11 shrink-0">
                  <AvatarImage src={data.hostAvatarUrl ?? undefined} alt="" />
                  <AvatarFallback>
                    <User aria-hidden="true" className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {data.hostName}
                  </p>
                  {data.hostPhoneNumber ? (
                    <p className="flex items-center gap-1 text-xs text-foreground/70">
                      <Phone aria-hidden="true" className="size-3" />
                      {data.hostPhoneNumber}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {data.bookingId ? (
              <Link
                href={`/me/bookings/${data.bookingId}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                {t("viewFullBooking")}
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}
