"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "cn"

interface PasswordInputProps extends Omit<
  React.ComponentProps<"input">,
  "type"
> {
  toggleLabel?: { show: string; hide: string }
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(function PasswordInput({ className, toggleLabel, ...props }, ref) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn("pe-10", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        tabIndex={-1}
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 inset-e-1 my-auto text-muted-foreground"
        aria-label={
          visible
            ? (toggleLabel?.hide ?? "Hide password")
            : (toggleLabel?.show ?? "Show password")
        }
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  )
})
