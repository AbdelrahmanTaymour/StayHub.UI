"use client"

import { useTranslations } from "next-intl"
import { useEffect, useRef, useState, type DragEvent } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { useApartmentImages } from "@/features/apartments/hooks/useApartmentImages"
import { useAddApartmentImage } from "@/features/apartments/hooks/useAddApartmentImage"
import { useDeleteApartmentImage } from "@/features/apartments/hooks/useDeleteApartmentImage"
import { useReorderApartmentImages } from "@/features/apartments/hooks/useReorderApartmentImages"
import { useSetPrimaryApartmentImage } from "@/features/apartments/hooks/useSetPrimaryApartmentImage"
import {
  MAX_APARTMENT_IMAGES,
  validateImageFile,
} from "@/features/apartments/utils/image-upload-validation"
import { ApartmentImageCard } from "./ApartmentImageCard"
import { ApartmentImagePreviewDialog } from "./ApartmentImagePreviewDialog"
import { ApartmentImageUploadSlot } from "./ApartmentImageUploadSlot"
import { ApartmentImageResponse } from "@/lib/api/types/apartments"

function sortByOrder(images: ApartmentImageResponse[]) {
  return [...images].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  )
}

export function ApartmentImageManager({
  apartmentId,
}: {
  apartmentId: string
}) {
  const t = useTranslations("apartmentManage.images")
  const { data: images, isPending } = useApartmentImages(apartmentId)

  const { mutate: addImage, isPending: isUploading } =
    useAddApartmentImage(apartmentId)
  const { mutate: deleteImage, isPending: isDeleting } =
    useDeleteApartmentImage(apartmentId)
  const { mutate: setPrimary, isPending: isSettingPrimary } =
    useSetPrimaryApartmentImage(apartmentId)
  const { mutate: reorder } = useReorderApartmentImages(apartmentId)

  // Local order drives the UI (the drag itself is the optimistic update);
  // synced from the server list whenever its content actually changes.
  const [order, setOrder] = useState<ApartmentImageResponse[]>([])
  const lastSyncedKey = useRef<string>("")

  useEffect(() => {
    if (!images) return
    const key = images.map((i) => i.id).join(",")
    if (key === lastSyncedKey.current) return
    lastSyncedKey.current = key
    setOrder(sortByOrder(images))
  }, [images])

  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const isBusy = isDeleting || isSettingPrimary

  function persistOrder(next: ApartmentImageResponse[]) {
    const previous = order
    setOrder(next)
    const ids = next.flatMap((img) => (img.id ? [img.id] : []))
    reorder(ids, { onError: () => setOrder(previous) })
  }

  function moveTo(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= order.length || fromIndex === toIndex) return
    const next = [...order]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    persistOrder(next)
  }

  function handleDragStart(index: number) {
    return (event: DragEvent<HTMLDivElement>) => {
      setDragIndex(index)
      event.dataTransfer.effectAllowed = "move"
    }
  }

  function handleDragOver(index: number) {
    return (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      if (dragIndex === null || dragIndex === index) return
      const next = [...order]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(index, 0, moved)
      setOrder(next)
      setDragIndex(index)
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (dragIndex !== null) persistOrder(order)
    setDragIndex(null)
  }

  function handleSetPrimary(imageId: string) {
    const previous = order
    setOrder((current) =>
      current.map((img) => ({ ...img, isPrimary: img.id === imageId }))
    )
    setPrimary(imageId, { onError: () => setOrder(previous) })
  }

  function handleFilesSelected(files: File[]) {
    setUploadError(null)
    const availableSlots = MAX_APARTMENT_IMAGES - order.length

    files.slice(0, availableSlots).forEach((file, index) => {
      const error = validateImageFile(file, order.length + index)
      if (error) {
        setUploadError(t(`validation.${error}`))
        return
      }
      addImage({ file, isPrimary: order.length === 0 && index === 0 })
    })

    if (files.length > availableSlots) {
      setUploadError(t("validation.limitReached"))
    }
  }

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-80 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {t("pageTitle")}
          </h1>
          <p className="mt-1 text-sm text-foreground/70">
            {t("pageDescription")}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
          <span className="font-bold text-foreground">{order.length}</span>
          <span className="text-foreground/70">
            / {MAX_APARTMENT_IMAGES} {t("photos")}
          </span>
        </div>
      </header>

      {uploadError ? (
        <p role="alert" className="text-sm text-destructive">
          {uploadError}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {order.map((image, index) => (
          <ApartmentImageCard
            key={image.id}
            image={image}
            position={index}
            total={order.length}
            isDragging={dragIndex === index}
            canDelete={order.length > 1}
            isBusy={isBusy}
            onDragStart={handleDragStart(index)}
            onDragOver={handleDragOver(index)}
            onDrop={handleDrop}
            onDragEnd={() => setDragIndex(null)}
            onMoveLeft={() => moveTo(index, index - 1)}
            onMoveRight={() => moveTo(index, index + 1)}
            onSetPrimary={() => image.id && handleSetPrimary(image.id)}
            onPreview={() => setPreviewUrl(image.url ?? null)}
            onDelete={() => image.id && deleteImage(image.id)}
          />
        ))}

        <ApartmentImageUploadSlot
          currentCount={order.length}
          isUploading={isUploading}
          onFilesSelected={handleFilesSelected}
        />
      </div>

      <ApartmentImagePreviewDialog
        url={previewUrl}
        alt={t("previewAlt")}
        onClose={() => setPreviewUrl(null)}
      />
    </div>
  )
}
