import rawEvents from "@/public/events.json"

export type City = {
  slug: string
  name: string
  image: string
  description: string
  eventCount: number | null
}

// Static definitions; eventCount is derived from the data below by matching `name`.
const cityDefs: Omit<City, "eventCount">[] = [
  {
    slug: "warsaw",
    name: "Warszawa",
    image: "/cities/warsaw 1.png",
    description: "Warszawa to dynamiczna stolica Polski — centrum kultury, biznesu i innowacji. Miasto pełne kontrastów, gdzie nowoczesna architektura sąsiaduje z historycznym centrum. Co roku przyjmuje miliony gości na tysiące wydarzeń kulturalnych, sportowych i biznesowych.",
  },
  {
    slug: "krakow",
    name: "Kraków",
    image: "/cities/krakow 2.png",
    description: "Kraków — dawna stolica Polski i jedno z najpiękniejszych miast Europy. Miasto o bogatej historii, tętniące życiem kulturalnym przez cały rok. Festiwale muzyczne, wystawy sztuki, targi i koncerty przyciągają tu tysiące gości.",
  },
  {
    slug: "wroclaw",
    name: "Wrocław",
    image: "/cities/wroclaw 1.png",
    description: "Wrocław — miasto stu mostów i nieskończonych możliwości. Europejska Stolica Kultury 2016, pełna energii akademickiego ośrodka. Bogate życie nocne, festiwale, targi i eventy startupowe przyciągają coraz więcej gości.",
  },
  {
    slug: "poznan",
    name: "Poznań",
    image: "/cities/poznan 1.png",
    description: "Poznań to miasto, które łączy tradycję z nowoczesnością. Kolebka polskiej państwowości i centrum targowe Europy Środkowej. Słynne Juwenalia, Malta Festival, Pyrkon — tu zawsze coś się dzieje.",
  },
  {
    slug: "gdansk",
    name: "Gdańsk",
    image: "/cities/gdansk 1.png",
    description: "Gdańsk — miasto wolności, morza i bursztynu. Historyczna perła Trójmiasta, miejsce narodzin Solidarności. Letnie festiwale, regaty, jarmarki i muzyczne wieczory nad Motławą tworzą niepowtarzalny klimat.",
  },
]

function countByCity(name: string): number {
  const today = new Date().toISOString().slice(0, 10)
  return rawEvents.filter((e) => e.city === name && e.date_end >= today).length
}

export const cities: City[] = cityDefs.map((c) => {
  const count = countByCity(c.name)
  return { ...c, eventCount: count > 0 ? count : null }
})

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug)
}
