"use client"

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
  /** For a shadcn Alert between the description and the actions (e.g. a refund notice). */
  notice?: ReactNode
  confirmLabel: string
  pendingLabel: string
  cancelLabel: string
  onConfirm: () => void
  isConfirming?: boolean
  isDestructive?: boolean
}

/**
 * Generic confirm/cancel dialog for consequential actions (cancel booking,
 * reject booking, deactivate apartment, revoke staff, refund). The caller
 * owns the mutation; this component only owns the prompt.
 */
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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        {notice ? <div className="px-6">{notice}</div> : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isConfirming}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isConfirming}
            onClick={(event) => {
              // Keep the dialog open until the mutation settles, so a failure stays visible.
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
