"use client"

import { type AnchorHTMLAttributes, type ReactNode, useState, useSyncExternalStore } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { CalendarPlus, Check, Copy, Download, ExternalLink } from "lucide-react"

type Props = {
  name: string
  type: "city" | "category"
  slug: string
  className?: string
  fullWidth?: boolean
}

const FALLBACK_ORIGIN = "https://mau.app"

export function ICalSubscribeButton({ name, type, slug, className, fullWidth }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const origin = useSyncExternalStore(
    subscribeOrigin,
    getOriginSnapshot,
    getServerOriginSnapshot
  )

  const icalUrl = `${origin}/api/ical/${type}/${slug}`
  const downloadUrl = `${icalUrl}?download=1`
  const webcalUrl = icalUrl.replace(/^https?:\/\//, "webcal://")
  const googleUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`
  const outlookUrl = `https://outlook.office.com/calendar/0/addfromweb?url=${encodeURIComponent(
    icalUrl
  )}&name=${encodeURIComponent(name)}`

  const handleCopy = async () => {
    try {
      await copyToClipboard(icalUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={`${fullWidth ? "w-full" : "w-fit"} ${className ?? ""}`}
      >
        <CalendarPlus className="size-4" />
        Subskrybuj
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-md gap-0 overflow-y-auto p-0">
          <div className="px-4 pb-5 pt-6 sm:px-6">
            <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-foreground">
              <CalendarPlus className="size-5 text-background" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-lg">Dodaj subskrypcję kalendarza</DialogTitle>
              <DialogDescription className="mt-1 text-sm leading-relaxed">
                Aktualny kanał iCal dla <span className="font-medium text-foreground">{name}</span>.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="grid gap-2 bg-card px-4 py-4 sm:px-6">
            <CalendarAction
              href={webcalUrl}
              icon={<AppleIcon />}
              title="Apple Calendar"
              subtitle="subskrypcja webcal"
              className="bg-neutral-950 text-white hover:bg-neutral-800"
            />
            <CalendarAction
              href={outlookUrl}
              icon={<OutlookIcon />}
              title="Outlook"
              subtitle="dodaj z internetu"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0f6cbd] text-white hover:bg-[#0b5cab]"
              external
            />
            <CalendarAction
              href={googleUrl}
              icon={<GoogleIcon />}
              title="Google Calendar"
              subtitle="dodaj przez URL"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#2f72cc] text-white hover:bg-[#2864b4]"
              external
            />
            <CalendarAction
              href={downloadUrl}
              icon={<Download className="size-4" />}
              title="Pobierz .ics"
              subtitle="import pojedynczego pliku"
              download={`${slug}.ics`}
              className="border border-black/10 bg-background text-foreground hover:bg-card-hover"
            />
          </div>

          <div className="border-t border-black/10 px-4 py-4 sm:px-6">
            <button
              onClick={handleCopy}
              className="flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check className="size-3.5" />
                  Skopiowano
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Kopiuj URL subskrypcji
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function subscribeOrigin(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {}

  window.addEventListener("hashchange", onStoreChange)
  window.addEventListener("popstate", onStoreChange)

  return () => {
    window.removeEventListener("hashchange", onStoreChange)
    window.removeEventListener("popstate", onStoreChange)
  }
}

function getOriginSnapshot(): string {
  return typeof window === "undefined" ? FALLBACK_ORIGIN : window.location.origin
}

function getServerOriginSnapshot(): string {
  return FALLBACK_ORIGIN
}

type CalendarActionProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  external?: boolean
  icon: ReactNode
  subtitle: string
  title: string
}

function CalendarAction({
  className,
  external,
  icon,
  subtitle,
  title,
  ...props
}: CalendarActionProps) {
  return (
    <a
      className={`flex min-h-14 items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-colors ${className ?? ""}`}
      {...props}
    >
      <span className="flex size-7 shrink-0 items-center justify-center">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-tight">{title}</span>
        <span className="block text-xs leading-tight opacity-75">{subtitle}</span>
      </span>
      {external && <ExternalLink className="size-3.5 shrink-0 opacity-70" />}
    </a>
  )
}

async function copyToClipboard(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement("textarea")
  textarea.value = value
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.left = "-9999px"
  document.body.appendChild(textarea)
  textarea.select()

  try {
    if (!document.execCommand("copy")) {
      throw new Error("Copy command failed")
    }
  } finally {
    document.body.removeChild(textarea)
  }
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function OutlookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M2.5 5.5 12.8 3v18L2.5 18.5v-13Z" />
      <path d="M13.8 6h6.9c.44 0 .8.36.8.8v10.4c0 .44-.36.8-.8.8h-6.9v-2.6h5.1V14h-5.1v-2h5.1v-1.4h-5.1V9.2h5.1V7.8h-5.1V6Z" />
      <path
        d="M5.2 12c0-2.1 1.18-3.55 2.86-3.55S10.9 9.9 10.9 12s-1.16 3.55-2.84 3.55S5.2 14.1 5.2 12Zm1.55 0c0 1.24.5 2.04 1.31 2.04s1.29-.8 1.29-2.04-.5-2.04-1.29-2.04S6.75 10.76 6.75 12Z"
        fill="#0f6cbd"
      />
    </svg>
  )
}
