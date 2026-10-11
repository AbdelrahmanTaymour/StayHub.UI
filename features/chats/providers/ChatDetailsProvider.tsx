"use client"

import { createContext, useContext, useMemo, useState } from "react"

import { usePathname } from "@/i18n/navigation"

interface ChatDetailsState {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const ChatDetailsContext = createContext<ChatDetailsState | null>(null)

export function ChatDetailsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const [renderedForPathname, setRenderedForPathname] = useState(pathname)
  if (pathname !== renderedForPathname) {
    setRenderedForPathname(pathname)
    setIsOpen(false)
  }

  const value = useMemo<ChatDetailsState>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
    }),
    [isOpen]
  )

  return (
    <ChatDetailsContext.Provider value={value}>
      {children}
    </ChatDetailsContext.Provider>
  )
}

export function useChatDetails() {
  const ctx = useContext(ChatDetailsContext)
  if (!ctx)
    throw new Error("useChatDetails must be used within ChatDetailsProvider")
  return ctx
}
