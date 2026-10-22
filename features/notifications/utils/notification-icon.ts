import {
  BadgeCheck,
  CalendarX,
  MessageSquareText,
  ShieldX,
  Star,
  UserPlus,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import type { NotificationType } from "@/lib/api/types/notifications"

export const NOTIFICATION_ICONS: Record<NotificationType, LucideIcon> = {
  BookingConfirmed: BadgeCheck,
  BookingRejected: ShieldX,
  BookingCancelled: CalendarX,
  NewMessage: MessageSquareText,
  ReviewReceived: Star,
  ReviewResponseReceived: Star,
  MaintenanceRequestCreated: Wrench,
  MaintenanceRequestUpdate: Wrench,
  ApartmentStaffAssignmentCreated: UserPlus,
}
