import rawEvents from "@/public/events.json"
import { EventIconBox } from "@/components/discover/event-list"
import type { MonthGroup } from "@/components/discover/event-list"

type RawEvent = (typeof rawEvents)[number]

const MONTH_NAMES = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
]

const MONTH_COLORS = [
  "#6366f1", "#8b5cf6", "#22c55e", "#eab308", "#f97316", "#ef4444",
  "#06b6d4", "#f59e0b", "#10b981", "#a855f7", "#3b82f6", "#ec4899",
]

function formatDateRange(start: string, end: string): string {
  const s = new Date(start)
  const e = new Date(end)
  const fmt = (d: Date) => `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, "0")}`
  if (start === end) return fmt(s)
  return `${fmt(s)} — ${fmt(e)}`
}

function initials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
}

function buildGroups(events: RawEvent[]): MonthGroup[] {
  const byMonth = new Map<number, RawEvent[]>()
  for (const ev of events) {
    const month = new Date(ev.date_start).getMonth()
    if (!byMonth.has(month)) byMonth.set(month, [])
    byMonth.get(month)!.push(ev)
  }

  return [...byMonth.entries()]
    .sort(([a], [b]) => a - b)
    .map(([month, evs]) => ({
      month: MONTH_NAMES[month],
      barColor: MONTH_COLORS[month],
      events: evs.map((ev) => ({
        name: ev.name,
        meta: ev.target_audience ?? "",
        location: ev.venue.split(",")[0],
        date: formatDateRange(ev.date_start, ev.date_end),
        icon: (
          <EventIconBox
            style={{
              background: MONTH_COLORS[month] + "22",
              color: MONTH_COLORS[month],
              fontSize: "10px",
            }}
          >
            {initials(ev.name)}
          </EventIconBox>
        ),
      })),
    }))
}

export type CityEventGroup = {
  month: string
  events: {
    name: string
    dateRange: string
    venue: string
    type: string
    imageUrl: string | null
    url: string
  }[]
}

export function getCityEventGroups(): CityEventGroup[] {
  const byMonth = new Map<number, RawEvent[]>()
  for (const ev of rawEvents) {
    const month = new Date(ev.date_start).getMonth()
    if (!byMonth.has(month)) byMonth.set(month, [])
    byMonth.get(month)!.push(ev)
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a - b)
    .map(([month, evs]) => ({
      month: MONTH_NAMES[month],
      events: evs.map((ev) => ({
        name: ev.name,
        dateRange: formatDateRange(ev.date_start, ev.date_end),
        venue: ev.venue.split(",")[0],
        type: ev.type,
        imageUrl: ev.image_url ?? null,
        url: ev.url,
      })),
    }))
}

export function getEventGroups(filterType?: string): MonthGroup[] {
  const events = filterType
    ? rawEvents.filter((e) => e.type === filterType)
    : rawEvents
  const groups = buildGroups(events)
  // fallback to all events if filter yields nothing
  return groups.length ? groups : buildGroups(rawEvents)
}
