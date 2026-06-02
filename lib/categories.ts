import { Drama, Users, Laptop, Briefcase, Palette, Code2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import rawEvents from "@/public/events.json"

export type Category = {
  slug: string
  // Tag used in each event's `category` array (events.json). May differ from the URL slug.
  key: string
  label: string
  description: string
  eventCount: number
  icon: LucideIcon
  color: string
}

// Static definitions; eventCount is filled in from the data below.
const categoryDefs: Omit<Category, "eventCount">[] = [
  {
    slug: "kultura",
    key: "kultura",
    label: "Kultura",
    description: "Festiwale literackie, muzyczne, filmowe i teatralne. Przeglądaj najciekawsze wydarzenia kulturalne w polskich miastach — od kameralnych wernisaży po wielkie plenerowe festiwale.",
    icon: Drama,
    color: "#ef4444",
  },
  {
    slug: "spolecznosc",
    key: "spolecznosc",
    label: "Społeczność",
    description: "Marsze, spotkania, pikniki i akcje miejskie. Tutaj dzieje się Polska — inicjatywy oddolne, wolontariat i festiwale łączące ludzi ze wspólnymi wartościami.",
    icon: Users,
    color: "#f97316",
  },
  {
    slug: "tech",
    key: "technologie",
    label: "Technologie",
    description: "Konferencje IT, hackathony, gaming i targi tech. Poznaj najnowsze trendy w branży — od startupów po wielkie targi technologiczne.",
    icon: Laptop,
    color: "#2563eb",
  },
  {
    slug: "biznes",
    key: "biznes",
    label: "Biznes",
    description: "Targi, konferencje i eventy networkingowe. Networking, pitche startupów i branżowe konferencje dla przedsiębiorców i managerów.",
    icon: Briefcase,
    color: "#16a34a",
  },
  {
    slug: "sztuka",
    key: "sztuka",
    label: "Sztuka",
    description: "Wystawy, performanse, wernisaże i festiwale sztuki współczesnej. Odkryj polską scenę artystyczną — od klasyki po awangardę.",
    icon: Palette,
    color: "#a855f7",
  },
  {
    slug: "hackathony",
    key: "hackathon",
    label: "Hackathony",
    description: "Intensywne maratony kodowania, tworzenia i innowacji. Rywalizuj z najlepszymi, poznaj nowych partnerów i stwórz coś wartościowego w 24–48 godzin.",
    icon: Code2,
    color: "#06b6d4",
  },
]

function countByCategory(key: string): number {
  const today = new Date().toISOString().slice(0, 10)
  return rawEvents.filter((e) => e.category.includes(key) && e.date_end >= today).length
}

export const categories: Category[] = categoryDefs.map((c) => ({
  ...c,
  eventCount: countByCategory(c.key),
}))

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}
