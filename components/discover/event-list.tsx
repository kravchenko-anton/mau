import type { CSSProperties, ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"

export type EventItem = {
  name: string
  meta: string
  location: string
  date: string
  icon: ReactNode
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
    <Card className="gap-0 rounded-[14px] bg-card p-0 px-2 py-1.5 shadow-sm ring-0">
      <div className="divide-y divide-transparent">
        {groups.map((group) => (
          <div key={group.month} className="px-2 py-1">
            <div className="flex items-center gap-2.5 px-3 pb-1.5 pt-3">
              <span className="h-0.5 w-[18px] rounded-sm" style={{ background: group.barColor }} />
              <span className="font-mono text-[13px] tracking-[0.04em] text-muted-foreground">{group.month}</span>
            </div>

            <ul>
              {group.events.map((event) => (
                <li key={event.name}>
                  <a
                    href="#"
                    className="group grid grid-cols-[auto_1fr] items-center gap-4 rounded-lg p-3 transition-colors hover:bg-card-hover md:grid-cols-[auto_minmax(0,2fr)_minmax(0,1.3fr)_auto_auto]"
                  >
                    {event.icon}

                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-medium text-foreground">{event.name}</p>
                      <p className="truncate text-xs text-muted-2">{event.meta}</p>
                    </div>

                    <span className="hidden truncate text-right text-[13px] text-muted-foreground md:block">
                      {event.location}
                    </span>

                    <span className="hidden whitespace-nowrap text-right font-mono text-[13px] text-muted-foreground md:block">
                      {event.date}
                    </span>

                    <ArrowRight className="hidden size-4 text-muted-2 transition-transform group-hover:translate-x-0.5 md:block" />
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
