import rawEvents from "@/public/events.json"
import { EventIconBox } from "@/components/discover/event-list"
import type { MonthGroup } from "@/components/discover/event-list"

export type RawEvent = (typeof rawEvents)[number]

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

// Groups events by calendar month, chronologically.
function groupByMonth(events: RawEvent[]): [number, RawEvent[]][] {
  const byMonth = new Map<number, RawEvent[]>()
  for (const ev of [...events].sort((a, b) => a.date_start.localeCompare(b.date_start))) {
    const month = new Date(ev.date_start).getMonth()
    if (!byMonth.has(month)) byMonth.set(month, [])
    byMonth.get(month)!.push(ev)
  }
  return [...byMonth.entries()].sort(([a], [b]) => a - b)
}

export type EventCard = {
  name: string
  dateRange: string
  venue: string
  type: string
  important: boolean
  imageUrl: string | null
  url: string
}

export type EventCardGroup = {
  month: string
  events: EventCard[]
}

// Keep only events that haven't finished yet (end date today or later).
function isUpcoming(e: RawEvent): boolean {
  const today = new Date().toISOString().slice(0, 10)
  return e.date_end >= today
}

// Events tagged with the given category slug (e.g. "kultura", "technologie").
export function getEventsByCategory(categoryKey: string): RawEvent[] {
  return rawEvents.filter((e) => e.category.includes(categoryKey) && isUpcoming(e))
}

// Events happening in the given city name as stored in the data (e.g. "Poznań").
export function getEventsByCity(cityName: string): RawEvent[] {
  return rawEvents.filter((e) => e.city === cityName && isUpcoming(e))
}

// Compact list style (icon + name + meta), used for the "important" block.
export function toListGroups(events: RawEvent[]): MonthGroup[] {
  return groupByMonth(events).map(([month, evs]) => ({
    month: MONTH_NAMES[month],
    barColor: MONTH_COLORS[month],
    events: evs.map((ev) => ({
      name: ev.name,
      meta: ev.target_audience ?? "",
      location: ev.venue.split(",")[0],
      date: formatDateRange(ev.date_start, ev.date_end),
      url: ev.url,
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

// Rich card style (image + venue + date), used for the regular block.
export function toCardGroups(events: RawEvent[]): EventCardGroup[] {
  return groupByMonth(events).map(([month, evs]) => ({
    month: MONTH_NAMES[month],
    events: evs.map((ev) => ({
      name: ev.name,
      dateRange: formatDateRange(ev.date_start, ev.date_end),
      venue: ev.venue.split(",")[0],
      type: ev.type,
      important: ev.important,
      imageUrl: ev.image_url ?? null,
      url: ev.url,
    })),
  }))
}
