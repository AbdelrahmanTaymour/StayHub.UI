"use client"

import { ImagePlus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useId, useRef, useState, type DragEvent } from "react"

import { cn } from "cn"
import {
  ALLOWED_IMAGE_TYPES,
  MAX_APARTMENT_IMAGES,
} from "@/features/apartments/utils/image-upload-validation"

interface ApartmentImageUploadSlotProps {
  currentCount: number
  isUploading: boolean
  onFilesSelected: (files: File[]) => void
}

export function ApartmentImageUploadSlot({
  currentCount,
  isUploading,
  onFilesSelected,
}: ApartmentImageUploadSlotProps) {
  const t = useTranslations("apartmentManage.images")
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const remaining = MAX_APARTMENT_IMAGES - currentCount
  const isFull = remaining <= 0

  function handleFiles(fileList: FileList | null) {
    if (!fileList || isFull) return
    onFilesSelected(Array.from(fileList))
    if (inputRef.current) inputRef.current.value = ""
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDragOver(false)
    if (isFull) return
    handleFiles(event.dataTransfer.files)
  }

  return (
    <button
      type="button"
      disabled={isFull || isUploading}
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault()
        if (!isFull) setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      aria-describedby={`${inputId}-hint`}
      className={cn(
        "flex min-h-55 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-muted p-6 text-center transition-colors",
        isDragOver && "border-primary bg-primary/5",
        !isDragOver && "border-border hover:bg-muted/70",
        (isFull || isUploading) && "cursor-not-allowed opacity-60"
      )}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        aria-label={t("addPhotos")}
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
        disabled={isFull || isUploading}
      />

      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full bg-card text-tertiary shadow-sm"
      >
        <ImagePlus className="size-6" />
      </span>

      <span className="font-semibold text-foreground">
        {isUploading ? t("uploading") : t("addPhotos")}
      </span>
      <span id={`${inputId}-hint`} className="text-xs text-foreground/70">
        {isFull ? t("limitReached") : t("slotsRemaining", { count: remaining })}
      </span>
    </button>
  )
}
