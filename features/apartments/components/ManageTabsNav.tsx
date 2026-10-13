"use client"

import {
  BedDouble,
  CalendarDays,
  ClipboardList,
  FileText,
  Images,
  ListChecks,
  MessageSquareText,
  Users,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "cn"

const TABS = [
  { segment: "details", icon: FileText },
  { segment: "images", icon: Images },
  { segment: "amenities", icon: ListChecks },
  { segment: "availability", icon: CalendarDays },
  { segment: "staff", icon: Users },
  { segment: "bookings", icon: BedDouble },
  { segment: "reviews", icon: MessageSquareText },
  { segment: "maintenance", icon: ClipboardList },
] as const

export function ManageTabsNav({ apartmentId }: { apartmentId: string }) {
  const t = useTranslations("apartmentManage.tabs")
  const pathname = usePathname()

  return (
    <nav aria-label={t("navLabel")} className="lg:w-56 lg:shrink-0">
      <div
        role="tablist"
        aria-orientation="vertical"
        className="flex gap-1 overflow-x-auto rounded-xl bg-muted p-1.5 lg:flex-col lg:overflow-visible"
      >
        {TABS.map(({ segment, icon: Icon }) => {
          const href = `/me/apartments/${apartmentId}/manage/${segment}`
          const isActive = pathname === href

          return (
            <Link
              key={segment}
              href={href}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors lg:shrink",
                isActive
                  ? "bg-card text-tertiary shadow-sm"
                  : "text-foreground hover:text-tertiary"
              )}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              {t(segment)}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
