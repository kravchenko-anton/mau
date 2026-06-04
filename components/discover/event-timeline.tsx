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

          <div className="relative sm:ml-[3px] sm:border-l sm:border-black/10">
            {group.events.map((ev) => (
              <div key={ev.id} className="relative pb-4 sm:pl-6">
                <div className="absolute -left-[5px] top-10 hidden size-2.5 rounded-full bg-foreground/20 outline outline-4 outline-background sm:block" />

                <Link
                  href={ev.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-0 flex-col gap-3 rounded-2xl border border-black/10 bg-card p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-card-hover hover:shadow-md sm:gap-4 sm:rounded-[28px] sm:p-4 md:min-h-[210px] md:flex-row md:items-stretch"
                >
                  <div className="flex min-w-0 flex-1 flex-col justify-center px-1 py-1 md:px-2">
                    <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-background/70 px-3 py-1 font-mono text-[12px] text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        {ev.dateRange}
                      </span>
                      {ev.type && (
                        <span className="rounded-full bg-foreground/5 px-3 py-1 font-mono text-[12px] text-muted-foreground">
                          {ev.type}
                        </span>
                      )}
                    </div>

                    <div className="mb-3 flex items-start justify-between gap-3 sm:mb-4 sm:gap-4">
                      <div className="text-lg font-semibold leading-tight text-foreground sm:text-[21px] md:text-[23px]">{ev.name}</div>
                      <ArrowUpRight className="mt-1 hidden size-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:block" />
                    </div>

                    <div className="flex items-start gap-2 text-[14px] leading-snug text-muted-foreground">
                      <MapPin className="mt-0.5 size-4 shrink-0" />
                      <div className="min-w-0">
                        <div className="line-clamp-2 font-medium text-foreground/75 sm:truncate">{ev.place || ev.venue}</div>
                        {ev.address && (
                          <div className="mt-0.5 line-clamp-2">{ev.address}</div>
                        )}
                        {!ev.address && ev.city && (
                          <div className="mt-0.5">{ev.city}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {ev.imageUrl && (
                    <div className="order-first flex h-[180px] w-full shrink-0 items-center justify-center rounded-2xl border border-black/8 bg-[#f4f1e8] p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)] sm:h-[200px] sm:rounded-3xl sm:p-3 md:order-none md:h-auto md:w-[230px] lg:w-[250px]">
                      <div className="relative h-full w-full overflow-hidden rounded-xl bg-white/45 sm:rounded-2xl">
                        <Image
                          src={ev.imageUrl}
                          alt={ev.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 250px"
                          className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
                          unoptimized
                        />
                      </div>
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
