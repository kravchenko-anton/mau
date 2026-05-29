import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/discover/site-header"
import { SiteFooter } from "@/components/discover/site-footer"
import { MapPinned, MapPin, CalendarDays, ArrowUpRight } from "lucide-react"
import { getCityEventGroups } from "@/lib/events"
import { ICalSubscribeButton } from "@/components/ical-subscribe-button"
import type { City } from "@/lib/cities"

export function CityPage({ city }: { city: City }) {
  const groups = getCityEventGroups()

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-10 pb-24">

        {/* Hero */}
        <section className="pt-[112px] pb-12">
          <div className="grid grid-cols-[1fr_340px] gap-10 items-start">

            {/* Info panel */}
            <div className="flex flex-col gap-6 pt-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
                  <MapPinned className="size-3.5" />
                  Co się dzieje w
                </div>
                <h1 className="text-[64px] leading-none font-bold text-foreground">{city.name}</h1>
                <div className="font-mono text-sm text-muted-foreground">
                  {city.eventCount !== null ? `${city.eventCount} wydarzeń` : "Wkrótce"}
                </div>
              </div>
              <p className="max-w-lg leading-relaxed text-muted-foreground">{city.description}</p>
              <ICalSubscribeButton name={city.name} type="city" slug={city.slug} />
            </div>

            {/* City visual card */}
            <div
              className="relative overflow-hidden rounded-3xl border border-black/10 aspect-[4/5]"
              style={{
                backgroundColor: "#f0eee6",
                backgroundImage: "radial-gradient(circle, #c8c5bc 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            >
              <Image
                src={city.image}
                alt={city.name}
                fill
                priority
                className="object-contain object-bottom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                {city.eventCount !== null && (
                  <p className="font-mono text-xs text-white/60 mb-1">{city.eventCount} wydarzeń</p>
                )}
                <p className="text-xl font-bold text-white">{city.name}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Events + Sidebar */}
        <div className="grid grid-cols-[1fr_300px] gap-8 items-start">

          {/* Events */}
          <div>
            <h2 className="mb-6 text-[32px] font-bold text-foreground">Wydarzenia</h2>

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
                        className="group flex items-stretch gap-3 rounded-2xl border border-black/8 bg-card px-5 py-4 transition-colors hover:bg-card-hover"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 font-mono text-[12px] text-muted-foreground mb-1.5">
                            <CalendarDays className="size-3" />
                            {ev.dateRange}
                          </div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="text-[15px] font-semibold text-foreground">{ev.name}</div>
                            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 mt-0.5" />
                          </div>
                          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                            <MapPin className="size-3.5 shrink-0" /> {ev.venue}
                          </div>
                        </div>

                        {ev.imageUrl && (
                          <div className="relative size-[72px] shrink-0 overflow-hidden rounded-xl border border-black/8">
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
          </div>

          {/* Sidebar */}
          <aside className="sticky top-6 pt-[88px]">
            <div className="flex flex-col gap-3 rounded-2xl bg-card p-5">
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <MapPinned className="size-3.5" />
                {city.name}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Odkryj najpopularniejsze wydarzenia i bądź powiadamiany przed wyprzedaniem.
              </p>
              <ICalSubscribeButton name={city.name} type="city" slug={city.slug} fullWidth />
            </div>
          </aside>
        </div>

      </main>
      <SiteFooter lang="pl" />
    </>
  )
}
