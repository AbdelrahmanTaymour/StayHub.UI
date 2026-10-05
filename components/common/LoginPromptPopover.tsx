"use client"

import type { ReactElement } from "react"
import { useTranslations } from "next-intl"

import { buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Link } from "@/i18n/navigation"
import { cn } from "cn"

interface LoginPromptPopoverProps {
  message: string
  /** A single interactive element, such as a Button, that opens the prompt. */
  children: ReactElement
}

/**
 * Used for actions that need a session. Anonymous users see this prompt instead of the action.
 */
export function LoginPromptPopover({
  message,
  children,
}: LoginPromptPopoverProps) {
  const t = useTranslations("auth")

  return (
    <Popover>
      <PopoverTrigger render={children} />
      <PopoverContent align="center" className="w-64 p-4">
        <p className="text-sm text-foreground">{message}</p>
        <Link
          href="/login"
          className={cn(buttonVariants({ size: "sm" }), "mt-3 w-full")}
        >
          {t("logIn")}
        </Link>
      </PopoverContent>
    </Popover>
  )
}
