import { NextResponse } from "next/server"
import rawEvents from "@/public/events.json"
import { getCityBySlug } from "@/lib/cities"
import { getCategoryBySlug } from "@/lib/categories"

type RawEvent = (typeof rawEvents)[number]

function escapeIcs(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "")
}

// ICS lines must be max 75 octets; fold longer ones
function foldLine(line: string): string {
  if (line.length <= 75) return line
  let out = ""
  while (line.length > 75) {
    out += line.slice(0, 75) + "\r\n "
    line = line.slice(75)
  }
  return out + line
}

// DTEND for all-day events must be the day after
function nextDay(dateStr: string): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10).replace(/-/g, "")
}

function dateToIcs(dateStr: string): string {
  return dateStr.replace(/-/g, "")
}

function buildVEvent(ev: RawEvent): string {
  const lines = [
    "BEGIN:VEVENT",
    foldLine(`UID:event-${ev.id}@mau.app`),
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${dateToIcs(ev.date_start)}`,
    `DTEND;VALUE=DATE:${nextDay(ev.date_end)}`,
    foldLine(`SUMMARY:${escapeIcs(ev.name)}`),
    foldLine(`DESCRIPTION:${escapeIcs(ev.description ?? "")}`),
    foldLine(`LOCATION:${escapeIcs(ev.venue)}`),
    foldLine(`URL:${ev.url}`),
    "END:VEVENT",
  ]
  return lines.join("\r\n")
}

function buildCalendar(calName: string, calDesc: string, events: RawEvent[]): string {
  const header = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//mau.app//Events Calendar//PL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    foldLine(`X-WR-CALNAME:${escapeIcs(calName)}`),
    foldLine(`X-WR-CALDESC:${escapeIcs(calDesc)}`),
    "X-WR-TIMEZONE:Europe/Warsaw",
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
    "X-PUBLISHED-TTL:PT12H",
  ].join("\r\n")

  const vevents = events.map(buildVEvent).join("\r\n")
  return `${header}\r\n${vevents}\r\nEND:VCALENDAR`
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  const { type, slug } = await params

  let events: RawEvent[] = []
  let calName = "mau.app"
  let calDesc = "Nadchodzące wydarzenia"

  if (type === "city") {
    const city = getCityBySlug(slug)
    if (!city) return new NextResponse("Not found", { status: 404 })
    // All events are from Poznań — show them for Poznań; others get empty feed for now
    events = slug === "poznan" ? rawEvents : []
    calName = `${city.name} — mau.app`
    calDesc = `Nadchodzące wydarzenia w ${city.name}`
  } else if (type === "category") {
    const category = getCategoryBySlug(slug)
    if (!category) return new NextResponse("Not found", { status: 404 })
    events = rawEvents.filter((e) => e.type === category.eventType)
    calName = `${category.label} — mau.app`
    calDesc = category.description
  } else {
    return new NextResponse("Not found", { status: 404 })
  }

  const ics = buildCalendar(calName, calDesc, events)

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.ics"`,
      "Cache-Control": "public, max-age=43200", // 12h
    },
  })
}
