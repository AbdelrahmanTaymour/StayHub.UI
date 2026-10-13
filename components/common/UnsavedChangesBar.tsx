"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { cn } from "cn"

interface UnsavedChangesBarProps {
  isVisible: boolean
  isSaving: boolean
  onSave: () => void
  onReset: () => void
}

/**
 * Shared floating confirm bar for any tab with editable fields. Visibility
 * is driven by the caller's form isDirty state, so this component owns no
 * form logic of its own — just the bar and its two actions.
 */
export function UnsavedChangesBar({
  isVisible,
  isSaving,
  onSave,
  onReset,
}: UnsavedChangesBarProps) {
  const t = useTranslations("common.unsavedChanges")

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-3xl items-center justify-between gap-4 rounded-xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur transition-all duration-200",
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden="true"
          className="size-2.5 shrink-0 rounded-full bg-primary"
        />
        <span className="truncate text-sm text-foreground">{t("message")}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={isSaving}
        >
          {t("reset")}
        </Button>
        <Button type="button" size="sm" onClick={onSave} disabled={isSaving}>
          {isSaving ? t("saving") : t("save")}
        </Button>
      </div>
    </div>
  )
}
