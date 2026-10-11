export interface MessageLike {
  id?: string
  senderId?: string
  body?: string | null
  sentOnUtc?: string
  readOnUtc?: string | null
}

export interface DayGroup<T extends MessageLike> {
  dateKey: string
  date: Date
  messages: T[]
}

/** Expects messages already sorted oldest → newest. */
export function groupByDay<T extends MessageLike>(
  messages: T[]
): DayGroup<T>[] {
  const groups: DayGroup<T>[] = []

  for (const message of messages) {
    const date = message.sentOnUtc ? new Date(message.sentOnUtc) : new Date()
    const dateKey = date.toDateString()
    const last = groups.at(-1)

    if (last && last.dateKey === dateKey) {
      last.messages.push(message)
    } else {
      groups.push({ dateKey, date, messages: [message] })
    }
  }

  return groups
}
