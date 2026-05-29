export type City = {
  slug: string
  name: string
  image: string
  description: string
  eventCount: number | null
}

export const cities: City[] = [
  {
    slug: "warsaw",
    name: "Warszawa",
    image: "/cities/warsaw 1.png",
    description: "Warszawa to dynamiczna stolica Polski — centrum kultury, biznesu i innowacji. Miasto pełne kontrastów, gdzie nowoczesna architektura sąsiaduje z historycznym centrum. Co roku przyjmuje miliony gości na tysiące wydarzeń kulturalnych, sportowych i biznesowych.",
    eventCount: null,
  },
  {
    slug: "krakow",
    name: "Kraków",
    image: "/cities/krakow 2.png",
    description: "Kraków — dawna stolica Polski i jedno z najpiękniejszych miast Europy. Miasto o bogatej historii, tętniące życiem kulturalnym przez cały rok. Festiwale muzyczne, wystawy sztuki, targi i koncerty przyciągają tu tysiące gości.",
    eventCount: null,
  },
  {
    slug: "wroclaw",
    name: "Wrocław",
    image: "/cities/wroclaw 1.png",
    description: "Wrocław — miasto stu mostów i nieskończonych możliwości. Europejska Stolica Kultury 2016, pełna energii akademickiego ośrodka. Bogate życie nocne, festiwale, targi i eventy startupowe przyciągają coraz więcej gości.",
    eventCount: null,
  },
  {
    slug: "poznan",
    name: "Poznań",
    image: "/cities/poznan 1.png",
    description: "Poznań to miasto, które łączy tradycję z nowoczesnością. Kolebka polskiej państwowości i centrum targowe Europy Środkowej. Słynne Juwenalia, Malta Festival, Pyrkon — tu zawsze coś się dzieje.",
    eventCount: 38,
  },
  {
    slug: "gdansk",
    name: "Gdańsk",
    image: "/cities/gdansk 1.png",
    description: "Gdańsk — miasto wolności, morza i bursztynu. Historyczna perła Trójmiasta, miejsce narodzin Solidarności. Letnie festiwale, regaty, jarmarki i muzyczne wieczory nad Motławą tworzą niepowtarzalny klimat.",
    eventCount: null,
  },
]

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug)
}
