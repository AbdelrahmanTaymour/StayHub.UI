import { ChevronRight } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from "@/i18n/navigation"
import { Fragment } from "react/jsx-runtime"

export interface BreadcrumbEntry {
  label: string
  href?: string
}

interface PageBreadcrumbProps {
  items: BreadcrumbEntry[]
}

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            // Fragment, not BreadcrumbItem, wraps the pair — separator and
            // item are siblings (both <li>), never nested inside each other.
            <Fragment key={item.label}>
              {index > 0 ? (
                <BreadcrumbSeparator>
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 rtl:rotate-180"
                  />
                </BreadcrumbSeparator>
              ) : null}

              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="max-w-50 truncate sm:max-w-xs">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={<Link href={item.href}>{item.label}</Link>}
                  />
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
