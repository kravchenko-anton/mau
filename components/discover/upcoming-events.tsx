import { Landmark, Anchor, Code, Smartphone } from "lucide-react"
import { EventList, EventIconBox, type MonthGroup } from "@/components/discover/event-list"

const groups: MonthGroup[] = [
  {
    month: "Maj",
    barColor: "var(--foreground)",
    events: [
      {
        name: "Warsaw Tech Week",
        meta: "10 wydarzeń · 375 subskrybentów",
        location: "Warszawa, Polska",
        date: "26.05 — 31.05",
        icon: (
          <EventIconBox style={{ background: "var(--secondary)", color: "var(--foreground)" }}>
            <Landmark className="size-[19px]" />
          </EventIconBox>
        ),
      },
    ],
  },
  {
    month: "Czerwiec",
    barColor: "var(--foreground)",
    events: [
      {
        name: "Infoshare 2026",
        meta: "7 wydarzeń · 63 subskrybentów",
        location: "Gdańsk, Polska",
        date: "1.06 — 4.06",
        icon: (
          <EventIconBox style={{ background: "var(--secondary)", color: "var(--foreground)" }}>
            <Anchor className="size-[19px]" />
          </EventIconBox>
        ),
      },
      {
        name: "Code Europe",
        meta: "166 wydarzeń · 7 tys. subskrybentów",
        location: "Kraków, Polska",
        date: "1.06 — 7.06",
        icon: (
          <EventIconBox style={{ background: "var(--secondary)", color: "var(--foreground)" }}>
            <Code className="size-[19px]" />
          </EventIconBox>
        ),
      },
      {
        name: "Wolves Summit",
        meta: "32 wydarzenia · 70 subskrybentów",
        location: "Warszawa, Polska",
        date: "8.06 — 12.06",
        icon: <EventIconBox style={{ background: "var(--foreground)", color: "var(--background)" }}>WS</EventIconBox>,
      },
    ],
  },
  {
    month: "Październik",
    barColor: "var(--foreground)",
    events: [
      {
        name: "Mobiconf",
        meta: "0 wydarzeń · 1 tys. subskrybentów",
        location: "Kraków, Polska",
        date: "12.10 — 18.10",
        icon: (
          <EventIconBox style={{ background: "var(--secondary)", color: "var(--foreground)" }}>
            <Smartphone className="size-[19px]" />
          </EventIconBox>
        ),
      },
    ],
  },
]

export function UpcomingEvents() {
  return (
    <section className="reveal reveal-3 mt-16 sm:mt-20 lg:mt-24">
      <h2 className="mb-5 text-2xl text-foreground sm:mb-7 sm:text-[32px]">Nadchodzące ważne wydarzenia</h2>
      <EventList groups={groups} />
    </section>
  )
}
