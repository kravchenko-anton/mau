import Image from "next/image"
import Link from "next/link"
import { MapPin, CalendarDays, ArrowUpRight } from "lucide-react"
import type { EventCardGroup } from "@/lib/events"

// Month-grouped vertical timeline of rich event cards. Shared by the city and
// category pages so both render events identically.
export function EventTimeline({ groups }: { groups: EventCardGroup[] }) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.month}>
          <div className="my-5 flex items-center gap-2.5">
            <div className="size-[7px] rounded-full bg-foreground" />
            <span className="font-mono text-sm font-semibold text-foreground">{group.month}</span>
          </div>

          <div className="relative ml-[3px] border-l border-black/10">
            {group.events.map((ev) => (
              <div key={ev.name} className="relative pb-2 pl-6">
                <div className="absolute -left-[4px] top-[7px] size-[7px] rounded-full bg-black/20 outline outline-3 outline-background" />

                <Link
                  href={ev.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-stretch gap-4 rounded-2xl border border-black/8 bg-card p-3 transition-colors hover:bg-card-hover"
                >
                  <div className="flex flex-1 flex-col justify-center min-w-0 py-2 pl-2">
                    <div className="flex items-center gap-1.5 font-mono text-[12px] text-muted-foreground mb-2">
                      <CalendarDays className="size-3" />
                      {ev.dateRange}
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="text-[17px] font-semibold leading-snug text-foreground">{ev.name}</div>
                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 mt-1" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" /> {ev.venue}
                    </div>
                  </div>

                  {ev.imageUrl && (
                    <div className="relative size-[150px] shrink-0 self-center overflow-hidden rounded-xl border border-black/8">
                      <Image
                        src={ev.imageUrl}
                        alt={ev.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
