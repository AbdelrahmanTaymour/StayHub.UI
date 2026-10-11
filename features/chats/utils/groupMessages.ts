import { ConversationMessagesResponse } from "@/lib/api/types/conversations"

export interface MessageGroupItem {
  message: ConversationMessagesResponse
  /** First message in a run of consecutive same-sender messages — shows avatar/name. */
  isGroupStart: boolean
  /** Last message in a run — shows the timestamp and (if own) delivery status. */
  isGroupEnd: boolean
}

export interface MessageDaySection {
  dateKey: string
  items: MessageGroupItem[]
}

/**
 * Groups messages by calendar day (for date-separator chips) and, within each
 * day, by consecutive runs from the same sender (for WhatsApp-style avatar
 * and timestamp collapsing), matching the mockup's grouping behavior.
 */
export function groupMessagesByDayAndSender(
  messages: ConversationMessagesResponse[]
): MessageDaySection[] {
  const sections: MessageDaySection[] = []

  messages.forEach((message, index) => {
    const dateKey = (message.sentOnUtc ?? "").slice(0, 10)
    const previous = messages[index - 1]
    const previousDateKey = previous
      ? (previous.sentOnUtc ?? "").slice(0, 10)
      : null

    if (dateKey !== previousDateKey) {
      sections.push({ dateKey, items: [] })
    }

    const currentSection = sections[sections.length - 1]
    const isNewSenderRun =
      !previous ||
      previous.senderId !== message.senderId ||
      dateKey !== previousDateKey

    if (isNewSenderRun) {
      currentSection.items.push({
        message,
        isGroupStart: true,
        isGroupEnd: true,
      })
    } else {
      const lastItem = currentSection.items[currentSection.items.length - 1]
      lastItem.isGroupEnd = false
      currentSection.items.push({
        message,
        isGroupStart: false,
        isGroupEnd: true,
      })
    }
  })

  return sections
}

export function isSameUtcDay(dateKey: string, referenceDate: Date): boolean {
  const reference = referenceDate.toISOString().slice(0, 10)
  return dateKey === reference
}
