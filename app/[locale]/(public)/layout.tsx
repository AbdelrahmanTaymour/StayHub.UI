import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // return (
  //   <>
  //     <SiteHeader />
  //     <main className="flex-1">
  //       <div className="flex w-full flex-col">{children}</div>
  //     </main>
  //     <SiteFooter />
  //   </>
  // )
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-background pt-16">
        <div className="flex w-full flex-col">{children}</div>
      </main>
      <SiteFooter />
    </div>
  )
}
