"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { MailCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ValidationErrorList } from "@/components/feedback/ValidationErrorList"
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/forgot-password-schema"
import { getFormErrors } from "@/lib/errors/get-form-errors"

export function ForgotPasswordForm() {
  const t = useTranslations("auth")
  const [formErrors, setFormErrors] = React.useState<string[]>([])
  const [submitted, setSubmitted] = React.useState(false)
  const mutation = useForgotPassword()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  const fieldErrorMessages: Record<string, string> = {
    required: t("errors.required"),
    invalidEmail: t("errors.invalidEmail"),
  }

  function messageFor(code?: string) {
    if (!code) return undefined
    return fieldErrorMessages[code] ?? code
  }

  async function onSubmit(values: ForgotPasswordFormValues) {
    setFormErrors([])
    try {
      await mutation.mutateAsync(values)
      setSubmitted(true)
    } catch (error) {
      setFormErrors(getFormErrors(error, setError, ["email"] as const))
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <MailCheck className="size-10 text-primary" aria-hidden="true" />
        <h1 className="text-xl font-semibold tracking-tight">
          {t("checkEmailTitle")}
        </h1>
        <p className="text-sm text-foreground">
          {t("checkEmailDescription")}
        </p>
        <Link
          href="/login"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("backToLogin")}
        </Link>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-xl font-semibold tracking-tight">
          {t("forgotPasswordTitle")}
        </h1>
        <p className="text-sm text-balance text-foreground">
          {t("forgotPasswordSubtitle")}
        </p>
      </div>

      <ValidationErrorList errors={formErrors} />

      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="forgot-email">{t("emailLabel")}</Label>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email ? (
            <p role="alert" className="text-xs text-destructive">
              {messageFor(errors.email.message)}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? t("sending") : t("sendResetLink")}
        </Button>
      </div>

      <p className="text-center text-sm text-foreground">
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("backToLogin")}
        </Link>
      </p>
    </form>
  )
}
