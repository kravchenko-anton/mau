import { SiteHeader } from "@/components/discover/site-header"
import { SiteFooter } from "@/components/discover/site-footer"
import { EventList } from "@/components/discover/event-list"
import { getEventGroups } from "@/lib/events"
import { ICalSubscribeButton } from "@/components/ical-subscribe-button"
import type { Category } from "@/lib/categories"

export function CategoryPage({ category }: { category: Category }) {
  const { icon: Icon, color } = category
  const groups = getEventGroups(category.eventType)

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-10">
        <section className="pt-[112px] pb-12">
          <div className="grid grid-cols-[1fr_340px] gap-10 items-start">
            {/* category info */}
            <div className="flex flex-col gap-6 pt-4">
              <div className="flex flex-col gap-3">
                <div
                  className="inline-flex size-14 items-center justify-center rounded-2xl"
                  style={{ background: color + "20" }}
                >
                  <Icon className="size-7" style={{ color }} />
                </div>
                <h1 className="text-[64px] leading-none font-bold text-foreground">
                  {category.label}
                </h1>
                <div className="flex gap-2 font-mono text-sm text-muted-foreground">
                  <span>{category.eventCount > 0 ? `${category.eventCount} wydarzeń` : "Wkrótce"}</span>
                </div>
              </div>
              <p className="max-w-lg leading-relaxed text-muted-foreground">
                {category.description}
              </p>
              <ICalSubscribeButton name={category.label} type="category" slug={category.slug} />
            </div>

            {/* visual card */}
            <div
              className="flex aspect-[4/5] flex-col items-center justify-center gap-4 rounded-3xl border border-black/10"
              style={{
                backgroundColor: "#f0eee6",
                backgroundImage: "radial-gradient(circle, #c8c5bc 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            >
              <div
                className="rounded-3xl p-6"
                style={{ background: color + "18" }}
              >
                <Icon className="size-20" strokeWidth={1.5} style={{ color }} />
              </div>
              <span className="text-xl font-semibold text-foreground">{category.label}</span>
            </div>
          </div>
        </section>

        <section className="mt-4 pb-24">
          <div className="grid grid-cols-[1fr_300px] gap-8 items-start">
            {/* events list */}
            <div>
              <h2 className="mb-7 text-[32px] text-foreground">Nadchodzące ważne wydarzenia</h2>
              <EventList groups={groups} />
            </div>

            {/* sidebar */}
            <div className="sticky top-6 pt-[72px]">
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
