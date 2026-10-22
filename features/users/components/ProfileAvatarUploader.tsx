"use client"

import { Camera, Loader2, User } from "lucide-react"
import { useTranslations } from "next-intl"
import { useId, useRef, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUpdateProfileAvatar } from "@/features/users/hooks/useUpdateProfileAvatar"
import { validateAvatarFile } from "@/features/users/utils/avatar-upload-validation"

interface ProfileAvatarUploaderProps {
  avatarUrl?: string | null
  displayName: string
}

export function ProfileAvatarUploader({
  avatarUrl,
  displayName,
}: ProfileAvatarUploaderProps) {
  const t = useTranslations("profile.avatar")
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const { mutate, isPending } = useUpdateProfileAvatar()

  function handleChange(fileList: FileList | null) {
    const file = fileList?.[0]
    if (!file) return

    const validationError = validateAvatarFile(file)
    if (validationError) {
      setError(t(`validation.${validationError}`))
      if (inputRef.current) inputRef.current.value = ""
      return
    }

    setError(null)
    mutate(file)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className="size-24 shadow-sm">
          <AvatarImage src={avatarUrl ?? undefined} alt="" />
          <AvatarFallback>
            <User aria-hidden="true" className="size-9" />
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
          aria-label={t("changeAvatar", { name: displayName })}
          className="absolute inset-e-0 bottom-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Camera aria-hidden="true" className="size-4" />
          )}
        </button>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label={t("changeAvatar", { name: displayName })}
          className="sr-only"
          onChange={(event) => handleChange(event.target.files)}
          disabled={isPending}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        <p className="text-xs text-foreground/70">{t("hint")}</p>
      )}
    </div>
  )
}
