import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { getMyConversationsServer } from "@/features/chats/api/conversations.server"
import { getQueryClient } from "@/lib/query/get-query-client"
import { queryKeys } from "@/lib/query/query-keys"
import { ChatsShell } from "@/features/chats/components/ChatsShell"
import { ChatDetailsProvider } from "@/features/chats/providers/ChatDetailsProvider"
import { ChatRealtimeProvider } from "@/features/chats/realtime/RealtimeProvider"

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()
  await queryClient.query({
    queryKey: queryKeys.chats.conversations(),
    queryFn: getMyConversationsServer,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatRealtimeProvider>
        <ChatDetailsProvider>
          <ChatsShell>{children}</ChatsShell>
        </ChatDetailsProvider>
      </ChatRealtimeProvider>
    </HydrationBoundary>
  )
}
