"use client"

import { ArrowLeftRight, Eye, GripVertical, Star, Trash2 } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import type { DragEvent } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "cn"
import { ApartmentImageResponse } from "@/lib/api/types/apartments"

interface ApartmentImageCardProps {
  image: ApartmentImageResponse
  position: number
  total: number
  isDragging: boolean
  canDelete: boolean
  isBusy: boolean
  onDragStart: (event: DragEvent<HTMLDivElement>) => void
  onDragOver: (event: DragEvent<HTMLDivElement>) => void
  onDrop: (event: DragEvent<HTMLDivElement>) => void
  onDragEnd: () => void
  onMoveLeft: () => void
  onMoveRight: () => void
  onSetPrimary: () => void
  onPreview: () => void
  onDelete: () => void
}

export function ApartmentImageCard({
  image,
  position,
  total,
  isDragging,
  canDelete,
  isBusy,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onMoveLeft,
  onMoveRight,
  onSetPrimary,
  onPreview,
  onDelete,
}: ApartmentImageCardProps) {
  const t = useTranslations("apartmentManage.images")

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        "group flex cursor-grab flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all active:cursor-grabbing",
        isDragging && "opacity-40"
      )}
    >
      <div className="relative h-56 w-full bg-muted">
        {image.url ? (
          <Image
            src={image.url}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        ) : null}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-foreground/60 via-transparent to-transparent"
        />

        {image.isPrimary ? (
          <span className="absolute inset-s-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold tracking-wide text-primary-foreground uppercase">
            <Star aria-hidden="true" className="size-3.5 fill-current" />
            {t("primaryCover")}
          </span>
        ) : (
          <span className="absolute inset-s-3 top-3 rounded-full bg-card/90 px-2 py-0.5 text-xs font-bold text-foreground">
            #{position + 1}
          </span>
        )}

        <span
          aria-hidden="true"
          title={t("dragToReorder")}
          className="absolute inset-e-3 top-3 flex size-8 items-center justify-center rounded-lg bg-card/90 text-foreground shadow-sm"
        >
          <GripVertical className="size-4" />
        </span>
      </div>

      <div className="flex flex-col gap-2 p-3">
        {image.isPrimary ? (
          <span className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-sm font-medium text-foreground">
            <Star aria-hidden="true" className="size-4 text-tertiary" />
            {t("primaryPhoto")}
          </span>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isBusy}
            onClick={onSetPrimary}
            className="justify-center gap-1.5"
          >
            <Star aria-hidden="true" className="size-4" />
            {t("setPrimary")}
          </Button>
        )}

        <div className="flex items-center justify-between gap-1">
          {/* Keyboard-accessible reorder — native drag has no keyboard equivalent. */}
          <div className="flex items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isBusy || position === 0}
              onClick={onMoveLeft}
              aria-label={t("moveEarlier")}
            >
              <ArrowLeftRight
                aria-hidden="true"
                className="size-4 rotate-180 rtl:rotate-0"
              />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isBusy || position === total - 1}
              onClick={onMoveRight}
              aria-label={t("moveLater")}
            >
              <ArrowLeftRight
                aria-hidden="true"
                className="size-4 rtl:rotate-180"
              />
            </Button>
          </div>

          <div className="flex items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onPreview}
              aria-label={t("viewFull")}
            >
              <Eye aria-hidden="true" className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!canDelete || isBusy}
              title={!canDelete ? t("cannotDeleteLast") : undefined}
              onClick={onDelete}
              aria-label={t("deletePhoto")}
              className="hover:text-destructive"
            >
              <Trash2 aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
