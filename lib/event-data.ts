import rawEvents from "@/public/events.json"

type LegacyEvent = {
  id?: number | string
  slug?: string
  name?: string
  category?: string[] | string
  city?: string
  important?: boolean
  type?: string
  date_start?: string
  date_end?: string
  venue?: string
  price_pln?: string
  target_audience?: string
  image_url?: string
  url?: string
  description?: string
}

type ParsedEvent = {
  slug?: string
  event?: {
    name?: string
    type?: string
    category?: string[] | string
    topic?: string
    language?: string
    price?: {
      type?: string
    }
    date?: {
      start?: string
      end?: string
    }
    time?: {
      start?: string
    }
    location?: {
      city?: string
      place?: string
      address?: string
    }
    website?: string
    description?: {
      short?: string
    }
    target_audience?: string
    image_url?: string
  }
}

type SourceEvent = LegacyEvent & ParsedEvent

export type Event = {
  id: string
  slug: string
  name: string
  category: string[]
  city: string
  important: boolean
  type: string
  date_start: string
  date_end: string
  venue: string
  place: string
  address: string
  price_pln: string
  target_audience: string
  image_url: string | null
  url: string
  description: string
  topic: string
  language: string
  time_start: string
}

const CITY_NAMES: Record<string, string> = {
  Warsaw: "Warszawa",
  Krakow: "Kraków",
  Wroclaw: "Wrocław",
  Poznan: "Poznań",
  Gdansk: "Gdańsk",
  Lodz: "Łódź",
  Torun: "Toruń",
  Rzeszow: "Rzeszów",
  Bialystok: "Białystok",
  Tricity: "Trójmiasto",
}

function compact(values: Array<string | undefined | null>): string[] {
  return values.map((value) => value?.trim()).filter((value): value is string => Boolean(value))
}

function categoryList(category: string[] | string | undefined): string[] {
  if (Array.isArray(category)) return compact(category)
  return compact((category ?? "").split(","))
}

function normalizeCity(city: string | undefined): string {
  const value = city?.trim() ?? ""
  return CITY_NAMES[value] ?? value
}

function crosswebUrl(slug: string): string {
  return slug ? `https://crossweb.pl/en/events/${slug}/` : ""
}

function placeFromVenue(venue: string | undefined): string {
  return venue?.split(",")[0]?.trim() ?? ""
}

function normalizeEvent(item: SourceEvent, index: number): Event {
  const parsed = item.event
  const slug = item.slug ?? ""
  const place = parsed?.location?.place ?? placeFromVenue(item.venue)
  const address = parsed?.location?.address ?? ""
  const venue = compact([item.venue, compact([place, address]).join(", ")]).at(0) ?? ""
  const dateStart = item.date_start ?? parsed?.date?.start ?? ""
  const dateEnd = item.date_end ?? parsed?.date?.end ?? dateStart

  return {
    id: String(item.id ?? (slug || index + 1)),
    slug,
    name: item.name ?? parsed?.name ?? "",
    category: categoryList(item.category ?? parsed?.category),
    city: normalizeCity(item.city ?? parsed?.location?.city),
    important: item.important ?? false,
    type: item.type ?? parsed?.type ?? "",
    date_start: dateStart,
    date_end: dateEnd,
    venue,
    place,
    address,
    price_pln: item.price_pln ?? parsed?.price?.type ?? "",
    target_audience: item.target_audience ?? parsed?.target_audience ?? "",
    image_url: item.image_url ?? parsed?.image_url ?? null,
    url: item.url ?? parsed?.website ?? crosswebUrl(slug),
    description: item.description ?? parsed?.description?.short ?? "",
    topic: parsed?.topic ?? "",
    language: parsed?.language ?? "",
    time_start: parsed?.time?.start ?? "",
  }
}

export const events: Event[] = (rawEvents as SourceEvent[]).map(normalizeEvent)
