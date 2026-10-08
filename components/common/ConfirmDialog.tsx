"use client"

import { AlertTriangle } from "lucide-react"
import type { ReactElement, ReactNode } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

interface ConfirmDialogProps {
  trigger: ReactElement
  title: string
  description?: string
  notice?: ReactNode
  confirmLabel: string
  pendingLabel: string
  cancelLabel: string
  onConfirm: () => void
  isConfirming?: boolean
  isDestructive?: boolean
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  notice,
  confirmLabel,
  pendingLabel,
  cancelLabel,
  onConfirm,
  isConfirming = false,
  isDestructive = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent className="gap-5">
        <AlertDialogHeader className="flex-row items-start gap-3 space-y-0">
          <span
            aria-hidden="true"
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              isDestructive
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-tertiary"
            )}
          >
            <AlertTriangle className="size-5" />
          </span>
          <div className="flex flex-col gap-1 pt-1">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {description ? (
              <AlertDialogDescription className="text-sm font-normal text-foreground/70">
                {description}
              </AlertDialogDescription>
            ) : null}
          </div>
        </AlertDialogHeader>

        {notice}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isConfirming}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isConfirming}
            onClick={(event) => {
              event.preventDefault()
              onConfirm()
            }}
            className={cn(
              isDestructive && buttonVariants({ variant: "destructive" })
            )}
          >
            {isConfirming ? pendingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
