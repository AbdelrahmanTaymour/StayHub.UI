"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import { Switch } from "@/components/ui/switch"
import { useActivateApartment } from "@/features/apartments/hooks/useActivateApartment"
import { useDeactivateApartment } from "../hooks/useDeactivateApartment"

interface ApartmentStatusToggleProps {
  apartmentId: string
  isActive: boolean
}

export function ApartmentStatusToggle({
  apartmentId,
  isActive,
}: ApartmentStatusToggleProps) {
  const t = useTranslations("apartmentManage")
  const { mutate: activate, isPending: isActivating } =
    useActivateApartment(apartmentId)
  const { mutate: deactivate, isPending: isDeactivating } =
    useDeactivateApartment(apartmentId)
  const isPending = isActivating || isDeactivating

  const [checked, setChecked] = useState(isActive)
  const [syncedValue, setSyncedValue] = useState(isActive)
  if (isActive !== syncedValue) {
    setSyncedValue(isActive)
    setChecked(isActive)
  }

  function handleCheckedChange(next: boolean) {
    if (isPending) return

    setChecked(next)
    if (next) {
      activate(apartmentId, { onError: () => setChecked(!next) })
    } else {
      deactivate(apartmentId, { onError: () => setChecked(!next) })
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5">
      <span className="text-sm font-medium text-foreground">
        {checked ? t("statusActiveLabel") : t("statusInactiveLabel")}
      </span>
      <Switch
        checked={checked}
        disabled={isPending}
        onCheckedChange={handleCheckedChange}
        aria-label={t("toggleStatusAria")}
      />
    </div>
  )
}
