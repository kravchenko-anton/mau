import { NextResponse } from "next/server"
import { events as allEvents } from "@/lib/event-data"
import type { Event } from "@/lib/event-data"
import { getCityBySlug } from "@/lib/cities"
import { getCategoryBySlug } from "@/lib/categories"

type RawEvent = Event

const APP_HOST = "mau.app"
const CALENDAR_TZ = "Europe/Warsaw"
const textEncoder = new TextEncoder()

const HTML_ENTITIES: Record<string, string> = {
  Aogon: "Ą",
  Cacute: "Ć",
  Eogon: "Ę",
  Lstrok: "Ł",
  Nacute: "Ń",
  Oacute: "Ó",
  Sacute: "Ś",
  Zacute: "Ź",
  Zdot: "Ż",
  aacute: "á",
  aogon: "ą",
  amp: "&",
  apos: "'",
  cacute: "ć",
  copy: "(c)",
  eacute: "é",
  eogon: "ę",
  gt: ">",
  hellip: "...",
  laquo: "<<",
  ldquo: '"',
  lstrok: "ł",
  lsquo: "'",
  lt: "<",
  mdash: "-",
  nacute: "ń",
  ndash: "-",
  nbsp: " ",
  oacute: "ó",
  quot: '"',
  raquo: ">>",
  reg: "(r)",
  rdquo: '"',
  rsquo: "'",
  sacute: "ś",
  zacute: "ź",
  zdot: "ż",
}

function compact(values: Array<string | undefined | null>): string[] {
  return values.map((value) => value?.trim()).filter((value): value is string => Boolean(value))
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, entity: string) => HTML_ENTITIES[entity] ?? HTML_ENTITIES[entity.toLowerCase()] ?? match)
}

function cleanText(value: string | undefined | null): string {
  return decodeHtmlEntities(value ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .trim()
}

function escapeIcs(value: string): string {
  return cleanText(value)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
}

// RFC 5545 content lines are folded by octets, not JavaScript characters.
function foldLine(line: string): string {
  if (textEncoder.encode(line).length <= 75) return line

  let remaining = line
  let out = ""
  let limit = 75

  while (textEncoder.encode(remaining).length > limit) {
    let bytes = 0
    let end = 0

    for (const char of remaining) {
      const charBytes = textEncoder.encode(char).length
      if (bytes + charBytes > limit) break
      bytes += charBytes
      end += char.length
    }

    out += remaining.slice(0, end) + "\r\n "
    remaining = remaining.slice(end)
    limit = 74
  }

  return out + remaining
}

function serializeLine(name: string, value: string): string {
  return foldLine(`${name}:${escapeIcs(value)}`)
}

function serializeUriLine(name: string, value: string): string {
  const uri = cleanText(value).replace(/[\n\r]/g, "")
  return uri ? foldLine(`${name};VALUE=URI:${uri}`) : ""
}

function isIsoDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false
  const [year, month, day] = dateStr.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

function dateToIcs(dateStr: string): string {
  return dateStr.replace(/-/g, "")
}

// DTEND for all-day events is exclusive, so it must be the day after the event ends.
function nextDay(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day + 1))
  return date.toISOString().slice(0, 10).replace(/-/g, "")
}

function currentWarsawDate(): string {
  const parts = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "2-digit",
    timeZone: CALENDAR_TZ,
    year: "numeric",
  }).formatToParts(new Date())

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function toUtcStamp(date = new Date()): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

function safeFileName(value: string): string {
  return value.replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "") || "events"
}

function isCalendarEvent(ev: RawEvent): boolean {
  return Boolean(cleanText(ev.name) && isIsoDate(ev.date_start) && isIsoDate(ev.date_end || ev.date_start))
}

function eventEndDate(ev: RawEvent): string {
  return isIsoDate(ev.date_end) ? ev.date_end : ev.date_start
}

function isUpcoming(ev: RawEvent, today: string): boolean {
  return eventEndDate(ev) >= today
}

function compareEvents(a: RawEvent, b: RawEvent): number {
  return (
    a.date_start.localeCompare(b.date_start) ||
    cleanText(a.name).localeCompare(cleanText(b.name), "en")
  )
}

function eventLocation(ev: RawEvent): string {
  const venue = compact([ev.place, ev.address]).join(", ") || ev.venue
  return compact([venue, ev.city]).join(", ")
}

function eventDescription(ev: RawEvent): string {
  return compact([
    ev.description,
    ev.time_start ? `Start time: ${ev.time_start}` : "",
    ev.type ? `Type: ${ev.type}` : "",
    ev.topic ? `Topic: ${ev.topic}` : "",
    ev.language ? `Language: ${ev.language}` : "",
    ev.price_pln ? `Price: ${ev.price_pln}` : "",
    ev.target_audience ? `Audience: ${ev.target_audience}` : "",
    ev.url ? `Website: ${ev.url}` : "",
  ]).join("\n\n")
}

function buildVEvent(ev: RawEvent, stamp: string): string {
  const categories = ev.category.map((category) => escapeIcs(category)).join(",")
  const lines = compact([
    "BEGIN:VEVENT",
    foldLine(`UID:event-${safeFileName(ev.slug || ev.id)}@${APP_HOST}`),
    `DTSTAMP:${stamp}`,
    `LAST-MODIFIED:${stamp}`,
    "SEQUENCE:0",
    "STATUS:CONFIRMED",
    "TRANSP:TRANSPARENT",
    "X-MICROSOFT-CDO-ALLDAYEVENT:TRUE",
    `DTSTART;VALUE=DATE:${dateToIcs(ev.date_start)}`,
    `DTEND;VALUE=DATE:${nextDay(eventEndDate(ev))}`,
    serializeLine("SUMMARY", ev.name),
    serializeLine("DESCRIPTION", eventDescription(ev)),
    serializeLine("LOCATION", eventLocation(ev)),
    categories ? foldLine(`CATEGORIES:${categories}`) : "",
    serializeUriLine("URL", ev.url),
    "END:VEVENT",
  ])
  return lines.join("\r\n")
}

function buildCalendar(calName: string, calDesc: string, events: RawEvent[]): string {
  const stamp = toUtcStamp()
  const header = compact([
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//mau.app//Events Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    serializeLine("NAME", calName),
    serializeLine("X-WR-CALNAME", calName),
    serializeLine("X-WR-CALDESC", calDesc),
    `X-WR-TIMEZONE:${CALENDAR_TZ}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
    "X-PUBLISHED-TTL:PT12H",
  ]).join("\r\n")

  const today = currentWarsawDate()
  const vevents = events
    .filter(isCalendarEvent)
    .filter((event) => isUpcoming(event, today))
    .sort(compareEvents)
    .map((event) => buildVEvent(event, stamp))
    .join("\r\n")

  return `${header}\r\n${vevents ? `${vevents}\r\n` : ""}END:VCALENDAR\r\n`
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  const { type, slug } = await params
  const { searchParams } = new URL(request.url)
  const download = ["1", "true", "yes"].includes((searchParams.get("download") ?? "").toLowerCase())

  let events: RawEvent[] = []
  let calName = "mau.app events"
  let calDesc = "Upcoming tech events in Poland"

  if (type === "city") {
    const city = getCityBySlug(slug)
    if (!city) return new NextResponse("Not found", { status: 404 })
    events = allEvents.filter((event) => event.city === city.name)
    calName = `${city.name} events - mau.app`
    calDesc = `Upcoming events in ${city.name}`
  } else if (type === "category") {
    const category = getCategoryBySlug(slug)
    if (!category) return new NextResponse("Not found", { status: 404 })
    events = allEvents.filter((event) => event.category.includes(category.key))
    calName = `${category.label} events - mau.app`
    calDesc = category.description
  } else {
    return new NextResponse("Not found", { status: 404 })
  }

  const ics = buildCalendar(calName, calDesc, events)

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${safeFileName(slug)}.ics"`,
      "Content-Transfer-Encoding": "binary",
      "Cache-Control": "public, max-age=43200, s-maxage=43200",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
