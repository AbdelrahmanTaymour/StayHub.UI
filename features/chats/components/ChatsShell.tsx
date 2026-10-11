"use client"

import { ConversationsSidebar } from "./ConversationsSidebar"
import { useIsDesktopChatLayout } from "../hooks/useIsDesktopChatLayout"
import { useActiveMobilePanel } from "../hooks/useMobilePanel"

const SIDEBAR_WIDTH = "w-[380px]"

export function ChatsShell({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktopChatLayout()
  const mobilePanel = useActiveMobilePanel()

  if (isDesktop === null) {
    return <div className="h-[calc(100dvh-4rem)]" />
  }

  if (isDesktop) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] min-h-0 w-full overflow-hidden">
        <div
          className={`h-full min-h-0 shrink-0 overflow-hidden border-e border-border ${SIDEBAR_WIDTH}`}
        >
          <ConversationsSidebar />
        </div>
        <div className="h-full min-h-0 min-w-0 flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col overflow-hidden">
      {mobilePanel === "list" ? <ConversationsSidebar /> : children}
    </div>
  )
}
