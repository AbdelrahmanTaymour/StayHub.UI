import { ApiTestProbe } from "@/components/common/api-test-probe"
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher"
import { ThemeToggle } from "@/components/common/ThemeToggle"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="flex gap-4">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      <ApiTestProbe />
    </div>
  )
}
