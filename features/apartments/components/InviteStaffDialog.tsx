"use client"

import { Info, Send } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useInviteStaff } from "../hooks/useInviteStaff"

interface InviteStaffDialogProps {
  apartmentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultEmail?: string
}

export function InviteStaffDialog({
  apartmentId,
  open,
  onOpenChange,
  defaultEmail,
}: InviteStaffDialogProps) {
  const t = useTranslations("apartmentManage.staff")
  const [email, setEmail] = useState(defaultEmail ?? "")
  const [note, setNote] = useState("")
  const [previousOpen, setPreviousOpen] = useState(open)
  const [previousDefaultEmail, setPreviousDefaultEmail] = useState(defaultEmail)
  const invite = useInviteStaff(apartmentId)

  // Re-sync whenever the dialog opens, so re-opening it from a different
  // search result doesn't carry over the previous one's email.
  if (
    open !== previousOpen ||
    (open && defaultEmail !== previousDefaultEmail)
  ) {
    setPreviousOpen(open)
    setPreviousDefaultEmail(defaultEmail)
    if (open) setEmail(defaultEmail ?? "")
  }

  function handleSend() {
    const trimmed = email.trim()
    if (!trimmed) return
    invite.mutate(
      { email: trimmed, body: note.trim() || undefined },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("inviteModalTitle")}</DialogTitle>
          <DialogDescription>{t("inviteModalDescription")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-email">{t("inviteEmailLabel")}</Label>
            <Input
              id="invite-email"
              type="email"
              inputMode="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-note">{t("inviteNoteLabel")}</Label>
            <Textarea
              id="invite-note"
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t("inviteNotePlaceholder")}
              className="resize-none"
            />
          </div>

          <p className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm text-foreground/70">
            <Info aria-hidden="true" className="size-4 shrink-0 text-primary" />
            {t("inviteExpiryNotice")}
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("cancelButton")}
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={invite.isPending || !email.trim()}
            className="gap-1.5"
          >
            <Send aria-hidden="true" className="size-4" />
            {t("sendInviteButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
