import Image from "next/image"
import { SiteHeader } from "@/components/discover/site-header"
import { SiteFooter } from "@/components/discover/site-footer"
import { EventList } from "@/components/discover/event-list"
import { EventTimeline } from "@/components/discover/event-timeline"
import { MapPinned, CalendarX } from "lucide-react"
import { getEventsByCity, toListGroups, toCardGroups } from "@/lib/events"
import { ICalSubscribeButton } from "@/components/ical-subscribe-button"
import type { City } from "@/lib/cities"

export function CityPage({ city }: { city: City }) {
  const events = getEventsByCity(city.name)
  const importantGroups = toListGroups(events.filter((e) => e.important))
  const restGroups = toCardGroups(events.filter((e) => !e.important))

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
        <div className="mx-auto grid grid-cols-[1fr_300px] gap-8 items-start max-w-[1040px]">

          {/* Events */}
          <div>
            {events.length === 0 && (
              <>
                <h2 className="mb-6 text-[32px] font-bold text-foreground">Wydarzenia</h2>
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-black/10 px-6 py-16 text-center">
                  <CalendarX className="size-8 text-muted-foreground" />
                  <p className="font-semibold text-foreground">Wkrótce</p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Nie mamy jeszcze wydarzeń w {city.name}. Subskrybuj kalendarz, aby otrzymać powiadomienie, gdy się pojawią.
                  </p>
                </div>
              </>
            )}

            {importantGroups.length > 0 && (
              <section className="mb-10">
                <h2 className="mb-4 text-[32px] font-bold text-foreground">Najważniejsze wydarzenia</h2>
                <EventList groups={importantGroups} />
              </section>
            )}

            {restGroups.length > 0 && (
              <section>
                <h2 className="mb-2 text-[32px] font-bold text-foreground">Wydarzenia</h2>
                <EventTimeline groups={restGroups} />
              </section>
            )}
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
