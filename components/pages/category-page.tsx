import { SiteHeader } from "@/components/discover/site-header"
import { SiteFooter } from "@/components/discover/site-footer"
import { EventList } from "@/components/discover/event-list"
import { EventTimeline } from "@/components/discover/event-timeline"
import { getEventsByCategory, toListGroups, toCardGroups } from "@/lib/events"
import { ICalSubscribeButton } from "@/components/ical-subscribe-button"
import type { Category } from "@/lib/categories"

export function CategoryPage({ category }: { category: Category }) {
  const { icon: Icon, color } = category
  const events = getEventsByCategory(category.key)
  const importantGroups = toListGroups(events.filter((e) => e.important))
  const restGroups = toCardGroups(events.filter((e) => !e.important))

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <section className="pb-8 pt-16 sm:pt-24 lg:pb-12 lg:pt-[112px]">
          <div className="grid gap-7 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-10">
            {/* category info */}
            <div className="flex flex-col gap-5 pt-2 sm:gap-6 lg:pt-4">
              <div className="flex flex-col gap-3">
                <div
                  className="inline-flex size-12 items-center justify-center rounded-2xl sm:size-14"
                  style={{ background: color + "20" }}
                >
                  <Icon className="size-6 sm:size-7" style={{ color }} />
                </div>
                <h1 className="text-[42px] leading-none font-bold text-foreground sm:text-[56px] lg:text-[64px]">
                  {category.label}
                </h1>
                <div className="flex gap-2 font-mono text-sm text-muted-foreground">
                  <span>{category.eventCount > 0 ? `${category.eventCount} wydarzeń` : "Wkrótce"}</span>
                </div>
              </div>
              <p className="max-w-2xl leading-relaxed text-muted-foreground lg:max-w-lg">
                {category.description}
              </p>
              <ICalSubscribeButton name={category.label} type="category" slug={category.slug} />
            </div>

            {/* visual card */}
            <div
              className="flex aspect-[16/10] max-w-md flex-col items-center justify-center gap-3 rounded-3xl border border-black/10 sm:aspect-[4/3] lg:aspect-[4/5] lg:max-w-none lg:gap-4"
              style={{
                backgroundColor: "#f0eee6",
                backgroundImage: "radial-gradient(circle, #c8c5bc 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            >
              <div
                className="rounded-3xl p-5 sm:p-6"
                style={{ background: color + "18" }}
              >
                <Icon className="size-14 sm:size-16 lg:size-20" strokeWidth={1.5} style={{ color }} />
              </div>
              <span className="text-lg font-semibold text-foreground sm:text-xl">{category.label}</span>
            </div>
          </div>
        </section>

        <section className="mt-2 pb-16 sm:mt-4 sm:pb-24">
          <div className="mx-auto grid max-w-[1040px] gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
            {/* events list */}
            <div>
              {events.length === 0 && (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-black/10 px-6 py-16 text-center">
                  <p className="font-semibold text-foreground">Wkrótce</p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Nie mamy jeszcze wydarzeń w tej kategorii. Subskrybuj kalendarz, aby otrzymać powiadomienie, gdy się pojawią.
                  </p>
                </div>
              )}

              {importantGroups.length > 0 && (
                <section className="mb-10">
                  <h2 className="mb-4 text-2xl text-foreground sm:text-[32px]">Najważniejsze wydarzenia</h2>
                  <EventList groups={importantGroups} />
                </section>
              )}

              {restGroups.length > 0 && (
                <section>
                  <h2 className="mb-2 text-2xl text-foreground sm:text-[32px]">Wydarzenia</h2>
                  <EventTimeline groups={restGroups} />
                </section>
              )}
            </div>

            {/* sidebar */}
            <div className="pt-0 lg:sticky lg:top-6 lg:pt-[72px]">
              <div className="flex flex-col gap-3 rounded-2xl bg-card p-5">
                <div className="flex items-center gap-3">
                  <div
                    className="inline-flex size-10 items-center justify-center rounded-xl"
                    style={{ background: color + "20" }}
                  >
                    <Icon className="size-5" style={{ color }} />
                  </div>
                  <span className="font-semibold text-foreground">{category.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Obserwuj, aby być na bieżąco z najnowszymi wydarzeniami, kalendarzami i aktualizacjami.
                </p>
                <ICalSubscribeButton name={category.label} type="category" slug={category.slug} fullWidth />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter lang="pl" />
    </>
  )
}
