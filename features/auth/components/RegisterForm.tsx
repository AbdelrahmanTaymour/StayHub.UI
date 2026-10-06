"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { Link, useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/common/PasswordInput"
import { ValidationErrorList } from "@/components/feedback/ValidationErrorList"
import { GoogleAuthButton } from "@/features/auth/components/GoogleAuthButton"
import { useRegister } from "@/features/auth/hooks/useRegister"
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/register-schema"
import { getFormErrors } from "@/lib/errors/get-form-errors"

export function RegisterForm() {
  const t = useTranslations("auth")
  const router = useRouter()
  const [formErrors, setFormErrors] = React.useState<string[]>([])
  const mutation = useRegister()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const fieldErrorMessages: Record<string, string> = {
    required: t("errors.required"),
    invalidEmail: t("errors.invalidEmail"),
    passwordTooShort: t("errors.passwordTooShort"),
    passwordsDontMatch: t("errors.passwordsDontMatch"),
  }

  function messageFor(code?: string) {
    if (!code) return undefined
    return fieldErrorMessages[code] ?? code
  }

  async function onSubmit(values: RegisterFormValues) {
    setFormErrors([])
    try {
      await mutation.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      })
      router.push("/login?registered=1")
    } catch (error) {
      setFormErrors(
        getFormErrors(error, setError, [
          "firstName",
          "lastName",
          "email",
          "password",
          "confirmPassword",
        ] as const)
      )
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
          {t("registerTitle")}
        </h1>
        <p className="text-sm text-balance text-foreground">
          {t("registerSubtitle")}
        </p>
      </div>

      <ValidationErrorList errors={formErrors} />

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="register-first-name">{t("firstNameLabel")}</Label>
            <Input
              id="register-first-name"
              autoComplete="given-name"
              aria-invalid={Boolean(errors.firstName)}
              {...register("firstName")}
            />
            {errors.firstName ? (
              <p role="alert" className="text-xs text-destructive">
                {messageFor(errors.firstName.message)}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="register-last-name">{t("lastNameLabel")}</Label>
            <Input
              id="register-last-name"
              autoComplete="family-name"
              aria-invalid={Boolean(errors.lastName)}
              {...register("lastName")}
            />
            {errors.lastName ? (
              <p role="alert" className="text-xs text-destructive">
                {messageFor(errors.lastName.message)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="register-email">{t("emailLabel")}</Label>
          <Input
            id="register-email"
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

        <div className="grid gap-2">
          <Label htmlFor="register-password">{t("passwordLabel")}</Label>
          <PasswordInput
            id="register-password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            toggleLabel={{ show: t("showPassword"), hide: t("hidePassword") }}
            {...register("password")}
          />
          {errors.password ? (
            <p role="alert" className="text-xs text-destructive">
              {messageFor(errors.password.message)}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="register-confirm-password">
            {t("confirmPasswordLabel")}
          </Label>
          <PasswordInput
            id="register-confirm-password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            toggleLabel={{ show: t("showPassword"), hide: t("hidePassword") }}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p role="alert" className="text-xs text-destructive">
              {messageFor(errors.confirmPassword.message)}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? t("registering") : t("createAccount")}
        </Button>
      </div>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-foreground">
          {t("orContinueWith")}
        </span>
      </div>

      <GoogleAuthButton />

      <p className="text-center text-sm text-foreground">
        {t("haveAccount")}{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("logIn")}
        </Link>
      </p>
    </form>
  )
}
