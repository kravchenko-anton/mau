#!/usr/bin/env node
/*
 * Парсер детальных страниц ивентов crossweb.pl → conferences.json
 *
 * Запуск:
 *   node scripts/parse-conferences.cjs <файл-или-папка> [ещё...] [--out=conferences.json]
 *
 * Примеры:
 *   node scripts/parse-conferences.cjs ./pages                 # все *.html из папки
 *   node scripts/parse-conferences.cjs ./a.html ./b.html       # конкретные файлы
 *   node scripts/parse-conferences.cjs ./pages --out=public/conferences.json
 *
 * Каждый .html = одна детальная страница ивента = одна запись в итоговом массиве.
 */

const fs = require("fs")
const path = require("path")

const BASE = "https://crossweb.pl"

// ---- аргументы ----
const args = process.argv.slice(2)
let out = "conferences.json"
const inputs = []
for (const a of args) {
  if (a.startsWith("--out=")) out = a.slice(6)
  else inputs.push(a)
}
if (!inputs.length) {
  console.error("Usage: node scripts/parse-conferences.cjs <файл-или-папка> [...] [--out=conferences.json]")
  process.exit(1)
}

// собираем все .html из переданных файлов/папок (рекурсивно)
function collect(p, acc) {
  const st = fs.statSync(p)
  if (st.isDirectory()) for (const f of fs.readdirSync(p)) collect(path.join(p, f), acc)
  else if (/\.html?$/i.test(p)) acc.push(p)
  return acc
}
const files = inputs.flatMap((p) => collect(p, []))

// ---- хелперы ----
const decode = (s = "") =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()

const abs = (u = "") => (!u ? null : u.startsWith("http") ? u : BASE + u)

const CITY_MAP = {
  Krakow: "Kraków", Poznan: "Poznań", Warsaw: "Warszawa", Lodz: "Łódź",
  Wroclaw: "Wrocław", Tricity: "Trójmiasto", Rzeszow: "Rzeszów", Torun: "Toruń",
  Bialystok: "Białystok", "Bielsko Biała": "Bielsko-Biała",
}

// значение блока <div class="event-var"> сразу после <div class="event-label">LABEL...
function varAfter(html, label) {
  const re = new RegExp('event-label">\\s*' + label + '[\\s\\S]*?event-var[^>]*>([\\s\\S]*?)<\\/div>', "i")
  const m = html.match(re)
  return m ? m[1] : ""
}

function classify(format, category) {
  if (/fair/i.test(format) || /(business|marketing|\bhr\b|recruit|rekrut)/i.test(category)) {
    return { type: "business", category: ["biznes"] }
  }
  return { type: "tech", category: ["technologie"] }
}

// "20260530T070000Z" → "2026-05-30T07:00:00Z"
const icsToIso = (s) =>
  s && /^\d{8}T\d{6}Z$/.test(s)
    ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(9, 11)}:${s.slice(11, 13)}:${s.slice(13, 15)}Z`
    : null

// ---- парсинг одной страницы ----
function parse(html, id) {
  if (!/h1-detail/.test(html)) return null // не детальная страница ивента

  const sourceId = (html.match(/id="hidden-eventid"\s+value="(\d+)"/) || [])[1] || null
  const name = decode((html.match(/<h1 class="h1-detail">([\s\S]*?)<\/h1>/) || [])[1] || "")
  const imageUrl = abs((html.match(/class="event-image"[^>]*src="([^"]+)"/) || (html.match(/src="([^"]+)"[^>]*class="event-image"/) || []))[1])

  const format = decode(varAfter(html, "Event type"))
  const sourceCategory = decode(varAfter(html, "Category"))
  const topics = [...varAfter(html, "Topic").matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map((m) => decode(m[1])).filter(Boolean)

  // дата (день.месяц.год)
  const dateTxt = decode(varAfter(html, "Date"))
  const dm = dateTxt.match(/(\d{2})\.(\d{2})\.(\d{4})/)
  const dateStart = dm ? `${dm[3]}-${dm[2]}-${dm[1]}` : null

  const timeStart = (decode(varAfter(html, "Time")).match(/\d{1,2}:\d{2}/) || [null])[0]
  const language = decode(varAfter(html, "Language")) || null
  const price = decode(varAfter(html, "Price")) || null

  const cityRaw = decode(varAfter(html, "City"))
  const city = CITY_MAP[cityRaw] || cityRaw || null

  // площадка + адрес + ссылка на карту
  const venue = decode((html.match(/itemprop="location"[\s\S]*?itemprop="name"[^>]*>([\s\S]*?)<\/div>/) || [])[1] || varAfter(html, "Place")) || null
  const addrAnchor = html.match(/itemprop="streetAddress"[^>]*href="([^"]+)"|href="([^"]+)"[^>]*itemprop="streetAddress"/)
  const mapsUrl = addrAnchor ? (addrAnchor[1] || addrAnchor[2]).replace(/&amp;/g, "&") : null
  const address = decode((html.match(/itemprop="streetAddress"[^>]*>([^<]+)<\/a>/) || [])[1] || "") || null

  // офиц. сайт ("Strona www")
  const website = abs(((varAfter(html, "Strona www") || varAfter(html, "Website")).match(/href="([^"]+)"/) || [])[1])

  // точные дата-время из ссылки Google Calendar
  const gcal = html.match(/calendar\/render[^"]*?dates=(\d{8}T\d{6}Z)\/(\d{8}T\d{6}Z)/)
  const startsAt = gcal ? icsToIso(gcal[1]) : null
  const endsAt = gcal ? icsToIso(gcal[2]) : null
  const dateEnd = endsAt ? endsAt.slice(0, 10) : dateStart

  // описание (полный текст)
  const description = decode(
    ((html.match(/event-var ql-editor">([\s\S]*?)<\/div>/) || [])[1] || "").replace(/<\/p>/g, "\n").replace(/<br\s*\/?>/g, "\n")
  ) || null

  // спикеры
  const speakers = [...html.matchAll(/speaker-name[^>]*>\s*<a href="([^"]+)">([^<]+)<\/a>/g)].map((m) => ({
    name: decode(m[2]),
    profile: abs(m[1]),
  }))
  const speakersCount = parseInt((html.match(/Show all speakers \((\d+)\)/) || [])[1], 10) || speakers.length || 0

  // серии / организатор (сайдбар)
  const series = [...html.matchAll(/<h2 class="font-detail">\s*<a href="([^"]+)">([\s\S]*?)<\/a>/g)].map((m) => ({
    name: decode(m[2]),
    url: abs(m[1]),
  }))

  const crosswebUrl = abs(
    (html.match(/sprop=website:[^&]*?(\/en\/events\/[a-z0-9-]+\/)/) || [])[1] ||
      (html.match(/href="(\/en\/events\/[a-z0-9-]+\/)"/) || [])[1]
  )
  const slug = (crosswebUrl && (crosswebUrl.match(/\/events\/([a-z0-9-]+)\//) || [])[1]) || null

  const { type, category } = classify(format, sourceCategory)

  return {
    id,
    source_id: sourceId,
    name,
    slug,
    format: format || null,
    type,
    category,
    source_category: sourceCategory || null,
    topics,
    city,
    venue,
    address,
    maps_url: mapsUrl,
    date_start: dateStart,
    date_end: dateEnd,
    time_start: timeStart,
    starts_at: startsAt,
    ends_at: endsAt,
    language,
    price_pln: price,
    important: false,
    image_url: imageUrl,
    website,
    url: crosswebUrl,
    description,
    speakers,
    speakers_count: speakersCount,
    series,
    organizer: series[0] ? series[0].name : null,
  }
}

// ---- запуск ----
const events = []
let id = 1
let skipped = 0
for (const f of files) {
  const ev = parse(fs.readFileSync(f, "utf8"), id)
  if (ev) {
    events.push(ev)
    id++
  } else {
    skipped++
  }
}

fs.writeFileSync(out, JSON.stringify(events, null, "\t") + "\n", "utf8")
console.log(`Файлов обработано: ${files.length} | ивентов: ${events.length} | пропущено (не детальные): ${skipped}`)
console.log(`Записано: ${out}`)
