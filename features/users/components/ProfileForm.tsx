"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRef } from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { UnsavedChangesBar } from "@/components/common/UnsavedChangesBar"
import { ValidationErrorList } from "@/components/feedback/ValidationErrorList"
import { getFormErrors } from "@/lib/errors/get-form-errors"
import { useLoggedInUser } from "@/features/users/hooks/useLoggedInUser"
import { useUpdateUserName } from "@/features/users/hooks/useUpdateUserName"
import { useUpdateUserProfile } from "@/features/users/hooks/useUpdateUserProfile"
import {
  profileSchema,
  type ProfileFormValues,
} from "@/features/users/schemas/profile-schema"
import { ProfileAvatarUploader } from "./ProfileAvatarUploader"
import { LoggedInUserResponse } from "@/lib/api/types/users"

function toFormValues(user: LoggedInUserResponse): ProfileFormValues {
  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    bio: user.bio ?? "",
    phoneNumber: user.phoneNumber ?? "",
  }
}

export function ProfileForm() {
  const t = useTranslations("profile")
  const { data: user, isPending } = useLoggedInUser()
  const { mutate: saveName, isPending: isSavingName } = useUpdateUserName()
  const {
    mutate: saveProfile,
    isPending: isSavingProfile,
    error: saveError,
  } = useUpdateUserProfile()
  const isSaving = isSavingName || isSavingProfile

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "", bio: "", phoneNumber: "" },
  })

  // Reset exactly once per loaded user — same one-time pattern used for
  // ApartmentDetailsForm, so background refetches (e.g. after the avatar
  // mutation invalidates this same query) never clobber in-progress edits.
  const initializedUserIdRef = useRef<string | null>(null)
  if (user && initializedUserIdRef.current !== user.id) {
    reset(toFormValues(user))
    initializedUserIdRef.current = user.id ?? null
  }

  function onSubmit(values: ProfileFormValues) {
    const knownFields = ["firstName", "lastName", "bio", "phoneNumber"] as const

    if (dirtyFields.firstName || dirtyFields.lastName) {
      saveName(
        { firstName: values.firstName, lastName: values.lastName },
        { onError: (err) => getFormErrors(err, setError, knownFields) }
      )
    }
    if (dirtyFields.bio || dirtyFields.phoneNumber) {
      saveProfile(
        { bio: values.bio || null, phoneNumber: values.phoneNumber || null },
        {
          onSuccess: () => reset(values),
          onError: (err) => getFormErrors(err, setError, knownFields),
        }
      )
    } else {
      reset(values)
    }
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="mx-auto h-24 w-24 rounded-full" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!user) return null

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      <ProfileAvatarUploader
        avatarUrl={user.avatarUrl}
        displayName={[user.firstName, user.lastName].filter(Boolean).join(" ")}
      />

      <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-first-name">{t("firstName")}</Label>
            <Input
              id="profile-first-name"
              {...register("firstName")}
              aria-invalid={Boolean(errors.firstName)}
            />
            {errors.firstName?.message ? (
              <p role="alert" className="text-sm text-destructive">
                {t(`errors.${errors.firstName.message}`)}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-last-name">{t("lastName")}</Label>
            <Input
              id="profile-last-name"
              {...register("lastName")}
              aria-invalid={Boolean(errors.lastName)}
            />
            {errors.lastName?.message ? (
              <p role="alert" className="text-sm text-destructive">
                {t(`errors.${errors.lastName.message}`)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-email">{t("email")}</Label>
          <Input
            id="profile-email"
            value={user.email ?? ""}
            disabled
            readOnly
          />
          <p className="text-xs text-foreground/70">{t("emailHint")}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-phone">{t("phoneNumber")}</Label>
          <Input
            id="profile-phone"
            type="tel"
            {...register("phoneNumber")}
            aria-invalid={Boolean(errors.phoneNumber)}
          />
          {errors.phoneNumber?.message ? (
            <p role="alert" className="text-sm text-destructive">
              {t(`errors.${errors.phoneNumber.message}`)}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-bio">{t("bio")}</Label>
          <Textarea
            id="profile-bio"
            rows={4}
            {...register("bio")}
            aria-invalid={Boolean(errors.bio)}
          />
          {errors.bio?.message ? (
            <p role="alert" className="text-sm text-destructive">
              {t(`errors.${errors.bio.message}`)}
            </p>
          ) : null}
        </div>
      </div>

      {saveError ? <ValidationErrorList errors={[t("submitError")]} /> : null}

      <UnsavedChangesBar
        isVisible={isDirty}
        isSaving={isSaving}
        onSave={handleSubmit(onSubmit)}
        onReset={() => reset(toFormValues(user))}
      />
    </form>
  )
}
