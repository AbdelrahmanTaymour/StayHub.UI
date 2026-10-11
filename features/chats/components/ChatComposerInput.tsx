"use client"

import { Paperclip, Send } from "lucide-react"
import { useTranslations } from "next-intl"
import { useId, useState, type FormEvent, type KeyboardEvent } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatComposerInputProps {
  onSend: (body: string) => void
  isSending: boolean
  placeholder?: string
}

export function ChatComposerInput({
  onSend,
  isSending,
  placeholder,
}: ChatComposerInputProps) {
  const t = useTranslations("chats")
  const [value, setValue] = useState("")
  const textareaId = useId()

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || isSending) return
    onSend(trimmed)
    setValue("")
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    submit()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="shrink-0 p-4 pt-2">
      <div className="rounded-xl bg-muted p-2 shadow-sm transition-all focus-within:bg-card focus-within:ring-2 focus-within:ring-ring">
        <Textarea
          id={textareaId}
          name="message"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? t("composerPlaceholder")}
          rows={1}
          aria-label={t("composerLabel")}
          autoComplete="off"
          className="max-h-32 min-h-10 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-foreground">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled
              aria-label={t("attachFile")}
              className="size-8"
            >
              <Paperclip aria-hidden="true" className="size-4" />
            </Button>
            <span className="hidden text-[11px] text-foreground/70 sm:inline">
              {t("sendHint")}
            </span>
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!value.trim() || isSending}
            className="gap-1.5"
          >
            {t("send")}
            <Send aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          </Button>
        </div>
      </div>
    </form>
  )
}
