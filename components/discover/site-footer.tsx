import { Asterisk, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"

type SiteFooterProps = {
  lang?: "pl" | "en"
}

const DEVELOPER_URL = "https://www.linkedin.com/in/anton-kravchenko-303bbb3b2/"

const copy = {
  pl: { report: "Zgłoś", contact: "Skontaktuj się ze mną" },
  en: { report: "Report", contact: "Contact me" },
}

export function SiteFooter({ lang = "pl" }: SiteFooterProps) {
  const t = copy[lang]
  return (
    <footer className="mt-20 bg-[#141413]">
      <div className="mx-auto flex min-h-20 max-w-[1400px] flex-wrap items-center justify-between gap-4 px-10 py-6">
        <div className="flex items-center gap-[22px]">
          <Asterisk className="size-[18px] text-[#faf9f5]" strokeWidth={2.5} />
        </div>

        <div className="flex items-center gap-3.5 text-[#faf9f5]/60">
          <a
            href={DEVELOPER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-100"
          >
            <Flag className="size-4" />
            {t.report}
          </a>
          <Button
            asChild
            variant="ghost"
            className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-[#faf9f5] hover:bg-white/10 hover:text-[#faf9f5]"
          >
            <a href={DEVELOPER_URL} target="_blank" rel="noopener noreferrer">
              {t.contact}
            </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}
