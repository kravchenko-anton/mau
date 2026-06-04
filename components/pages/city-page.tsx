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
      <main className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6 sm:pb-24 lg:px-10">

        {/* Hero */}
        <section className="pb-8 pt-16 sm:pt-24 lg:pb-12 lg:pt-[112px]">
          <div className="grid gap-7 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-10">

            {/* Info panel */}
            <div className="flex flex-col gap-5 pt-2 sm:gap-6 lg:pt-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
                  <MapPinned className="size-3.5" />
                  Co się dzieje w
                </div>
                <h1 className="text-[42px] leading-none font-bold text-foreground sm:text-[56px] lg:text-[64px]">{city.name}</h1>
                <div className="font-mono text-sm text-muted-foreground">
                  {city.eventCount !== null ? `${city.eventCount} wydarzeń` : "Wkrótce"}
                </div>
              </div>
              <p className="max-w-2xl leading-relaxed text-muted-foreground lg:max-w-lg">{city.description}</p>
              <ICalSubscribeButton name={city.name} type="city" slug={city.slug} />
            </div>

            {/* City visual card */}
            <div
              className="relative aspect-[16/10] max-w-md overflow-hidden rounded-3xl border border-black/10 sm:aspect-[4/3] lg:aspect-[4/5] lg:max-w-none"
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
                sizes="(max-width: 1024px) 100vw, 340px"
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
        <div className="mx-auto grid max-w-[1040px] gap-8 lg:grid-cols-[1fr_300px] lg:items-start">

          {/* Events */}
          <div>
            {events.length === 0 && (
              <>
                <h2 className="mb-6 text-2xl font-bold text-foreground sm:text-[32px]">Wydarzenia</h2>
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
                <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-[32px]">Najważniejsze wydarzenia</h2>
                <EventList groups={importantGroups} />
              </section>
            )}

            {restGroups.length > 0 && (
              <section>
                <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-[32px]">Wydarzenia</h2>
                <EventTimeline groups={restGroups} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="pt-0 lg:sticky lg:top-6 lg:pt-[88px]">
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
