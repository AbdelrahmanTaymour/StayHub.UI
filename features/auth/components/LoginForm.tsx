"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"

import { Link, useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/common/PasswordInput"
import { ValidationErrorList } from "@/components/feedback/ValidationErrorList"
import { GoogleAuthButton } from "@/features/auth/components/GoogleAuthButton"
import { useLogin } from "@/features/auth/hooks/useLogin"
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-schema"

export function LoginForm() {
  const t = useTranslations("auth")
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("from") || "/"

  const [formErrors, setFormErrors] = React.useState<string[]>([])
  const mutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const fieldErrorMessages: Record<string, string> = {
    required: t("errors.required"),
    invalidEmail: t("errors.invalidEmail"),
  }

  function messageFor(code?: string) {
    if (!code) return undefined
    return fieldErrorMessages[code] ?? code
  }

  async function onSubmit(values: LoginFormValues) {
    setFormErrors([])
    try {
      await mutation.mutateAsync(values)
      router.push(redirectTo)
    } catch {
      setFormErrors([t("errors.invalidCredentials")])
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-xl font-semibold tracking-tight">
          {t("loginTitle")}
        </h1>
        <p className="text-sm text-balance text-foreground">
          {t("loginSubtitle")}
        </p>
      </div>

      <ValidationErrorList errors={formErrors} />

      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="login-email">{t("emailLabel")}</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p
              id="login-email-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {messageFor(errors.email.message)}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">{t("passwordLabel")}</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            toggleLabel={{ show: t("showPassword"), hide: t("hidePassword") }}
            {...register("password")}
          />
          {errors.password ? (
            <p
              id="login-password-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {messageFor(errors.password.message)}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? t("loggingIn") : t("login")}
        </Button>
      </div>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-foreground">
          {t("orContinueWith")}
        </span>
      </div>

      <GoogleAuthButton />

      <p className="text-center text-sm text-foreground">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("signUp")}
        </Link>
      </p>
    </form>
  )
}
