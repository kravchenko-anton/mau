import type { CSSProperties, ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"

export type EventItem = {
  id?: string
  name: string
  meta: string
  location: string
  date: string
  icon: ReactNode
  url?: string
}

export type MonthGroup = {
  month: string
  barColor: string
  events: EventItem[]
}

export function EventIconBox({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold tracking-wide"
      style={style}
    >
      {children}
    </div>
  )
}

export function EventList({ groups }: { groups: MonthGroup[] }) {
  return (
    <Card className="gap-0 rounded-[14px] bg-card p-0 px-1 py-1.5 shadow-sm ring-0 sm:px-2">
      <div className="divide-y divide-transparent">
        {groups.map((group) => (
          <div key={group.month} className="px-2 py-1">
            <div className="flex items-center gap-2.5 px-3 pb-1.5 pt-3">
              <span className="h-0.5 w-[18px] rounded-sm" style={{ background: group.barColor }} />
              <span className="font-mono text-[13px] tracking-[0.04em] text-muted-foreground">{group.month}</span>
            </div>

            <ul>
              {group.events.map((event) => (
                <li key={event.id ?? `${event.name}-${event.date}-${event.location}`}>
                  <a
                    href={event.url ?? "#"}
                    {...(event.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg p-3 transition-colors hover:bg-card-hover md:grid-cols-[auto_minmax(0,2fr)_minmax(0,1.3fr)_auto_auto] md:gap-4"
                  >
                    {event.icon}

                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[15px] font-medium leading-tight text-foreground md:truncate">{event.name}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-2 md:truncate">{event.meta}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground md:hidden">{event.location}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground md:hidden">{event.date}</p>
                    </div>

                    <span className="hidden truncate text-right text-[13px] text-muted-foreground md:block">
                      {event.location}
                    </span>

                    <span className="hidden whitespace-nowrap text-right font-mono text-[13px] text-muted-foreground md:block">
                      {event.date}
                    </span>

                    <ArrowRight className="size-4 text-muted-2 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  )
}
