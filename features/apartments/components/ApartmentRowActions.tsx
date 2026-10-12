"use client"

import { useTranslations } from "next-intl"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useActivateApartment } from "../hooks/useActivateApartment"
import { MyApartmentsResponse } from "@/lib/api/types/apartments"
import { useDeactivateApartment } from "../hooks/useDeactivateApartment"
import { MoreVertical } from "lucide-react"

export function ApartmentRowActions({
  apartment,
  t,
}: {
  apartment: MyApartmentsResponse
  t: ReturnType<typeof useTranslations<"myApartments.table">>
}) {
  const { mutate: activate, isPending: isActivating } = useActivateApartment()
  const { mutate: deactivate, isPending: isDeactivating } =
    useDeactivateApartment()
  const isPending = isActivating || isDeactivating

  return (
    <div className="flex items-center justify-end gap-1">
      {apartment.id ? (
        apartment.isActive ? (
          <span
            title={t("manageComingSoon")}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "pointer-events-none opacity-60",
            })}
          >
            {t("manage")}
          </span>
        ) : (
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={() => activate(apartment.id!)}
          >
            {t("activate")}
          </Button>
        )
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("operations")}
            />
          }
        >
          <MoreVertical aria-hidden="true" className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t("operations")}</DropdownMenuLabel>
            {/* TODO: wire these to their dedicated pages once built */}

            <DropdownMenuItem disabled>{t("availability")}</DropdownMenuItem>
            <DropdownMenuItem disabled>
              {t("staffAssignments")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {apartment.id && apartment.isActive ? (
            <DropdownMenuItem
              variant="destructive"
              disabled={isPending}
              onClick={() => deactivate(apartment.id!)}
            >
              {t("deactivate")}
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
