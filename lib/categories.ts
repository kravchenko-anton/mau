import { Drama, Users, Laptop, Briefcase, Palette, Code2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type Category = {
  slug: string
  label: string
  description: string
  eventCount: number
  icon: LucideIcon
  color: string
  eventType: string
}

export const categories: Category[] = [
  {
    slug: "kultura",
    label: "Kultura",
    description: "Festiwale literackie, muzyczne, filmowe i teatralne. Przeglądaj najciekawsze wydarzenia kulturalne w polskich miastach — od kameralnych wernisaży po wielkie plenerowe festiwale.",
    eventCount: 13,
    icon: Drama,
    color: "#ef4444",
    eventType: "culture",
  },
  {
    slug: "spolecznosc",
    label: "Społeczność",
    description: "Marsze, spotkania, pikniki i akcje miejskie. Tutaj dzieje się Polska — inicjatywy oddolne, wolontariat i festiwale łączące ludzi ze wspólnymi wartościami.",
    eventCount: 10,
    icon: Users,
    color: "#f97316",
    eventType: "social",
  },
  {
    slug: "tech",
    label: "Technologie",
    description: "Konferencje IT, hackathony, gaming i targi tech. Poznaj najnowsze trendy w branży — od startupów po wielkie targi technologiczne.",
    eventCount: 3,
    icon: Laptop,
    color: "#2563eb",
    eventType: "tech",
  },
  {
    slug: "biznes",
    label: "Biznes",
    description: "Targi, konferencje i eventy networkingowe. Networking, pitche startupów i branżowe konferencje dla przedsiębiorców i managerów.",
    eventCount: 1,
    icon: Briefcase,
    color: "#16a34a",
    eventType: "business",
  },
  {
    slug: "sztuka",
    label: "Sztuka",
    description: "Wystawy, performanse, wernisaże i festiwale sztuki współczesnej. Odkryj polską scenę artystyczną — od klasyki po awangardę.",
    eventCount: 11,
    icon: Palette,
    color: "#a855f7",
    eventType: "art",
  },
  {
    slug: "hackathony",
    label: "Hackathony",
    description: "Intensywne maratony kodowania, tworzenia i innowacji. Rywalizuj z najlepszymi, poznaj nowych partnerów i stwórz coś wartościowego w 24–48 godzin.",
    eventCount: 0,
    icon: Code2,
    color: "#06b6d4",
    eventType: "hackathon",
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}
